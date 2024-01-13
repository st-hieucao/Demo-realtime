import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { createServer } from "http";
import { ConnectSocket } from './Socket.js';

const userSchema = new mongoose.Schema({
  username: String,
});
const User = mongoose.model('User', userSchema);

const messageSchema = new mongoose.Schema({
  text: String,
  sender: String,
});
const Message = mongoose.model('Message', messageSchema);

export const createNewMessage = async (data) => {
  const { text, sender } = data;

  if (!text || !sender) {
    return res.status(400).json({ error: 'Both text and sender are required' });
  }

  const newMessage = new Message({ text, sender });
  await newMessage.save();

  return newMessage;
}

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

app.post('/api/user', async (req, res) => {
  try {
    const newUser = new User({
      username: `User - ${new Date().getTime()}`,
    });

    await newUser.save();

    res.status(201).json({ data: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.get('/api/messages', async (req, res) => {
  try {
    const messages = await Message.find();
    res.json({data: messages});
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/message', async (req, res) => {
  try {
    const { text, sender } = req.body;

    if (!text || !sender) {
      return res.status(400).json({ error: 'Both text and sender are required' });
    }

    const newMessage = new Message({ text, sender });
    await newMessage.save();

    res.status(201).json({ data: newMessage });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

server.listen(PORT, () => {
  console.log(`app run on port ${PORT}`);
});

