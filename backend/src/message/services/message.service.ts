import { BadRequestError } from '@core/models/error.model';
import { IMessage, Message } from '@message/models/message.model';
import { Payload } from '@utils/services/jwt.service';

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
}

export default new MessageService();
