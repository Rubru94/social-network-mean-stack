import { IFollow } from '@follow/models/follow.model';
import { Schema } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

export const FollowSchema = new Schema<IFollow>({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    followed: { type: Schema.Types.ObjectId, ref: 'User', required: true }
});

FollowSchema.plugin(mongoosePaginate);
