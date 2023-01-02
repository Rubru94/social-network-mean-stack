import { FollowSchema } from '@core/database/schemas/follow/follow.schema';
import { PublicUser } from '@user/models/public-user.model';
import { Document, model, PaginateModel, Types } from 'mongoose';

export interface IFollow extends Document {
    user: Types.ObjectId | PublicUser;
    followed: Types.ObjectId | PublicUser;
}

export const Follow = model<IFollow, PaginateModel<IFollow>>('Follow', FollowSchema);
