import { CustomError, NotFoundError } from '@core/models/error.model';
import { IPublication } from '@publication/models/publication.model';
import Service from '@publication/services/publication.service';
import { Payload } from '@utils/services/jwt.service';
import httpContext from 'express-http-context';
import { DELETE, GET, Path, PathParam, POST, QueryParam } from 'typescript-rest';

@Path('api/publication')
export class PublicationController {
    @POST
    async create(follow: IPublication): Promise<IPublication> {
        try {
            const payload: Payload = httpContext.get('user');
            return await Service.create(payload, follow);
        } catch (err) {
            throw new CustomError(err);
        }
    }

    @Path('/:id')
    @DELETE
    async remove(@PathParam('id') id: string): Promise<IPublication> {
        try {
            const payload: Payload = httpContext.get('user');
            return await Service.remove(payload, id);
        } catch (error) {
            throw new CustomError(error);
        }
    }

    @Path('/all-following/:page?')
    @GET
    async getFollowingUsers(
        @PathParam('page') page?: string,
        @QueryParam('itemsPerPage') itemsPerPage?: string
    ): Promise<{ publications: IPublication[]; itemsPerPage: number; total: number; pages: number }> {
        try {
            const payload: Payload = httpContext.get('user');
            const res = await Service.getAllFromFollowing(payload, +page, +itemsPerPage);
            if (!res) throw new NotFoundError('Publications from following users not found');
            return res;
        } catch (error) {
            throw new CustomError(error);
        }
    }
}

/* 
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
const publicationUploads = require('@publication/models/uploads.model'); */

/* async function getAllFromUser(req, res, next) {
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
} */

/* async function findById(req, res, next) {
    try {
        const id = req.params?.id;
        if (!mongooseService.isValidObjectId(id)) throw new error.BadRequestError('Invalid id');
        const publication = await Publication.findById(id);
        if (!publication) throw new error.NotFoundError('Publication not found');

        res.status(200).send(publication);
    } catch (err) {
        next(err);
    }
} */

/* async function getImageFile(req, res, next) {
    try {
        if (!req.params?.imageFile) throw new error.BadRequestError('No param imageFile');
        const filePath = `./src/publication/uploads/${req.params.imageFile}`;

        const file = await fsService.existsPromise(filePath);
        if (!file) throw new error.NotFoundError('Image does not exist');

        res.status(200).sendFile(path.resolve(filePath));
    } catch (err) {
        next(err);
    }
} */

/* async function uploadImage(req, res, next) {
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
} */
