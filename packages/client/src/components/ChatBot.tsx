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

  return (
    <div className="flex h-full flex-col bg-white/70">
      <header className="flex items-center justify-between border-b border-slate-200/80 bg-slate-50/90 px-5 py-4 sm:px-6">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-500">
            AI Assistant
          </p>
          <h1 className="mt-1 text-lg font-semibold text-slate-800">Chat</h1>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25">
          AI
        </div>
      </header>

      <div className="flex min-h-0 flex-1 flex-col p-4 sm:p-5">
        <ChatMessages messages={messages} isBotTyping={isBotTyping} />
        <ChatInput onSubmit={onSubmit} />
      </div>
    </div>
  );
};

export default ChatBot;
