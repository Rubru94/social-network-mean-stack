import { User } from './user.model';

export class Publication {
    id: string;
    user: string | User;
    text: string;
    file: string;
    createdAt: Date;

    constructor(publication: { _id: string; user: string | User; text: string; file: string; createdAt: Date }) {
        this.id = publication._id;
        this.user = publication.user;
        this.text = publication.text;
        this.file = publication.file;
        this.createdAt = publication.createdAt;
    }
}
