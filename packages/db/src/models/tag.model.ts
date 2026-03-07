import { model, models, Schema, Model } from 'mongoose';
import { ITagDocument } from '../types/tag.type';

const tagSchema = new Schema<ITagDocument>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    name: { type: String, required: true, index: true },
    source: { type: String },
    color: { type: String },
  },
  { timestamps: true },
);

tagSchema.index({ userId: 1, name: 1 }, { unique: true });

export const TagModel: Model<ITagDocument> =
  models.Tag || model<ITagDocument>('Tag', tagSchema);
