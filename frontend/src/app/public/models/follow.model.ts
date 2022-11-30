import { User } from './user.model';

export class Follow {
    id: string;
    user: string | User;
    followed: string | User;

    constructor(follow: { _id: string; user: string | User; followed: string | User }) {
        this.id = follow._id;
        this.user = follow.user;
        this.followed = follow.followed;
    }
}
