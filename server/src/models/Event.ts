import { Schema, model } from 'mongoose';

const eventSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  location: { type: String, required: true },
  imageUrl: { type: String, default: '' },
  registrationLink: { type: String, default: '' },
  registrationCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

export const Event = model('Event', eventSchema);
