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

async function getAllFromFollowing(req, res, next) {
    try {
        const page = req.params.page ?? 1;
        const itemsPerPage = req.query?.itemsPerPage ?? 5;

        let follows = await Follow.find({ user: req.user.sub }).sort('_id').populate({ path: 'followed' });
        follows = follows.map((follow) => follow.followed);

        Publication.find({ user: { $in: follows } })
            .sort({ createdAt: -1 })
            .populate('user')
            .paginate(page, itemsPerPage, async (err, publications, total) => {
                if (err) return next(err);
                if (!publications) throw new error.NotFoundError('Publications from following users not found');

                return res.status(200).send({ publications, total, pages: Math.ceil(total / itemsPerPage) });
            });
    } catch (err) {
        next(err);
    }
}

async function findById(req, res, next) {
    try {
        const id = req.params?.id;
        if (!mongooseService.isValidObjectId(id)) throw new error.BadRequestError('Invalid id');
        const publication = await Publication.findById(id);
        if (!publication) throw new error.NotFoundError('Publication not found');

        res.status(200).send(publication);
    } catch (err) {
        next(err);
    }
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
    getAllFromFollowing,
    findById,
    create
};
