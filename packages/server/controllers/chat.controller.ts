
import type { Request, Response } from "express";
import zod from "zod";
import { ChatService } from "../services/chat.service";



const chatSchema = zod.object({
  prompt: zod.string().min(1, 'Prompt is required.').max(1000, 'Prompt is too long.') ,
  conversationId: zod.string().optional(),
});

export const chatcontroller ={

    
    async sendMessage (req: Request, res: Response)  {
         const parseResult = chatSchema.safeParse(req.body);
  
  const { prompt, conversationId } = req.body;

  if (typeof prompt !== 'string' || prompt.trim() === '') {
    res.status(400).json({ error: 'Prompt is required.' });
    return;
  }

  try {
      const response = await ChatService.sendMessage(
       prompt,
       conversationId || 'default-conversation',
      );
     res.json({
      id: response.id,
      message: response.message || 'No response from the model.',
    });
  } 
  catch (error) {
    console.error('Error generating response:', error);

    res.status(500).json({
      error: 'Failed to generate response',
    });
   }
  }
}

    
