import { IUser, User } from '@user/models/user.model';
import { PaginateResult } from 'mongoose';

const defaultPage: number = 1;
const defaultItemsPerPage: number = 5;

class UserService {
    async getAll(
        page?: number,
        limit?: number
    ): Promise<{ users: IUser[]; followings: string[]; followers: string[]; total: number; pages: number }> {
        if (!page) page = defaultPage;
        if (!limit) limit = defaultItemsPerPage;

        /**
         * @TODO enum in core for sorting 1:POSITIVE -1:NEGATIVE
         */
        const result: PaginateResult<IUser> = await User.paginate({}, { sort: { _id: 1 }, page, limit });

        /**
         * const followings = (await Follow.find({ user: req.user.sub })).map((following) => following.followed);
         * const followers = (await Follow.find({ followed: req.user.sub })).map((follower) => follower.user);
         */

        return { users: result.docs, followings: [], followers: [], total: result.totalDocs, pages: result.totalPages };
    }
}

export default new UserService();
