import { CustomError, NotFoundError } from '@core/models/error.model';
import { IFollow } from '@follow/models/follow.model';
import Service from '@follow/services/follow.service';
import { Payload } from '@utils/services/jwt.service';
import { UtilService } from '@utils/services/util.service';
import httpContext from 'express-http-context';
import { Types } from 'mongoose';
import { DELETE, GET, Path, PathParam, POST, QueryParam } from 'typescript-rest';

@Path('api/follow')
export class FollowController {
    @POST
    async create(follow: IFollow): Promise<IFollow> {
        try {
            const payload: Payload = httpContext.get('user');
            return await Service.create(payload, follow);
        } catch (error) {
            throw new CustomError(error);
        }
    }

    @Path('/:id')
    @DELETE
    async remove(@PathParam('id') id: string): Promise<IFollow[]> {
        try {
            const payload: Payload = httpContext.get('user');
            return await Service.remove(payload, id);
        } catch (error) {
            throw new CustomError(error);
        }
    }

    @Path('/following/:page?')
    @GET
    async getFollowingUsers(
        @PathParam('page') page?: string,
        @QueryParam('itemsPerPage') itemsPerPage?: string,
        @QueryParam('user') user?: string
    ): Promise<{ follows: IFollow[]; followings: Types.ObjectId[]; followers: Types.ObjectId[]; total: number; pages: number }> {
        try {
            const payload: Payload = httpContext.get('user');
            const res = await Service.getFollowingUsers(payload, +page, +itemsPerPage, user);
            if (!res) throw new NotFoundError('Follows not found');
            return res;
        } catch (error) {
            throw new CustomError(error);
        }
    }

    @Path('/follower/:page?')
    @GET
    async getFollowers(
        @PathParam('page') page?: string,
        @QueryParam('itemsPerPage') itemsPerPage?: string,
        @QueryParam('user') user?: string
    ): Promise<{ follows: IFollow[]; followings: Types.ObjectId[]; followers: Types.ObjectId[]; total: number; pages: number }> {
        try {
            const payload: Payload = httpContext.get('user');
            const res = await Service.getFollowers(payload, +page, +itemsPerPage, user);
            if (!res) throw new NotFoundError('Follows not found');
            return res;
        } catch (error) {
            throw new CustomError(error);
        }
    }

    @GET
    async getFollows(@QueryParam('followed') followed?: string): Promise<IFollow[]> {
        try {
            const payload: Payload = httpContext.get('user');
            const res = await Service.getFollows(payload, UtilService.strToBoolean(followed));
            if (!res) throw new NotFoundError('Follows not found');
            return res;
        } catch (error) {
            throw new CustomError(error);
        }
    }
}
