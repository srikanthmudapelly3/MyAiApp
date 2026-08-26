import OpenAI from "openai";
import { conversationRepository } from "../repositories/conversation.repository";

type ChatResponse = {
  id: string;
  message: string;
};

export  const ChatService = {
  
  async sendMessage(prompt: string, conversationId: string): Promise<ChatResponse> {
    const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  throw new Error('Set a valid OPENAI_API_KEY in packages/server/.env before starting the server.');
}

const client = new OpenAI({
  apiKey,
});


 const response = await client.responses.create({
      model: 'gpt-5.4-mini',
      input: prompt,
      store: true,
      // previous_response_id: lastResponseId, // Send the last response ID to the server
       previous_response_id: conversationRepository.getLastResponseId(conversationId), // Use the last response ID for the specific conversation
    });
    // lastResponseId = response.id; // Store the last response ID
    conversationRepository.setLastResponseId(conversationId, response.id); // Store the response ID for the specific conversation 
return {
     id: response.id,
      message: response.output_text 
    };
}
}