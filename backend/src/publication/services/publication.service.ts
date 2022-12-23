import { Sort } from '@core/enums/mongo-sort.enum';
import { BadRequestError, NotFoundError, UnauthorizedError } from '@core/models/error.model';
import { Follow } from '@follow/models/follow.model';
import { FilePublication } from '@publication/models/file-publication.model';
import { IPublication, Publication, uploadsPath } from '@publication/models/publication.model';
import fsService from '@utils/services/fs.service';
import { Payload } from '@utils/services/jwt.service';
import mongooseService from '@utils/services/mongoose.service';
import isImage from 'is-image';
import { PaginateResult, Types } from 'mongoose';
import path from 'path';

const defaultPage: number = 1;
const defaultItemsPerPage: number = 5;

class PublicationService {
    async create(payload: Payload, publication: IPublication): Promise<IPublication> {
        publication = new Publication(publication);
        publication.user ??= payload.sub;
        if (publication.validateSync()) throw new BadRequestError(publication.validateSync().message);

        publication = await publication.save();
        if (!publication) throw new BadRequestError('Publication not saved');

        return publication;
    }

    async remove(payload: Payload, id: Types.ObjectId | string): Promise<IPublication> {
        const currentUser = payload.sub;
        if (!mongooseService.isValidObjectId(id)) throw new BadRequestError('Invalid id');

        const publication = await Publication.findOne({ user: currentUser, _id: id });
        if (!publication) throw new UnauthorizedError('It is not possible to delete this publication');
        await Publication.find({ user: currentUser, _id: id }).deleteOne();
        const file = await fsService.existsPromise(`${uploadsPath}/${publication.file}`);
        if (file) await fsService.unlinkPromise(`${uploadsPath}/${publication.file}`);

        return publication;
    }

    async getAllFromFollowing(
        payload: Payload,
        page?: number,
        limit?: number
    ): Promise<{ publications: IPublication[]; itemsPerPage: number; total: number; pages: number }> {
        if (!page) page = defaultPage;
        if (!limit) limit = defaultItemsPerPage;

        let followSearch = await Follow.find({ user: payload.sub }).sort('_id').populate({ path: 'followed' });
        let follows = followSearch.map((follow) => follow.followed);
        follows.push(payload.sub);

        const result: PaginateResult<IPublication> = await Publication.paginate(
            { user: { $in: follows } },
            { sort: { createdAt: Sort.Descending }, populate: { path: 'user' }, page, limit }
        );
        if (!result) return null;

        return {
            publications: result.docs,
            itemsPerPage: limit,
            total: result.totalDocs,
            pages: result.totalPages
        };
    }

    async getAllFromUser(payload: Payload, page?: number, limit?: number, userId?: Types.ObjectId | string) {
        if (!page) page = defaultPage;
        if (!limit) limit = defaultItemsPerPage;
        const user = userId && !!(userId as string).trim() ? userId : payload.sub;

        const result: PaginateResult<IPublication> = await Publication.paginate(
            { user },
            { sort: { createdAt: Sort.Descending }, populate: { path: 'user' }, page, limit }
        );
        if (!result) return null;

        return {
            publications: result.docs,
            itemsPerPage: limit,
            total: result.totalDocs,
            pages: result.totalPages
        };
    }

    async findById(payload: Payload, publicationId: Types.ObjectId | string): Promise<IPublication> {
        if (!mongooseService.isValidObjectId(publicationId)) throw new BadRequestError('Invalid id');
        const publication = await Publication.findById(publicationId);
        if (!publication) return null;

        return publication;
    }

    async uploadImage(payload: Payload, publicationId: Types.ObjectId | string, file: Express.Multer.File): Promise<IPublication> {
        if (!mongooseService.isValidObjectId(publicationId)) throw new BadRequestError('Invalid id');

        const publication = await Publication.findOne({ _id: publicationId, user: payload.sub });

        if (!file) throw new BadRequestError('There is no attached image');
        const isValidParam = !!file;
        const filePath = file.path;
        const fileName = filePath.split('\\').pop();

        if (!publication) {
            await fsService.unlinkPromise(filePath);
            throw new UnauthorizedError('You do not have permissions to update publication image');
        }

        if (!isValidParam) {
            await fsService.unlinkPromise(filePath);
            throw new BadRequestError('Invalid image param');
        }

        if (!isImage(fileName)) {
            await fsService.unlinkPromise(filePath);
            throw new BadRequestError('Invalid image format/extension');
        }

        const updatedPublication = await Publication.findByIdAndUpdate(publicationId, new FilePublication(fileName), { new: true });
        if (!updatedPublication) throw new NotFoundError('Failed to update file publication');
        const existingFile = await fsService.existsPromise(`${uploadsPath}/${publication.file}`);
        if (existingFile) await fsService.unlinkPromise(`${uploadsPath}/${publication.file}`);

        return updatedPublication;
    }

    async getImageFile(payload: Payload, imageFile: string): Promise<string> {
        if (!imageFile) throw new BadRequestError('No param imageFile');
        const filePath = `${uploadsPath}/${imageFile}`;

        const file = await fsService.existsPromise(filePath);
        if (!file) throw new NotFoundError('Image does not exist');

        return path.resolve(filePath);
    }
}

export default new PublicationService();
