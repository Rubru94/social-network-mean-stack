import { Sort } from '@core/enums/mongo-sort.enum';
import { Follow } from '@follow/models/follow.model';
import { IUser, User } from '@user/models/user.model';
import { Payload } from '@utils/services/jwt.service';
import { ObjectId } from 'mongodb';
import { PaginateResult } from 'mongoose';

const defaultPage: number = 1;
const defaultItemsPerPage: number = 5;

class UserService {
    async getAll(
        payload: Payload,
        page?: number,
        limit?: number
    ): Promise<{ users: IUser[]; followings: ObjectId[]; followers: ObjectId[]; total: number; pages: number }> {
        if (!page) page = defaultPage;
        if (!limit) limit = defaultItemsPerPage;

        const result: PaginateResult<IUser> = await User.paginate({}, { sort: { _id: Sort.Ascending }, page, limit });

        const followings = (await Follow.find({ user: payload.sub })).map((following) => following.followed);
        const followers = (await Follow.find({ followed: payload.sub })).map((follower) => follower.user);

        return { users: result.docs, followings, followers, total: result.totalDocs, pages: result.totalPages };
    }
}

export default new UserService();
