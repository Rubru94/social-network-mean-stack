import { BadRequestError } from '@core/models/error.model';
import { Follow, IFollow } from '@follow/models/follow.model';
import { Payload } from '@utils/services/jwt.service';

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
        if (follow.user.equals(follow.followed)) throw new BadRequestError('User & followed cannot be the same user');

        follow = await follow.save();
        if (!follow) throw new BadRequestError('Follow not saved');

        return follow;
    }
}

export default new FollowService();
