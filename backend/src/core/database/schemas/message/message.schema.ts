import { IMessage } from '@message/models/message.model';
import { Schema } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

export const MessageSchema = new Schema<IMessage>({
    emitter: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    receiver: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    viewed: { type: Boolean, default: false },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

MessageSchema.plugin(mongoosePaginate);
