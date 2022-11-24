class LoginResponse {
    name;
    surname;
    nick;
    email;
    role;
    image;

    constructor(user) {
        this.name = user.name;
        this.surname = user.surname;
        this.nick = user.nick;
        this.email = user.email;
        this.role = user.role;
        this.image = user.image;
    }
}

module.exports = LoginResponse;
