import { MessageSchema } from '@core/database/schemas/message/message.schema';
import { PublicUser } from '@user/models/public-user.model';
import { Document, model, PaginateModel, Types } from 'mongoose';

export interface IMessage extends Document {
    emitter: Types.ObjectId | PublicUser;
    receiver: Types.ObjectId | PublicUser;
    viewed: boolean;
    text: string;
    createdAt: Date;
}

export const Message = model<IMessage, PaginateModel<IMessage>>('Message', MessageSchema);
