import { Types } from 'mongoose';
import { IUser } from './user.model';

export class PublicUser {
    _id: Types.ObjectId;
    name: IUser['name'];
    surname: IUser['surname'];
    nick: IUser['nick'];
    email: IUser['email'];
    role: IUser['role'];
    image: IUser['image'];

    constructor(user: Partial<IUser>) {
        this._id = user._id;
        this.name = user.name;
        this.surname = user.surname;
        this.nick = user.nick;
        this.email = user.email;
        this.role = user.role;
        this.image = user.image;
    }
}
