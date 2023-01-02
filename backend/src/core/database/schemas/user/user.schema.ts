import { IUser } from '@user/models/user.model';
import { Schema } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

export const UserSchema = new Schema<IUser>(
    {
        name: { type: String, default: '' },
        surname: { type: String, default: '' },
        nick: { type: String, default: '' },
        email: { type: String, required: true },
        password: { type: String, required: true },
        role: { type: String, default: 'ROLE_USER' },
        image: { type: String, default: null }
    }
    /**
     * @mongo timestamps
     * ,{ timestamps: true }
     */
);

UserSchema.plugin(mongoosePaginate);
