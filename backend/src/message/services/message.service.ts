import { Sort } from '@core/enums/mongo-sort.enum';
import { BadRequestError } from '@core/models/error.model';
import { IMessage, Message } from '@message/models/message.model';
import { PublicUser } from '@user/models/public-user.model';
import { IUser } from '@user/models/user.model';
import { Payload } from '@utils/services/jwt.service';
import { PaginateResult } from 'mongoose';

const defaultPage: number = 1;
const defaultItemsPerPage: number = 5;

class MessageService {
    async create(payload: Payload, message: IMessage): Promise<IMessage> {
        message = new Message(message);
        message.emitter = payload.sub;
        if (message.validateSync()) throw new BadRequestError(message.validateSync().message);

        message = await message.save();
        if (!message) throw new BadRequestError('Message not saved');

        return message;
    }

    async getReceivedMessages(
        payload: Payload,
        page?: number,
        limit?: number,
        unviewed?: boolean
    ): Promise<{ messages: IMessage[]; itemsPerPage: number; total: number; pages: number }> {
        if (!page) page = defaultPage;
        if (!limit) limit = defaultItemsPerPage;
        const user = payload.sub;

        const result: PaginateResult<IMessage> = await Message.paginate(unviewed ? { receiver: user, viewed: false } : { receiver: user }, {
            sort: { createdAt: Sort.Descending },
            populate: { path: 'emitter receiver' },
            page,
            limit
        });
        if (!result) return null;

        return {
            messages: result.docs.map((message) => {
                message.emitter = new PublicUser(message.emitter as IUser);
                message.receiver = new PublicUser(message.receiver as IUser);
                return message;
            }),
            itemsPerPage: limit,
            total: result.totalDocs,
            pages: result.totalPages
        };
    }

    async getSentMessages(
        payload: Payload,
        page?: number,
        limit?: number
    ): Promise<{ messages: IMessage[]; itemsPerPage: number; total: number; pages: number }> {
        if (!page) page = defaultPage;
        if (!limit) limit = defaultItemsPerPage;
        const user = payload.sub;

        const result: PaginateResult<IMessage> = await Message.paginate(
            { emitter: user },
            {
                sort: { createdAt: Sort.Descending },
                populate: { path: 'emitter receiver' },
                page,
                limit
            }
        );
        if (!result) return null;

        return {
            messages: result.docs.map((message) => {
                message.emitter = new PublicUser(message.emitter as IUser);
                message.receiver = new PublicUser(message.receiver as IUser);
                return message;
            }),
            itemsPerPage: limit,
            total: result.totalDocs,
            pages: result.totalPages
        };
    }

    async getUnviewedCount(payload: Payload): Promise<{ unviewedMessages: number }> {
        const user = payload.sub;
        const unviewedMessages = await Message.count({ receiver: user, viewed: false });

        return { unviewedMessages };
    }
}

export default new MessageService();
