import { PublicUser } from '@user/models/public-user.model';
import { Document, model, PaginateModel, Schema, Types } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

export interface IMessage extends Document {
    emitter: Types.ObjectId | PublicUser;
    receiver: Types.ObjectId | PublicUser;
    viewed: boolean;
    text: string;
    createdAt: Date;
}

const MessageSchema = new Schema<IMessage>({
    emitter: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    receiver: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    viewed: { type: Boolean, default: false },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

MessageSchema.plugin(mongoosePaginate);
export const Message = model<IMessage, PaginateModel<IMessage>>('Message', MessageSchema);
