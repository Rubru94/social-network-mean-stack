import { User } from './user.model';

export class Message {
    id: string;
    emitter: string | User;
    receiver: string | User;
    viewed: boolean;
    text: string;
    createdAt: Date;

    constructor(message: { _id: string; emitter: string | User; receiver: string | User; viewed: boolean; text: string; createdAt: Date }) {
        this.id = message._id;
        this.emitter = message.emitter;
        this.receiver = message.receiver;
        this.viewed = message.viewed;
        this.text = message.text;
        this.createdAt = message.createdAt;
    }
}
