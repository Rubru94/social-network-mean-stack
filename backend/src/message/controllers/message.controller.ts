import { CustomError, NotFoundError } from '@core/models/error.model';
import { IMessage } from '@message/models/message.model';
import Service from '@message/services/message.service';
import { Payload } from '@utils/services/jwt.service';
import { UtilService } from '@utils/services/util.service';
import httpContext from 'express-http-context';
import { UpdateResult } from 'mongodb';
import { GET, Path, PathParam, POST, PUT, QueryParam } from 'typescript-rest';

@Path('api/message')
export class MessageController {
    @POST
    async create(message: IMessage): Promise<IMessage> {
        try {
            const payload: Payload = httpContext.get('user');
            return await Service.create(payload, message);
        } catch (err) {
            throw new CustomError(err);
        }
    }

    @Path('/set-viewed')
    @PUT
    async setViewed(): Promise<UpdateResult> {
        try {
            const payload: Payload = httpContext.get('user');
            return await Service.setViewed(payload);
        } catch (err) {
            throw new CustomError(err);
        }
    }

    @Path('/received/:page?')
    @GET
    async getReceivedMessages(
        @PathParam('page') page?: string,
        @QueryParam('itemsPerPage') itemsPerPage?: string,
        @QueryParam('unviewed') unviewed?: string
    ): Promise<{ messages: IMessage[]; itemsPerPage: number; total: number; pages: number }> {
        try {
            const payload: Payload = httpContext.get('user');
            const res = await Service.getReceivedMessages(payload, +page, +itemsPerPage, UtilService.strToBoolean(unviewed));
            if (!res) throw new NotFoundError('Received messages not found');
            return res;
        } catch (error) {
            throw new CustomError(error);
        }
    }

    @Path('/sent/:page?')
    @GET
    async getSentMessages(
        @PathParam('page') page?: string,
        @QueryParam('itemsPerPage') itemsPerPage?: string
    ): Promise<{ messages: IMessage[]; itemsPerPage: number; total: number; pages: number }> {
        try {
            const payload: Payload = httpContext.get('user');
            const res = await Service.getSentMessages(payload, +page, +itemsPerPage);
            if (!res) throw new NotFoundError('Sent messages not found');
            return res;
        } catch (error) {
            throw new CustomError(error);
        }
    }

    @Path('/unviewed')
    @GET
    async getUnviewedCount(): Promise<{ unviewedMessages: number }> {
        try {
            const payload: Payload = httpContext.get('user');
            return await Service.getUnviewedCount(payload);
        } catch (error) {
            throw new CustomError(error);
        }
    }
}
