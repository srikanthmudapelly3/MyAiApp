import { useRef, useState } from "react";
import axios from "axios";
import { ChatMessages, type Message } from "./chat/ChatMessages";
import type { ChatFormData } from "./chat/ChatInput";
import ChatInput from "./chat/ChatInput";
import notifisounds from "@/assets/sounds/Message-notification/Message-notification.mp3";
import popSound from "@/assets/sounds/Message-sent-sound-effect/Message-sent-sound-effect.mp3";

const notificationsounds = new Audio(notifisounds);
notificationsounds.volume = 0.2;
const popSounds= new Audio(popSound);
popSounds.volume = 0.2;

type ChatResponse = {
  id: string;
  message: string;
};

const ChatBot = () => {
  const conversationId = useRef(crypto.randomUUID());

  const [messages, setMessages] = useState<Message[]>([]);
  const [isBotTyping, setIsBotTyping] = useState(false);

  const onSubmit = async ({ prompt }: ChatFormData) => {
    const userMessage: Message = {
      content: prompt,
      role: "user"
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsBotTyping(true);
    popSounds.play();

    try {
      const response = await axios.post<ChatResponse>("/api/chat", {
        prompt,
        conversationId: conversationId.current,
      });

      const botMessage: Message = {
        content: response.data.message,
        role: "bot",
      };

      setMessages((prev) => [...prev, botMessage]);
      setIsBotTyping(false);
      notificationsounds.play();
    } catch (error) {
      console.error("Error sending chat message:", error);
      setIsBotTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          content: "Something went wrong. Please try again.",
          role: "bot",
        },
      ]);
    }
  };

  <ChatBot />;

  return (
    <div className="flex h-[calc(100vh-2rem)] flex-col">
      <ChatMessages messages={messages} isBotTyping={isBotTyping} />
    <ChatInput onSubmit={onSubmit} />

    </div>
  );
};

export default ChatBot;
