import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { createServer } from "http";
import { ConnectSocket } from './Socket.js';

export const connectDb = async () => {
  const url = 'mongodb+srv://CaoKhaHieu:CaoKhaHieu@cluster0.5sfoj.mongodb.net/DemoRealtime?retryWrites=true&w=majority';
  try {
    mongoose.set("strictQuery", false);
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    console.log("Connected to DB");
  } catch (error) {
    console.log('Error when connect to DB', error);
  }
};

const app = express();
const server = createServer(app);
const PORT = 4000;

ConnectSocket(server);
connectDb();

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use('/', (req, res) => {
  res.send('Hello')
})

server.listen(PORT, () => {
  console.log(`app run on port ${PORT}`);
});

