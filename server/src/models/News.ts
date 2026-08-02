import { Schema, model } from 'mongoose';

const newsSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  imageUrl: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

export const News = model('News', newsSchema);
