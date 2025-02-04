import {
  BaseMetadataFieldValidator,
  NewDatasetMetadataFieldAndValueInfo
} from './BaseMetadataFieldValidator'
import { NewDatasetMetadataFieldValueDTO } from '../../dtos/NewDatasetDTO'
import { SingleMetadataFieldValidator } from './SingleMetadataFieldValidator'
import { MetadataFieldType } from '../../../../metadataBlocks/domain/models/MetadataBlock'

export class MultipleMetadataFieldValidator extends BaseMetadataFieldValidator {
  constructor(private singleMetadataFieldValidator: SingleMetadataFieldValidator) {
    super()
  }

  validate(newDatasetMetadataFieldAndValueInfo: NewDatasetMetadataFieldAndValueInfo): void {
    const metadataFieldValue = newDatasetMetadataFieldAndValueInfo.metadataFieldValue
    const metadataFieldInfo = newDatasetMetadataFieldAndValueInfo.metadataFieldInfo
    if (!Array.isArray(metadataFieldValue)) {
      throw this.createGeneralValidationError(
        newDatasetMetadataFieldAndValueInfo,
        'Expecting an array of values.'
      )
    }
    if (
      this.isValidArrayType(metadataFieldValue, 'string') &&
      metadataFieldInfo.type === MetadataFieldType.None
    ) {
      throw this.createGeneralValidationError(
        newDatasetMetadataFieldAndValueInfo,
        'Expecting an array of child fields, not strings.'
      )
    } else if (
      this.isValidArrayType(metadataFieldValue, 'object') &&
      metadataFieldInfo.type !== MetadataFieldType.None
    ) {
      throw this.createGeneralValidationError(
        newDatasetMetadataFieldAndValueInfo,
        'Expecting an array of strings, not child fields.'
      )
    } else if (
      !this.isValidArrayType(metadataFieldValue, 'object') &&
      !this.isValidArrayType(metadataFieldValue, 'string')
    ) {
      throw this.createGeneralValidationError(
        newDatasetMetadataFieldAndValueInfo,
        'The provided array of values is not valid.'
      )
    }

    const fieldValues = metadataFieldValue as NewDatasetMetadataFieldValueDTO[]
    fieldValues.forEach((value, metadataFieldPosition) => {
      this.singleMetadataFieldValidator.validate({
        metadataFieldInfo: metadataFieldInfo,
        metadataFieldKey: newDatasetMetadataFieldAndValueInfo.metadataFieldKey,
        metadataFieldValue: value,
        metadataBlockName: newDatasetMetadataFieldAndValueInfo.metadataBlockName,
        metadataFieldPosition: metadataFieldPosition
      })
    })
  }

  private isValidArrayType(
    metadataFieldValue: Array<string | NewDatasetMetadataFieldValueDTO>,
    expectedType: 'string' | 'object'
  ): boolean {
    return metadataFieldValue.every(
      (item: string | NewDatasetMetadataFieldValueDTO) => typeof item === expectedType
    )
  }
}
