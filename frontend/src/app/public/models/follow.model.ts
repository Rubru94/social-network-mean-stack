import { User } from './user.model';

export class Follow {
    _id: string;
    user: string | User;
    followed: string | User;

    constructor(follow?: Partial<Follow>) {
        this._id = follow?._id ?? '';
        this.user = follow?.user ?? '';
        this.followed = follow?.followed ?? '';
    }
}
