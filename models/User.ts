import mongoose from 'mongoose';

const Schema = mongoose.Schema;

interface User {
  email: string;
  hashedPassword: string;
}

const userSchema = new Schema<User>({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  hashedPassword: {
    type: String,
    required: true,
    minlength: 5,
  },
});

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;
