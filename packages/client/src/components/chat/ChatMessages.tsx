import ReactMarkdown from "react-markdown";
import { TypingIndicator } from "./TypingIndicator";
import { useEffect, useRef } from "react";


export type Message = {
  content: string;
  role: "user" | "bot";
};

type Props ={
    messages : Message[];
  isBotTyping: boolean;
}


export const ChatMessages = ({ messages, isBotTyping }: Props) => {
    
      const messagesEndRef = useRef<HTMLDivElement>(null);
    
      const handleCopy = ( e: React.ClipboardEvent<HTMLParagraphElement> ) =>
     { const selection = window.getSelection()?.toString().trim();
     if (selection) { e.clipboardData.setData("text/plain", selection); e.preventDefault(); } };
  
     useEffect(() => {
                     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
                  }, [messages, isBotTyping]);

  return (
    <div className="mb-4 flex min-h-0 flex-1 flex-col space-y-2 overflow-y-auto">
        {messages.map((message, index) => (
          <div
            key={`${message.role}-${index}`}
            onCopy={handleCopy}
            className={`w-fit rounded-xl p-2 ${
              message.role === "user" ?  " bg-blue-600 text-white self-end" : "bg-grey-600 text-black self-start"
            }`}
          >
            <strong>{message.role === "user" ? "You" : "Bot"}:</strong> <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
        ))}
      {isBotTyping && <TypingIndicator />}
        
        <div ref={messagesEndRef} />
      </div>
  )
}

