import {assert, createSandbox, SinonSandbox} from "sinon";
import {createFileModel} from "../../testHelpers/files/filesHelper";
import {IFilesRepository} from "../../../src/files/domain/repositories/IFilesRepository";
import {GetFile} from "../../../src/files/domain/useCases/GetFile";
import {ReadError} from "../../../src";
import {FileNotNumberedVersion} from "../../../src/files/domain/models/FileNotNumberedVersion";

describe('execute', () => {
    const sandbox: SinonSandbox = createSandbox();

    afterEach(() => {
        sandbox.restore();
    });

    test('should return file on repository success when passing numeric id', async () => {
        const testFile = createFileModel();
        const filesRepositoryStub = <IFilesRepository>{};
        const getFileStub = sandbox.stub().returns(testFile);
        filesRepositoryStub.getFile = getFileStub;
        const sut = new GetFile(filesRepositoryStub);

        const actual = await sut.execute(1);

        assert.match(actual, testFile);
        assert.calledWithExactly(getFileStub, 1, FileNotNumberedVersion.LATEST);
    })

    test('should return file on repository success when passing string id', async () => {
        const testFile = createFileModel();
        const filesRepositoryStub = <IFilesRepository>{};
        const getFileStub = sandbox.stub().returns(testFile);
        filesRepositoryStub.getFile = getFileStub;
        const sut = new GetFile(filesRepositoryStub);

        const actual = await sut.execute('doi:10.5072/FK2/J8SJZB');

        assert.match(actual, testFile);
        assert.calledWithExactly(getFileStub, 'doi:10.5072/FK2/J8SJZB', FileNotNumberedVersion.LATEST);
    })

    test('should return file on repository success when passing string id and version id', async () => {
        const testFile = createFileModel();
        const filesRepositoryStub = <IFilesRepository>{};
        const getFileStub = sandbox.stub().returns(testFile);
        filesRepositoryStub.getFile = getFileStub;
        const sut = new GetFile(filesRepositoryStub);

        const actual = await sut.execute('doi:10.5072/FK2/J8SJZB', '2.0');

        assert.match(actual, testFile);
        assert.calledWithExactly(getFileStub, 'doi:10.5072/FK2/J8SJZB', '2.0');
    })

    test('should return error result on repository error', async () => {
        const filesRepositoryStub = <IFilesRepository>{};
        const testReadError = new ReadError();
        filesRepositoryStub.getFile = sandbox.stub().throwsException(testReadError);
        const sut = new GetFile(filesRepositoryStub);

        let actualError: ReadError = undefined;
        await sut.execute(1).catch((e) => (actualError = e));

        assert.match(actualError, testReadError);
    })
});