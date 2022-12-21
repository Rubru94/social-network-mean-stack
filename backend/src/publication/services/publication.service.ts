import { IPublication, Publication } from '@publication/models/publication.model';
import { Payload } from '@utils/services/jwt.service';
import { BadRequestError } from 'typescript-rest/dist/server/model/errors';

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
}

export default new PublicationService();
