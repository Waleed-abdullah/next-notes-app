// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/utils/dbConnect';
import User from '@/models/User';
type Data = {
  name: string;
};

dbConnect();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const users = await User.find({});
  res.status(200).json(users);
}
