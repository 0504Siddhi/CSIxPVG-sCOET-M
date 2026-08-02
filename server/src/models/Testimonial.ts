import { Schema, model } from 'mongoose';

const testimonialSchema = new Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  message: { type: String, required: true },
  avatarUrl: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

export const Testimonial = model('Testimonial', testimonialSchema);
