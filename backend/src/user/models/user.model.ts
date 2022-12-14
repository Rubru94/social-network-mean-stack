import { Schema, model, Document, PaginateModel } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

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

const UserSchema = new Schema<IUser>(
    {
        name: { type: String, default: '' },
        surname: { type: String, default: '' },
        nick: { type: String, default: '' },
        email: { type: String, required: true },
        password: { type: String, required: true },
        role: { type: String, default: 'ROLE_USER' },
        image: { type: String, default: null }
    } /* ,
    { timestamps: true } */ /**@mongo timestamps */
);

UserSchema.plugin(mongoosePaginate);
export const User = model<IUser, PaginateModel<IUser>>('User', UserSchema);
