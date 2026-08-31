import express, { type Request, type Response } from 'express';
import { chatcontroller } from './controllers/chat.controller';

const router = express.Router();



router.get('/api/help', (req: Request, res: Response) => {
  res.json({ message: 'Hello from the API!' });
});

router.post('/api/chat', chatcontroller.sendMessage);

export default router