import { CustomError, NotFoundError } from '@core/models/error.model';
import { IFollow } from '@follow/models/follow.model';
import { PublicUser } from '@user/models/public-user.model';
import { IUser } from '@user/models/user.model';
import Service from '@user/services/user.service';
import { Payload } from '@utils/services/jwt.service';
import httpContext from 'express-http-context';
import { Types } from 'mongoose';
import { GET, Path, PathParam, POST, PUT, QueryParam } from 'typescript-rest';

@Path('api/user')
export class UserController {
    @Path('/all/:page?')
    @GET
    async getAll(
        @PathParam('page') page?: string,
        @QueryParam('itemsPerPage') itemsPerPage?: string
    ): Promise<{ users: IUser[]; followings: Types.ObjectId[]; followers: Types.ObjectId[]; total: number; pages: number }> {
        try {
            const payload: Payload = httpContext.get('user');
            const res = await Service.getAll(payload, +page, +itemsPerPage);
            if (!res) throw new NotFoundError('Users not found');
            return res;
        } catch (error) {
            throw new CustomError(error);
        }
    }

    @Path('/counters')
    @GET
    async getCounters(@QueryParam('user') user?: string): Promise<{ followingCount: number; followerCount: number; publications: number }> {
        try {
            const payload: Payload = httpContext.get('user');
            const res = await Service.getCounters(payload, user);
            if (!res) throw new NotFoundError('User not found');
            return res;
        } catch (error) {
            throw new CustomError(error);
        }
    }

    @Path('/:id')
    @GET
    async findById(@PathParam('id') id: string): Promise<{ user: PublicUser; following: IFollow; follower: IFollow }> {
        try {
            const payload: Payload = httpContext.get('user');
            const res = await Service.findById(payload, id);
            if (!res) throw new NotFoundError('User not found');
            return res;
        } catch (error) {
            throw new CustomError(error);
        }
    }

    @Path('/update/:id')
    @PUT
    async update(@PathParam('id') id: string, updateUser: IUser): Promise<PublicUser> {
        try {
            const payload: Payload = httpContext.get('user');
            return await Service.update(payload, id, updateUser);
        } catch (error) {
            throw new CustomError(error);
        }
    }

    @Path('/upload-image/:userId')
    @POST
    async uploadImage(@PathParam('userId') userId: string): Promise<PublicUser> {
        try {
            const payload: Payload = httpContext.get('user');
            const req = httpContext.get('request');
            return await Service.uploadImage(payload, userId, req?.files?.image);
        } catch (error) {
            throw new CustomError(error);
        }
    }
}
