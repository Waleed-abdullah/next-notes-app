import dbConnect from '@/utils/dbConnect';
import type { NextApiRequest, NextApiResponse } from 'next';

dbConnect();

export default async function data(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({ test: 'test' });
}
