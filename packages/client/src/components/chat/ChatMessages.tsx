import ReactMarkdown from "react-markdown";
import { TypingIndicator } from "./TypingIndicator";
import { useEffect, useRef } from "react";

export type Message = {
  content: string;
  role: "user" | "bot";
};

type Props = {
  messages: Message[];
  isBotTyping: boolean;
};

export const ChatMessages = ({ messages, isBotTyping }: Props) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleCopy = (e: React.ClipboardEvent<HTMLParagraphElement>) => {
    const selection = window.getSelection()?.toString().trim();
    if (selection) {
      e.clipboardData.setData("text/plain", selection);
      e.preventDefault();
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isBotTyping]);

  return (
    <div className="mb-4 flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-1 pb-2">
      {messages.length === 0 ? (
        <div className="mt-auto rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center text-sm text-slate-500 shadow-sm">
          Start a conversation and ask anything.
        </div>
      ) : (
        messages.map((message, index) => (
          <div
            key={`${message.role}-${index}`}
            onCopy={handleCopy}
            className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-sm ${
              message.role === "user"
                ? "ml-auto bg-gradient-to-r from-indigo-500 to-violet-500 text-white self-end"
                : "mr-auto bg-slate-100 text-slate-800 self-start"
            }`}
          >
            <div className="mb-1 text-[10px] font-semibold uppercase tracking-[0.12em] opacity-75">
              {message.role === "user" ? "You" : "Bot"}
            </div>
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
        ))
      )}
      {isBotTyping && <TypingIndicator />}

      <div ref={messagesEndRef} />
    </div>
  );
};
