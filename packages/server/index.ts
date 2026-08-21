import express, { type Request, type Response } from 'express';
import  { OpenAI } from 'openai';  
import 'dotenv/config';


const app = express();


app.use(express.json());
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const port = process.env.PORT || 3000;

app.get('/api/help', (req: Request, res: Response) => {
  res.json({ message: 'Hello from the API!' });
});

app.post('/api/chat', async (req: Request, res: Response) => {
  const { prompt } = req.body;

  try {
    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.2,
      max_tokens: 100,
    });

    res.json({
      message: response.choices[0]?.message?.content || 'No response from the model.',
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