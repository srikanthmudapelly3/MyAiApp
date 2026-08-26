import express, { type Request, type Response } from 'express';
import OpenAI from 'openai';
import 'dotenv/config';
import { chatcontroller } from './controllers/chat.controller';

const app = express();




app.use(express.json());



const port = process.env.PORT || 3000;

// let lastResponseId: string | null = null;

app.get('/api/help', (req: Request, res: Response) => {
  res.json({ message: 'Hello from the API!' });
});

app.post('/api/chat', chatcontroller.sendMessage);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});