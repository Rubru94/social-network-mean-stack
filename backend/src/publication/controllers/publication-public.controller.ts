import { CustomError } from '@core/models/error.model';
import Service from '@publication/services/publication.service';
import { GET, Path, PathParam } from 'typescript-rest';

@Path('api')
export class PublicationPublicController {
    @Path('/image/publication/:imageFile')
    @GET
    async getImageFile(@PathParam('imageFile') imageFile: string): Promise<{ base64: string }> {
        try {
            return await Service.getImageFile(imageFile);
        } catch (error) {
            throw new CustomError(error);
        }
    }
}
