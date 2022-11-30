export class PublicUser {
    id: string;
    name: string;
    surname: string;
    nick: string;
    role: string;
    image?: string;

    constructor(user: { _id: string; name: string; surname: string; nick: string; role: string; image?: string }) {
        this.id = user._id;
        this.name = user.name;
        this.surname = user.surname;
        this.nick = user.nick;
        this.role = user.role;
        this.image = user.image;
    }
}

export class User extends PublicUser {
    password: string;

    constructor(user: { _id: string; name: string; surname: string; nick: string; password: string; role: string; image?: string }) {
        super(user);
        this.password = user.password;
    }
}
