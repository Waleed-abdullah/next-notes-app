import mongoose, { Schema, model, connect } from 'mongoose';

interface Note {
  title: string;
  description: string;
}

export const NoteSchema = new Schema<Note>({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    unique: true,
    trim: true,
    maxlength: [40, 'Title cannot exceed 40 characters'],
  },
  description: {
    type: String,
    required: true,
    maxlength: [200, 'Description cannot exceed 200 characters'],
  },
});

export default mongoose.models.Note || mongoose.model('Note', NoteSchema);
