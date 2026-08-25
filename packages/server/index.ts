import express, { type Request, type Response } from 'express';
import OpenAI from 'openai';
import 'dotenv/config';
import zod from 'zod';
import { conversationRepository } from './repository/conversation.repository';


const app = express();

const chatSchema = zod.object({
  prompt: zod.string().min(1, 'Prompt is required.').max(1000, 'Prompt is too long.') ,
  conversationId: zod.string().optional(),
});


app.use(express.json());

const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  throw new Error('Set a valid OPENAI_API_KEY in packages/server/.env before starting the server.');
}

const client = new OpenAI({
  apiKey,
});

const port = process.env.PORT || 3000;

// let lastResponseId: string | null = null;

app.get('/api/help', (req: Request, res: Response) => {
  res.json({ message: 'Hello from the API!' });
});

app.post('/api/chat', async (req: Request, res: Response) => {
  const parseResult = chatSchema.safeParse(req.body);
  
  const { prompt, conversationId } = req.body;

  if (typeof prompt !== 'string' || prompt.trim() === '') {
    res.status(400).json({ error: 'Prompt is required.' });
    return;
  }

  try {
    const response = await client.responses.create({
      model: 'gpt-5.4-mini',
      input: prompt,
      store: true,
      // previous_response_id: lastResponseId, // Send the last response ID to the server
       previous_response_id: conversationRepository.getLastResponseId(conversationId), // Use the last response ID for the specific conversation
    });
    // lastResponseId = response.id; // Store the last response ID
    conversationRepository.setLastResponseId(conversationId, response.id); // Store the response ID for the specific conversation 

    res.json({
      message: response.output_text || 'No response from the model.',
    });
  } catch (error) {
    console.error('Error generating response:', error);

    res.status(500).json({
      error: 'Failed to generate response',
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});