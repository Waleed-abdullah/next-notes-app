import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../utils/dbConnect';
import User from '../../models/User';
import bcrypt from 'bcrypt';
import { userValidator } from '@/validate/validators';

const validateEmail = (email: string): boolean => {
  const regEx = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  return regEx.test(email);
};

const validateForm = async (email: string, password: string) => {
  if (!validateEmail(email)) {
    return { error: 'Email is invalid' };
  }

  await dbConnect();
  const emailUser = await User.findOne({ email: email });

  if (emailUser) {
    return { error: 'Email already exists' };
  }

  if (password.length < 5) {
    return { error: 'Password must have 5 or more characters' };
  }

  return null;
};

const handler = async function (req: NextApiRequest, res: NextApiResponse) {
  // validate if it is a POST
  if (req.method !== 'POST') {
    return res
      .status(200)
      .json({ error: 'This API call only accepts POST methods' });
  }

  await dbConnect();

  // get and validate body variables
  const { email, password } = req.body;

  const errorMessage = await validateForm(email, password);
  if (errorMessage) {
    return res.status(400).json(errorMessage);
  }

  // hash password
  const hashedPassword = await bcrypt.hash(password, 12);

  // create new User on MongoDB
  const user = {
    email,
    hashedPassword,
  };

  if (userValidator(user)) {
    const newUser = new User(user);
    (newUser as any)
      .save()
      .then(() =>
        res
          .status(200)
          .json({ msg: 'Successfuly created new User: ' + newUser })
      )
      .catch((err: string) =>
        res.status(400).json({ error: "Error on '/api/register': " + err })
      );
  } else {
    return res.status(400).json({ error: 'Invalid user schema' });
  }
};

export default handler;
