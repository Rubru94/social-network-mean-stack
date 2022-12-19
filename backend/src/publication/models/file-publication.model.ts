import { IPublication } from './publication.model';

export class FilePublication {
    file: IPublication['file'];

    constructor(file: IPublication['file']) {
        this.file = file;
    }
}
