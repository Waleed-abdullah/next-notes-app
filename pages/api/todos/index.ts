import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../utils/dbConnect';
import { ResponseFuncs } from '../../../utils/types';
import Todo from '@/models/Todo';
import { todoValidator } from '@/validate/validators';

const Handler = async (req: NextApiRequest, res: NextApiResponse) => {
  //capture request method, we type it as a key of ResponseFunc to reduce typing later

  await dbConnect();

  const method: keyof ResponseFuncs = req.method as keyof ResponseFuncs;

  // Potential Responses
  const handleCase: ResponseFuncs = {
    // RESPONSE FOR GET REQUESTS
    GET: async (req: NextApiRequest, res: NextApiResponse) => {
      try {
        const email = req.headers.authentication;
        if (!email) {
          return res.status(400).json('You are not logged in');
        }
        const todos = await Todo.find({ belongsTo: email });
        // console.log(todos);
        res.status(200).json(todos);
      } catch (error) {
        res.status(400).json({ success: false });
      }
    },
    // RESPONSE POST REQUESTS
    POST: async (req: NextApiRequest, res: NextApiResponse) => {
      try {
        // console.log(req.body);
        if (todoValidator(req.body)) {
          const todo = await Todo.create(req.body); // connect to database
          console.log('created object', todo);
          res.status(200).json({ success: true });
        } else {
          return res.status(400).json({ success: false });
        }
      } catch (error) {
        res.status(400).json({ success: false });
      }
    },
  };

  // Check if there is a response for the particular method, if so invoke it, if not response with an error
  const response = handleCase[method];
  try {
    if (response) response(req, res);
    else res.status(400).json({ error: 'No Response for This Request' });
  } catch (err) {
    console.log(err);
  }
};

export default Handler;
