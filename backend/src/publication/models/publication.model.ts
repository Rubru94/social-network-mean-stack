import { PublicationSchema } from '@core/database/schemas/publication/publication.schema';
import { Document, model, PaginateModel, Types } from 'mongoose';

export const uploadsPath = './src/publication/uploads';

export interface IPublication extends Document {
    user: Types.ObjectId;
    text: string;
    file: string;
    createdAt: Date;
}

export const Publication = model<IPublication, PaginateModel<IPublication>>('Publication', PublicationSchema);
