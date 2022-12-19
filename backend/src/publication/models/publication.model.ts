import { model, PaginateModel, Schema, Types } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

export const uploadsPath = './src/publication/uploads';

export interface IPublication extends Document {
    user: Types.ObjectId;
    text: string;
    file: string;
    createdAt: Date;
}

const PublicationSchema = new Schema<IPublication>({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    text: { type: String, required: true },
    file: { type: String, default: null },
    createdAt: { type: Date, default: Date.now }
});

PublicationSchema.plugin(mongoosePaginate);
export const Publication = model<IPublication, PaginateModel<IPublication>>('Publication', PublicationSchema);
