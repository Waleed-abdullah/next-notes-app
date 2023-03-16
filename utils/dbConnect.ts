import mongoose, { ConnectOptions } from 'mongoose';

const connection: any = {};

async function dbConnect() {
  if (connection.isConnected) {
    return;
  }
  const db = await mongoose.connect(process.env.MONGO_URI!, {
    // non-null assertion operator
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as ConnectOptions);

  connection.isConnected = db.connections[0].readyState;
  console.log(connection.isConnected);
}

export default dbConnect;
