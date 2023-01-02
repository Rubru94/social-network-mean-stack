import { UserSchema } from '@core/database/schemas/user/user.schema';
import { Document, model, PaginateModel } from 'mongoose';

export const uploadsPath = './src/user/uploads';

export interface IUser extends Document {
    name: string;
    surname: string;
    nick: string;
    email: string;
    password: string;
    role: string;
    image: string;
}

export const User = model<IUser, PaginateModel<IUser>>('User', UserSchema);
