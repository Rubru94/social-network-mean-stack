import { Sort } from '@core/enums/mongo-sort.enum';
import { BadRequestError, NotFoundError } from '@core/models/error.model';
import { Follow } from '@follow/models/follow.model';
import { PublicUser } from '@user/models/public-user.model';
import { IUser, User } from '@user/models/user.model';
import bcryptService from '@utils/services/bcrypt.service';
import jwtService, { Payload } from '@utils/services/jwt.service';
import { UtilService } from '@utils/services/util.service';
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

    async login(user: IUser, token: string): Promise<{ token: string } | PublicUser> {
        user = new User(user);
        if (user.validateSync()) throw new BadRequestError(user.validateSync().message);

        const userExistent = await User.findOne({ email: user.email });
        if (!userExistent) throw new NotFoundError('User not exist');

        let isValidPassword = await bcryptService.comparePromise(user.password, userExistent.password);
        if (!isValidPassword) throw new BadRequestError('Invalid password');

        if (UtilService.strToBoolean(token)) return { token: await jwtService.createToken(userExistent) };
        return new PublicUser(userExistent);
    }
}

export default new UserService();
