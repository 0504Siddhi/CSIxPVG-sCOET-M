import { Schema, model } from 'mongoose';

const teamMemberSchema = new Schema({
  name: { type: String, required: true },
  designation: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['coordinator', 'president', 'vice-president', 'technical', 'design', 'publicity', 'finance'], 
    required: true 
  },
  department: { type: String, required: true },
  year: { type: String, required: true },
  photoUrl: { type: String, required: true },
  linkedinUrl: { type: String, default: '' },
  githubUrl: { type: String, default: '' },
  order: { type: Number, default: 0 }
});

export const TeamMember = model('TeamMember', teamMemberSchema);
