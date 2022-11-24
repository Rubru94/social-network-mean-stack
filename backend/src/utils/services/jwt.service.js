'use strict';

const jwt = require('jwt-simple');
const moment = require('moment');
const secret = 'ce6b20ee7f7797e102f68d15099e7d5b0e8d4c50f98a7865ea168717539ec3aa';

class Payload {
    sub;
    name;
    surname;
    nick;
    email;
    role;
    image;
    iat;
    exp;

    constructor(user) {
        this.sub = user._id;
        this.name = user.name;
        this.surname = user.surname;
        this.nick = user.nick;
        this.email = user.email;
        this.role = user.role;
        this.image = user.image;
        this.iat = moment().unix();
        this.exp = moment().add(30, 'days').unix();
    }
}

function createToken(user) {
    const payload = new Payload(user);
    return jwt.encode(payload, secret);
}

module.exports = createToken;
