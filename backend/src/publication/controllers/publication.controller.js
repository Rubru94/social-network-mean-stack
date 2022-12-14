'use strict';

const error = require('@core/models/error.model');
const FilePublication = require('@publication/models/file-publication.model');
const Follow = require('@follow/models/follow.model');
const fsService = require('@utils/services/fs.service');
const isImage = require('is-image');
const mongoosePagination = require('mongoose-pagination');
const mongooseService = require('@utils/services/mongoose.service');
const path = require('path');
const Publication = require('@publication/models/publication.model');
const utilService = require('@utils/services/util.service');
const publicationUploads = require('@publication/models/uploads.model');

async function getAllFromFollowing(req, res, next) {
    try {
        const page = req.params.page ?? 1;
        const itemsPerPage = +req.query?.itemsPerPage ?? 5;

        let follows = await Follow.find({ user: req.user.sub }).sort('_id').populate({ path: 'followed' });
        follows = follows.map((follow) => follow.followed);
        follows.push(req.user.sub);

        Publication.find({ user: { $in: follows } })
            .sort({ createdAt: -1 })
            .populate('user')
            .paginate(page, itemsPerPage, async (err, publications, total) => {
                if (err) return next(err);
                if (!publications) throw new error.NotFoundError('Publications from following users not found');

                return res.status(200).send({ publications, itemsPerPage, total, pages: Math.ceil(total / itemsPerPage) });
            });
    } catch (err) {
        next(err);
    }
}

async function getAllFromUser(req, res, next) {
    try {
        const page = req.params.page ?? 1;
        const itemsPerPage = +req.query?.itemsPerPage ?? 5;
        const user = req.query?.user && !!(req.query?.user).trim() ? req.query.user : req.user.sub;

        Publication.find({ user })
            .sort({ createdAt: -1 })
            .populate('user')
            .paginate(page, itemsPerPage, async (err, publications, total) => {
                if (err) return next(err);
                if (!publications) throw new error.NotFoundError('Publications from following users not found');

                return res.status(200).send({ publications, itemsPerPage, total, pages: Math.ceil(total / itemsPerPage) });
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
        delete req.body._id;
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

async function remove(req, res, next) {
    try {
        const user = req.user.sub;
        const id = req.params?.id;
        if (!mongooseService.isValidObjectId(id)) throw new error.BadRequestError('Invalid id');

        const publication = await Publication.findOne({ user, _id: id });
        if (!publication) throw new error.UnauthorizedError('It is not possible to delete this publication');
        await Publication.find({ user, _id: id }).deleteOne();
        const file = await fsService.existsPromise(`${publicationUploads.path}/${publication.file}`);
        if (file) await fsService.unlinkPromise(`${publicationUploads.path}/${publication.file}`);

        return res.status(200).send(publication);
    } catch (err) {
        next(err);
    }
}

async function getImageFile(req, res, next) {
    try {
        if (!req.params?.imageFile) throw new error.BadRequestError('No param imageFile');
        const filePath = `./src/publication/uploads/${req.params.imageFile}`;

        const file = await fsService.existsPromise(filePath);
        if (!file) throw new error.NotFoundError('Image does not exist');

        res.status(200).sendFile(path.resolve(filePath));
    } catch (err) {
        next(err);
    }
}

async function uploadImage(req, res, next) {
    try {
        const publicationId = req.params?.publicationId;
        if (!mongooseService.isValidObjectId(publicationId)) throw new error.BadRequestError('Invalid id');

        const publication = await Publication.findOne({ _id: publicationId, user: req.user.sub });

        if (utilService.isEmptyObject(req.files)) throw new error.BadRequestError('There is no attached image');
        const isValidParam = !!req.files.image;
        const filePath = isValidParam ? req.files.image.path : utilService.findValue(req.files, 'path');
        const fileName = filePath.split('\\').pop();

        if (!publication) {
            await fsService.unlinkPromise(filePath);
            throw new error.UnauthorizedError('You do not have permissions to update publication image');
        }

        if (!isValidParam) {
            await fsService.unlinkPromise(filePath);
            throw new error.BadRequestError('Invalid image param');
        }

        if (!isImage(fileName)) {
            await fsService.unlinkPromise(filePath);
            throw new error.BadRequestError('Invalid image format/extension');
        }

        const updatedPublication = await Publication.findByIdAndUpdate(publicationId, new FilePublication(fileName), { new: true });
        if (!updatedPublication) throw new error.NotFoundError('Failed to update file publication');
        const file = await fsService.existsPromise(`${publicationUploads.path}/${publication.file}`);
        if (file) await fsService.unlinkPromise(`${publicationUploads.path}/${publication.file}`);

        return res.status(200).send(updatedPublication);
    } catch (err) {
        next(err);
    }
}

module.exports = {
    getAllFromFollowing,
    getAllFromUser,
    findById,
    create,
    remove,
    getImageFile,
    uploadImage
};
