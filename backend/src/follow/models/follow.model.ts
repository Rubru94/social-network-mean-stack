import { PublicUser } from '@user/models/public-user.model';
import { Document, model, PaginateModel, Schema, Types } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

export interface IFollow extends Document {
    user: Types.ObjectId;
    followed: Types.ObjectId | PublicUser;
}

const FollowSchema = new Schema<IFollow>({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    followed: { type: Schema.Types.ObjectId, ref: 'User', required: true }
});

FollowSchema.plugin(mongoosePaginate);
export const Follow = model<IFollow, PaginateModel<IFollow>>('Follow', FollowSchema);
