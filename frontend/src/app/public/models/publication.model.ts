import { User } from './user.model';

export class Publication {
    _id: string;
    user: User | string;
    text: string;
    file: string | null;
    createdAt: Date;

    constructor(publication?: Partial<Publication>) {
        this._id = publication?._id ?? '';
        this.user = publication?.user ?? '';
        this.text = publication?.text ?? '';
        this.file = publication?.file ?? null;
        this.createdAt = publication?.createdAt ?? new Date();
    }
}
