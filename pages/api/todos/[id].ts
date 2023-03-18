import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../utils/dbConnect';
import { ResponseFuncs } from '../../../utils/types';
import Todo from '@/models/Todo';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await dbConnect();
  //capture request method, we type it as a key of ResponseFunc to reduce typing later
  const method: keyof ResponseFuncs = req.method as keyof ResponseFuncs;

  // GRAB ID FROM req.query (where next stores params)
  const id: string = req.query.id as string;

  // Potential Responses for /todos/:id
  const handleCase: ResponseFuncs = {
    // RESPONSE FOR GET REQUESTS
    GET: async (req: NextApiRequest, res: NextApiResponse) => {
      try {
        const todo = await Todo.findById(id);
        res.status(200).json(todo);
      } catch (error) {
        res.status(400).json({ success: false });
      }
    },
    // RESPONSE PUT REQUESTS
    PUT: async (req: NextApiRequest, res: NextApiResponse) => {
      try {
        const todo = await Todo.findByIdAndUpdate(id, req.body, { new: true });
        if (!todo) {
          return res.status(404).json({ success: false });
        }
        res.status(200).json({ success: true });
      } catch (error) {
        res.status(400).json({ success: false });
      }
    },
    // RESPONSE FOR DELETE REQUESTS
    DELETE: async (req: NextApiRequest, res: NextApiResponse) => {
      try {
        const deletedTodo = await Todo.findByIdAndRemove(id);
        if (!deletedTodo) {
          return res.status(404).json({ success: false });
        }
        res.status(200).json(deletedTodo);
      } catch (error) {
        res.status(400).json({ success: false });
      }
    },
  };

  // Check if there is a response for the particular method, if so invoke it, if not response with an error
  const response = handleCase[method];
  if (response) response(req, res);
  else res.status(400).json({ error: 'No Response for This Request' });
};

export default handler;
