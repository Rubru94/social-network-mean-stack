import { CustomError, NotFoundError } from '@core/models/error.model';
import { IMessage } from '@message/models/message.model';
import Service from '@message/services/message.service';
import { Payload } from '@utils/services/jwt.service';
import { UtilService } from '@utils/services/util.service';
import httpContext from 'express-http-context';
import { GET, Path, PathParam, POST, QueryParam } from 'typescript-rest';

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
}

/* const error = require('@core/models/error.model');
const FilePublication = require('@publication/models/file-publication.model');
const fsService = require('@utils/services/fs.service');
const isImage = require('is-image');
const mongoosePagination = require('mongoose-pagination');
const mongooseService = require('@utils/services/mongoose.service');
const path = require('path');
const User = require('@user/models/user.model');
const Message = require('@message/models/message.model');
const Publication = require('@publication/models/publication.model');
const PublicUser = require('@user/models/public-user.model');
const Follow = require('@follow/models/follow.model');
const utilService = require('@utils/services/util.service'); */

/* async function getUnviewedCount(req, res, next) {
    try {
        const user = req.user.sub;
        const unviewedMessages = await Message.count({ receiver: user, viewed: false });

        res.status(200).send({ unviewedMessages });
    } catch (err) {
        next(err);
    }
} */

/* async function getSentMessages(req, res, next) {
    try {
        const user = req.user.sub;
        const page = req.params.page ?? 1;
        const itemsPerPage = req.query?.itemsPerPage ?? 5;

        Message.find({ emitter: user })
            .sort({ createdAt: -1 })
            .populate('emitter receiver')
            .paginate(page, itemsPerPage, async (err, messages, total) => {
                if (err) return next(err);
                if (!messages) throw new error.NotFoundError('Emitter messages not found');

                return res.status(200).send({
                    messages: messages.map((message) => {
                        message.receiver = new PublicUser(message.receiver);
                        message.emitter = new PublicUser(message.emitter);
                        return message;
                    }),
                    itemsPerPage,
                    total,
                    pages: Math.ceil(total / itemsPerPage)
                });
            });
    } catch (err) {
        next(err);
    }
} */

/* async function setViewed(req, res, next) {
    try {
        const user = req.user.sub;
        const messagesUpdated = await Message.updateMany({ receiver: user, viewed: false }, { viewed: true }, { new: true });

        return res.status(200).send(messagesUpdated);
    } catch (err) {
        next(err);
    }
} */
