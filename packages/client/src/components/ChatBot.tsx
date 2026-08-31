import { FaArrowUp } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";


type FormData = {
  prompt: string;
};

type Message = {
  content: string;
  role: "user" | "bot";
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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isBotTyping]);

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
      setMessages((prev) => [
        ...prev,
        {
          content: "Something went wrong. Please try again.",
          role: "bot",
        },
      ]);
    }
  };

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(onSubmit)();
    }
  };

  return (
    <div className="flex h-[calc(100vh-2rem)] flex-col">
      <div className="mb-4 flex min-h-0 flex-1 flex-col space-y-2 overflow-y-auto">
        {messages.map((message, index) => (
          <p
            key={`${message.role}-${index}`}
            className={`w-fit rounded-xl p-2 ${
              message.role === "user" ?  " bg-blue-600 text-white self-end" : "bg-grey-600 text-black self-start"
            }`}
          >
            <strong>{message.role === "user" ? "You" : "Bot"}:</strong> <ReactMarkdown>{message.content}</ReactMarkdown>
          </p>
        ))}
        {isBotTyping && (
          <div className="flex gap-1 self-start rounded-xl bg-slate-200 px-3 py-3">
            <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-green-500" />
            <span
              className="inline-block h-2 w-2 animate-pulse rounded-full bg-green-500"
              style={{ animationDelay: "200ms" }}
            />
            <span
              className="inline-block h-2 w-2 animate-pulse rounded-full bg-green-500"
              style={{ animationDelay: "400ms" }}
            />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

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