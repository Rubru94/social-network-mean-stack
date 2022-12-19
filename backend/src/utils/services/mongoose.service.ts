import { Types } from 'mongoose';

class Mongoose {
    isValidObjectId(id: Types.ObjectId | string) {
        return Types.ObjectId.isValid(id);
    }
}

export default new Mongoose();
