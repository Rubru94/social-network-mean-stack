import { IPublication } from '@publication/models/publication.model';
import { Schema } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

export const PublicationSchema = new Schema<IPublication>({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    text: { type: String, required: true },
    file: { type: String, default: null },
    createdAt: { type: Date, default: Date.now }
});

PublicationSchema.plugin(mongoosePaginate);
