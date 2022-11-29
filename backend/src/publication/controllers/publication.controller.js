'use strict';

const mongoosePagination = require('mongoose-pagination');
const error = require('@core/models/error.model');
const mongooseService = require('@utils/services/mongoose.service');
const User = require('@user/models/user.model');
const PublicUser = require('@user/models/public-user.model');
const Follow = require('@follow/models/follow.model');
const Publication = require('@publication/models/publication.model');
const utilService = require('@utils/services/util.service');
const path = require('path');

function hello(req, res) {
    res.status(200).send({ msg: 'hello world publications!' });
}

async function create(req, res, next) {
    try {
        let publication = new Publication(req.body);
        publication.user ??= req.user.sub;
        if (publication.validateSync()) throw new error.BadRequestError(publication.validateSync().message);

        publication = await publication.save();
        if (!publication) throw new error.BadRequestError('Publication not saved');

        return res.status(200).send(publication);
    } catch (err) {
        next(err);
    }
}

module.exports = {
    hello,
    create
};
