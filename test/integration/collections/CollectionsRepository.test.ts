import { CollectionsRepository } from '../../../src/collections/infra/repositories/CollectionsRepository'
import { TestConstants } from '../../testHelpers/TestConstants'
import { ReadError } from '../../../src'
import { ApiConfig } from '../../../src'
import { DataverseApiAuthMechanism } from '../../../src/core/infra/repositories/ApiConfig'
import {
  createCollectionViaApi,
  deleteCollectionViaApi
} from '../../testHelpers/collections/collectionHelper'
import { ROOT_COLLECTION_ALIAS } from '../../../src/collections/domain/models/Collection'
import { CollectionPayload } from '../../../src/collections/infra/repositories/transformers/CollectionPayload'

describe('CollectionsRepository', () => {
  const testGetCollection: CollectionsRepository = new CollectionsRepository()
  let testCollectionId: number

  beforeAll(async () => {
    ApiConfig.init(
      TestConstants.TEST_API_URL,
      DataverseApiAuthMechanism.API_KEY,
      process.env.TEST_API_KEY
    )
    await createCollectionViaApi(TestConstants.TEST_CREATED_COLLECTION_ALIAS_2).then(
      (collectionPayload: CollectionPayload) => (testCollectionId = collectionPayload.id)
    )
  })

  afterAll(async () => {
    ApiConfig.init(
      TestConstants.TEST_API_URL,
      DataverseApiAuthMechanism.API_KEY,
      process.env.TEST_API_KEY
    )
    await deleteCollectionViaApi(TestConstants.TEST_CREATED_COLLECTION_ALIAS_2)
  })

  describe('getCollection', () => {
    describe('by default `root` Id', () => {
      test('should return the root collection of the Dataverse installation if no parameter is passed AS `root`', async () => {
        const actual = await testGetCollection.getCollection()
        expect(actual.alias).toBe(ROOT_COLLECTION_ALIAS)
      })
    })

    describe('by string alias', () => {
      test('should return collection when it exists filtering by id AS (alias)', async () => {
        const actual = await testGetCollection.getCollection(
          TestConstants.TEST_CREATED_COLLECTION_ALIAS_2
        )
        expect(actual.alias).toBe(TestConstants.TEST_CREATED_COLLECTION_ALIAS_2)
      })

      test('should return error when collection does not exist', async () => {
        const expectedError = new ReadError(
          `[404] Can't find dataverse with identifier='${TestConstants.TEST_DUMMY_COLLECTION_ALIAS}'`
        )

        await expect(
          testGetCollection.getCollection(TestConstants.TEST_DUMMY_COLLECTION_ALIAS)
        ).rejects.toThrow(expectedError)
      })
    })
    describe('by numeric id', () => {
      test('should return collection when it exists filtering by id AS (id)', async () => {
        const actual = await testGetCollection.getCollection(testCollectionId)
        expect(actual.id).toBe(testCollectionId)
      })

      test('should return error when collection does not exist', async () => {
        const expectedError = new ReadError(
          `[404] Can't find dataverse with identifier='${TestConstants.TEST_DUMMY_COLLECTION_ID}'`
        )

        await expect(
          testGetCollection.getCollection(TestConstants.TEST_DUMMY_COLLECTION_ID)
        ).rejects.toThrow(expectedError)
      })
    })
  })
})
