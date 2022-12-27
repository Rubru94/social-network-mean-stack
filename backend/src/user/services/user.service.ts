import { Sort } from '@core/enums/mongo-sort.enum';
import { BadRequestError, NotFoundError, UnauthorizedError } from '@core/models/error.model';
import { Follow, IFollow } from '@follow/models/follow.model';
import { Publication } from '@publication/models/publication.model';
import { PublicUser } from '@user/models/public-user.model';
import { IUser, uploadsPath, User } from '@user/models/user.model';
import bcryptService from '@utils/services/bcrypt.service';
import jwtService, { Payload } from '@utils/services/jwt.service';
import mongooseService from '@utils/services/mongoose.service';
import { UtilService } from '@utils/services/util.service';
import { PaginateResult, Types } from 'mongoose';
import fsService from '@utils/services/fs.service';
import isImage from 'is-image';
import { ImageUser } from '@user/models/image-user.model';
import path from 'path';

const defaultPage: number = 1;
const defaultItemsPerPage: number = 5;

class UserService {
    async getAll(
        payload: Payload,
        page?: number,
        limit?: number
    ): Promise<{ users: IUser[]; followings: Types.ObjectId[]; followers: Types.ObjectId[]; total: number; pages: number }> {
        if (!page) page = defaultPage;
        if (!limit) limit = defaultItemsPerPage;

        const result: PaginateResult<IUser> = await User.paginate({}, { sort: { _id: Sort.Ascending }, page, limit });

        const followings = (await Follow.find({ user: payload.sub })).map((following) => following.followed as Types.ObjectId);
        const followers = (await Follow.find({ followed: payload.sub })).map((follower) => follower.user as Types.ObjectId);

        return { users: result.docs, followings, followers, total: result.totalDocs, pages: result.totalPages };
    }

    async findById(
        payload: Payload,
        userId: Types.ObjectId | string
    ): Promise<{ user: PublicUser; following: IFollow; follower: IFollow }> {
        if (!mongooseService.isValidObjectId(userId)) throw new BadRequestError('Invalid id');
        const user = await User.findById(userId);
        if (!user) return null;

        const following = await Follow.findOne({ user: payload.sub, followed: userId });
        const follower = await Follow.findOne({ user: userId, followed: payload.sub });

        return { user: new PublicUser(user), following, follower };
    }

    async login(user: IUser, token: string): Promise<{ token: string } | PublicUser> {
        delete user._id;
        user = new User(user);
        if (user.validateSync()) throw new BadRequestError(user.validateSync().message);

        const userExistent = await User.findOne({ email: user.email });
        if (!userExistent) throw new NotFoundError('User not exist');

        let isValidPassword = await bcryptService.comparePromise(user.password, userExistent.password);
        if (!isValidPassword) throw new BadRequestError('Invalid password');

        if (UtilService.strToBoolean(token)) return { token: await jwtService.createToken(userExistent) };
        return new PublicUser(userExistent);
    }

    async register(user: IUser): Promise<IUser> {
        delete user._id;
        user = new User(user);
        if (user.validateSync()) throw new BadRequestError(user.validateSync().message);

        const userExistent = await User.findOne({ $or: [{ email: user.email }, { nick: user.nick }] });
        if (userExistent) throw new BadRequestError('Email or nick already used');

        user.password = await bcryptService.hashPromise(user.password);
        return await user.save();
    }

    async getCounters(
        payload: Payload,
        userId?: Types.ObjectId | string
    ): Promise<{ followingCount: number; followerCount: number; publications: number }> {
        const user = userId && !!(userId as string).trim() ? userId : payload.sub;
        if (!mongooseService.isValidObjectId(user)) throw new BadRequestError('Invalid id');

        const followingCount = await Follow.count({ user });
        const followerCount = await Follow.count({ followed: user });
        const publications = await Publication.count({ user });

        return { followingCount, followerCount, publications };
    }

    async update(payload: Payload, userId: Types.ObjectId | string, updateUser: IUser): Promise<PublicUser> {
        if (!mongooseService.isValidObjectId(userId)) throw new BadRequestError('Invalid id');
        if (userId !== payload.sub) throw new UnauthorizedError('You do not have permissions to update user data');

        const userExistent = await User.findOne({
            $and: [{ _id: { $ne: userId } }, { $or: [{ email: updateUser.email }, { nick: updateUser.nick }] }]
        });
        if (userExistent) throw new BadRequestError('Email or nick already used');

        /**
         * @info { new: true } --> It returns updated object. By default it returns object to update (old object).
         */
        const update = await User.findByIdAndUpdate(userId, new PublicUser(updateUser), { new: true });
        if (!update) throw new NotFoundError('Failed to update user');

        return new PublicUser(update);
    }

    async uploadImage(payload: Payload, userId: Types.ObjectId | string, file: Express.Multer.File): Promise<PublicUser> {
        if (!mongooseService.isValidObjectId(userId)) throw new BadRequestError('Invalid id');
        if (userId !== payload.sub) throw new UnauthorizedError('You do not have permissions to update user image');

        if (!file) throw new BadRequestError('There is no attached image');
        const isValidParam = !!file;
        const filePath = file.path;
        const fileName = filePath.split('\\').pop();

        if (!isValidParam) {
            await fsService.unlinkPromise(filePath);
            throw new BadRequestError('Invalid image param');
        }

        if (!isImage(fileName)) {
            await fsService.unlinkPromise(filePath);
            throw new BadRequestError('Invalid image format/extension');
        }

        const user = await User.findById(userId);
        if (!user) throw new NotFoundError('User not found');

        const update = await User.findByIdAndUpdate(userId, new ImageUser(fileName), { new: true });
        if (!update) throw new NotFoundError('Failed to update image user');
        const existingFile = await fsService.existsPromise(`${uploadsPath}/${user.image}`);
        if (existingFile) await fsService.unlinkPromise(`${uploadsPath}/${user.image}`);

        return new PublicUser(update);
    }

    async getImageFile(payload: Payload, imageFile: string): Promise<string> {
        if (!imageFile) throw new BadRequestError('No param imageFile');
        const filePath = `${uploadsPath}/${imageFile}`;

        const file = await fsService.existsPromise(filePath);
        if (!file) throw new NotFoundError('Image does not exist');

        return path.resolve(filePath);
    }
}

export default new UserService();
