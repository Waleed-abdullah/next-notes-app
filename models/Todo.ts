import mongoose from 'mongoose';

// OUR TODO SCHEMA
interface Todo {
  item: string;
  completed: boolean;
  shared: boolean;
  belongsTo: string;
}

const TodoSchema = new mongoose.Schema<Todo>({
  item: {
    type: String,
    required: true,
    unique: true,
  },
  completed: {
    type: Boolean,
    required: true,
    default: false,
  },
  belongsTo: {
    type: String,
    required: true,
  },
  shared: {
    type: Boolean,
    required: true,
  },
});

// OUR TODO MODEL
const Todo = mongoose.models.Todo || mongoose.model('Todo', TodoSchema);

export default Todo;
