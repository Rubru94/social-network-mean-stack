import moment from 'moment';
import jwt from 'jwt-simple';
import { IUser } from '@user/models/user.model';
import { Types } from 'mongoose';

const secret = 'ce6b20ee7f7797e102f68d15099e7d5b0e8d4c50f98a7865ea168717539ec3aa';

export class Payload {
    sub: Types.ObjectId;
    name: IUser['name'];
    surname: IUser['surname'];
    nick: IUser['nick'];
    email: IUser['email'];
    role: IUser['role'];
    image: IUser['image'];
    iat: number;
    exp: number;

    constructor(user?: IUser) {
        this.sub = user?._id ?? '';
        this.name = user?.name ?? '';
        this.surname = user?.surname ?? '';
        this.nick = user?.nick ?? '';
        this.email = user?.email ?? '';
        this.role = user?.role ?? 'ROLE_USER';
        this.image = user?.image ?? null;
        this.iat = moment().unix();
        this.exp = moment().add(30, 'days').unix();
    }

    async createToken(user: IUser): Promise<string> {
        const payload = new Payload(user);
        return jwt.encode(payload, secret);
    }

    async decodeToken(token: string): Promise<Payload> {
        return jwt.decode(token, secret);
    }
}

export default new Payload();
