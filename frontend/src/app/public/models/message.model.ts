import { User } from './user.model';

export class Message {
    _id: string;
    emitter: string | User;
    receiver: string | User;
    viewed: boolean;
    text: string;
    createdAt: Date;

    constructor(message?: Partial<Message>) {
        this._id = message?._id ?? '';
        this.emitter = message?.emitter ?? '';
        this.receiver = message?.receiver ?? '';
        this.viewed = message?.viewed ?? false;
        this.text = message?.text ?? '';
        this.createdAt = message?.createdAt ?? new Date();
    }
}
