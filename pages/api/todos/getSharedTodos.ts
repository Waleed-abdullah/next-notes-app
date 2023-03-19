import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../utils/dbConnect';
import Todo from '@/models/Todo';
const Handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await dbConnect();

  if (req.method === 'GET') {
    try {
      const todos = await Todo.find({ shared: true });
      res.status(200).json(todos);
    } catch (err) {
      res.status(400).json({ success: false });
    }
  } else {
    return res.status(400).json('This api only accepts GET requests');
  }
};

export default Handler;
