import { CustomError } from '@core/models/error.model';
import { PublicUser } from '@user/models/public-user.model';
import { IUser } from '@user/models/user.model';
import Service from '@user/services/user.service';
import { GET, Path, PathParam, POST, QueryParam } from 'typescript-rest';

@Path('api')
export class UserPublicController {
    @Path('/login')
    @POST
    async login(user: IUser, @QueryParam('token') token?: string): Promise<{ token: string } | PublicUser> {
        try {
            return await Service.login(user, token);
        } catch (err) {
            throw new CustomError(err);
        }
    }

    @Path('/register')
    @POST
    async register(user: IUser): Promise<IUser> {
        try {
            return await Service.register(user);
        } catch (err) {
            throw new CustomError(err);
        }
    }

    @Path('/image/user/:imageFile')
    @GET
    async getImageFile(@PathParam('imageFile') imageFile: string): Promise<{ base64: string }> {
        try {
            return await Service.getImageFile(imageFile);
        } catch (error) {
            throw new CustomError(error);
        }
    }
}
