import { DataverseInfoRepository } from '../../../src/info/infra/repositories/DataverseInfoRepository';
import { assert, createSandbox, SinonSandbox } from 'sinon';
import axios from 'axios';
import { expect } from 'chai';
import { ReadError } from '../../../src/core/domain/repositories/ReadError';
import { ApiConfig, DataverseApiAuthMechanism } from '../../../src/core/infra/repositories/ApiConfig';
import { TestConstants } from '../../testHelpers/TestConstants';

describe('DataverseInfoRepository', () => {
  const sandbox: SinonSandbox = createSandbox();
  const sut: DataverseInfoRepository = new DataverseInfoRepository();

  beforeEach(() => {
    ApiConfig.init(TestConstants.TEST_API_URL, DataverseApiAuthMechanism.API_KEY, TestConstants.TEST_DUMMY_API_KEY);
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('getDataverseVersion', () => {
    test('should return Dataverse version on successful response', async () => {
      const testVersionNumber = '5.13';
      const testVersionBuild = 'testBuild';
      const testSuccessfulResponse = {
        data: {
          status: 'OK',
          data: {
            version: testVersionNumber,
            build: testVersionBuild,
          },
        },
      };
      const axiosGetStub = sandbox.stub(axios, 'get').resolves(testSuccessfulResponse);

      const actual = await sut.getDataverseVersion();

      assert.calledWithExactly(
        axiosGetStub,
        `${TestConstants.TEST_API_URL}/info/version`,
        TestConstants.TEST_EXPECTED_UNAUTHENTICATED_REQUEST_CONFIG,
      );
      assert.match(actual.number, testVersionNumber);
      assert.match(actual.build, testVersionBuild);
    });

    test('should return error result on error response', async () => {
      const axiosGetStub = sandbox.stub(axios, 'get').rejects(TestConstants.TEST_ERROR_RESPONSE);

      let error: ReadError = undefined;
      await sut.getDataverseVersion().catch((e) => (error = e));

      assert.calledWithExactly(
        axiosGetStub,
        `${TestConstants.TEST_API_URL}/info/version`,
        TestConstants.TEST_EXPECTED_UNAUTHENTICATED_REQUEST_CONFIG,
      );
      expect(error).to.be.instanceOf(Error);
    });
  });

  describe('getZipDownloadLimit', () => {
    test('should return zip download limit on successful response', async () => {
      const testZipDownloadLimit = 100;
      const testSuccessfulResponse = {
        data: {
          status: 'OK',
          data: testZipDownloadLimit.toString(),
        },
      };
      const axiosGetStub = sandbox.stub(axios, 'get').resolves(testSuccessfulResponse);

      const actual = await sut.getZipDownloadLimit();

      assert.calledWithExactly(
        axiosGetStub,
        `${TestConstants.TEST_API_URL}/info/zipDownloadLimit`,
        TestConstants.TEST_EXPECTED_UNAUTHENTICATED_REQUEST_CONFIG,
      );
      assert.match(actual, testZipDownloadLimit);
    });

    test('should return error result on error response', async () => {
      const axiosGetStub = sandbox.stub(axios, 'get').rejects(TestConstants.TEST_ERROR_RESPONSE);

      let error: ReadError = undefined;
      await sut.getZipDownloadLimit().catch((e) => (error = e));

      assert.calledWithExactly(
        axiosGetStub,
        `${TestConstants.TEST_API_URL}/info/zipDownloadLimit`,
        TestConstants.TEST_EXPECTED_UNAUTHENTICATED_REQUEST_CONFIG,
      );
      expect(error).to.be.instanceOf(Error);
    });
  });

  describe('getMaxEmbargoDurationInMonths', () => {
    test('should return duration on successful response', async () => {
      const testDuration = 12;
      const testSuccessfulResponse = {
        data: {
          status: 'OK',
          data: {
            message: testDuration.toString(),
          },
        },
      };
      const axiosGetStub = sandbox.stub(axios, 'get').resolves(testSuccessfulResponse);

      const actual = await sut.getMaxEmbargoDurationInMonths();

      assert.calledWithExactly(
        axiosGetStub,
        `${TestConstants.TEST_API_URL}/info/settings/:MaxEmbargoDurationInMonths`,
        TestConstants.TEST_EXPECTED_UNAUTHENTICATED_REQUEST_CONFIG,
      );
      assert.match(actual, testDuration);
    });

    test('should return error result on error response', async () => {
      const axiosGetStub = sandbox.stub(axios, 'get').rejects(TestConstants.TEST_ERROR_RESPONSE);

      let error: ReadError = undefined;
      await sut.getMaxEmbargoDurationInMonths().catch((e) => (error = e));

      assert.calledWithExactly(
        axiosGetStub,
        `${TestConstants.TEST_API_URL}/info/settings/:MaxEmbargoDurationInMonths`,
        TestConstants.TEST_EXPECTED_UNAUTHENTICATED_REQUEST_CONFIG,
      );
      expect(error).to.be.instanceOf(Error);
    });
  });
});
