import { User } from './user.model';

export class Publication {
    _id: string;
    user: string | User;
    text: string;
    file: string;
    createdAt: Date;

    constructor(publication?: Partial<Publication>) {
        this._id = publication?._id ?? '';
        this.user = publication?.user ?? '';
        this.text = publication?.text ?? '';
        this.file = publication?.file ?? '';
        this.createdAt = publication?.createdAt ?? new Date();
    }
}
