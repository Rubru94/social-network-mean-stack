import { Types } from 'mongoose';

class MongooseService {
    isValidObjectId(id: Types.ObjectId | string) {
        return Types.ObjectId.isValid(id);
    }
}

export default new MongooseService();
