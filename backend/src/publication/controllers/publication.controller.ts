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

    @Path('/all-user/:page?')
    @GET
    async getAllFromUser(
        @PathParam('page') page?: string,
        @QueryParam('itemsPerPage') itemsPerPage?: string,
        @QueryParam('user') user?: string
    ): Promise<{ publications: IPublication[]; itemsPerPage: number; total: number; pages: number }> {
        try {
            const payload: Payload = httpContext.get('user');
            const res = await Service.getAllFromUser(payload, +page, +itemsPerPage, user);
            if (!res) throw new NotFoundError('Publications from following users not found');
            return res;
        } catch (error) {
            throw new CustomError(error);
        }
    }

    @Path('/:id')
    @GET
    async findById(@PathParam('id') id: string): Promise<IPublication> {
        try {
            const payload: Payload = httpContext.get('user');
            const res = await Service.findById(payload, id);
            if (!res) throw new NotFoundError('Publication not found');
            return res;
        } catch (error) {
            throw new CustomError(error);
        }
    }

    @Path('/upload-image/:publicationId')
    @POST
    async uploadImage(@PathParam('publicationId') publicationId: string): Promise<IPublication> {
        try {
            const payload: Payload = httpContext.get('user');
            const req = httpContext.get('request');
            return await Service.uploadImage(payload, publicationId, req?.files?.image);
        } catch (err) {
            throw new CustomError(err);
        }
    }
}
