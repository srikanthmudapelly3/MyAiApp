import { FaArrowUp } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { useRef, useState } from "react";
import axios from "axios";
import { ChatMessages, type Message } from "./chat/ChatMessages";

type FormData = {
  prompt: string;
};

type ChatResponse = {
  id: string;
  message: string;
};

const ChatBot = () => {
  const conversationId = useRef(crypto.randomUUID());
  const { register, handleSubmit, reset, formState } = useForm<FormData>({
    mode: "onChange",
  });
  const [messages, setMessages] = useState<Message[]>([]);
  const [isBotTyping, setIsBotTyping] = useState(false);

  const onSubmit = async ({ prompt }: FormData) => {
    const userMessage: Message = {
      content: prompt,
      role: "user",
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsBotTyping(true);
    reset();

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

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(onSubmit)();
    }
  };


  return (
    <div className="flex h-[calc(100vh-2rem)] flex-col">
     
  <ChatMessages messages={messages} isBotTyping={isBotTyping} />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex shrink-0 flex-col items-end gap-2 rounded-3xl border-2 bg-background p-4"
      >
        <textarea
          {...register("prompt", {
            required: true,
            validate: (data) => data.trim().length > 0,
          })}
          onKeyDown={onKeyDown}
          autoFocus
          className="w-full border-none outline-none focus:outline-none focus:ring-0 resize-none"
          placeholder="Ask any text..."
          maxLength={1000}
        />

        <button disabled={!formState.isValid} className="rounded-full w-9 h-9">
          <FaArrowUp className="" color="red" />
        </button>
      </form>
    </div>
  );
};

export default ChatBot;
