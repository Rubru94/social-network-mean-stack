export class PublicUser {
    _id: string;
    name: string;
    surname: string;
    nick: string;
    email: string;
    role?: string;
    image?: string;
    base64?: string;

    constructor(user?: Partial<PublicUser>) {
        this._id = user?._id ?? '';
        this.name = user?.name ?? '';
        this.surname = user?.surname ?? '';
        this.nick = user?.nick ?? '';
        this.email = user?.email ?? '';
        this.role = user?.role;
        this.image = user?.image;
        this.base64 = user?.base64;
    }

    setSettingsFormData(user?: Partial<User>) {
        this.name = user?.name ?? '';
        this.surname = user?.surname ?? '';
        this.nick = user?.nick ?? '';
        this.email = user?.email ?? '';
    }
}

export class User extends PublicUser {
    password: string;

    constructor(user?: Partial<User>) {
        super(user);
        this.password = user?.password ?? '';
    }
}
