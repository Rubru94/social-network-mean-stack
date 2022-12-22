import { BadRequestError, UnauthorizedError } from '@core/models/error.model';
import { IPublication, Publication, uploadsPath } from '@publication/models/publication.model';
import fsService from '@utils/services/fs.service';
import { Payload } from '@utils/services/jwt.service';
import mongooseService from '@utils/services/mongoose.service';
import { Types } from 'mongoose';

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
}

export default new PublicationService();
