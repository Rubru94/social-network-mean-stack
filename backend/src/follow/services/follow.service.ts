import { Sort } from '@core/enums/mongo-sort.enum';
import { BadRequestError } from '@core/models/error.model';
import { Follow, IFollow } from '@follow/models/follow.model';
import { PublicUser } from '@user/models/public-user.model';
import { IUser } from '@user/models/user.model';
import { Payload } from '@utils/services/jwt.service';
import mongooseService from '@utils/services/mongoose.service';
import { PaginateResult, Types } from 'mongoose';

const defaultPage: number = 1;
const defaultItemsPerPage: number = 5;

class FollowService {
    async create(payload: Payload, follow: IFollow): Promise<IFollow> {
        follow = new Follow(follow);
        follow.user = follow.user ?? payload.sub;
        if (follow.validateSync()) throw new BadRequestError(follow.validateSync().message);

        /**
         * @info Every ObjectId instance supports the "equals" method allowing you to provide your comparison value
         */
        if (follow.user.equals(follow.followed as Types.ObjectId)) throw new BadRequestError('User & followed cannot be the same user');

        follow = await follow.save();
        if (!follow) throw new BadRequestError('Follow not saved');

        return follow;
    }

    async remove(payload: Payload, followed: Types.ObjectId | string): Promise<IFollow[]> {
        if (!mongooseService.isValidObjectId(followed)) throw new BadRequestError('Invalid id');

        const follow = await Follow.find({ user: payload.sub, followed });
        await Follow.find({ user: payload.sub, followed }).deleteMany();

        return follow;
    }

    async getFollowingUsers(
        payload: Payload,
        page?: number,
        limit?: number,
        userId?: Types.ObjectId | string
    ): Promise<{ follows: IFollow[]; followings: Types.ObjectId[]; followers: Types.ObjectId[]; total: number; pages: number }> {
        if (!page) page = defaultPage;
        if (!limit) limit = defaultItemsPerPage;
        const user = userId ?? payload.sub;
        if (!mongooseService.isValidObjectId(user)) throw new BadRequestError('Invalid user id');

        const result: PaginateResult<IFollow> = await Follow.paginate(
            { user },
            { sort: { _id: Sort.Ascending }, populate: { path: 'followed' }, page, limit }
        );
        if (!result) return null;

        const followings = (await Follow.find({ user: payload.sub })).map((following) => following.followed as Types.ObjectId);
        const followers = (await Follow.find({ followed: payload.sub })).map((follower) => follower.user);

        return {
            follows: result.docs.map((follow) => {
                follow.followed = new PublicUser(follow.followed as IUser);
                return follow;
            }),
            followings,
            followers,
            total: result.totalDocs,
            pages: result.totalPages
        };
    }
}

export default new FollowService();
