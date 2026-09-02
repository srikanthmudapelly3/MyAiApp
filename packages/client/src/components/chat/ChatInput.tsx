import React from 'react'
import { useForm } from 'react-hook-form';
import { FaArrowUp } from "react-icons/fa";


export type ChatFormData = {
  prompt: string;
};
type Props = {
  onSubmit: (data: ChatFormData) => void;
};

const ChatInput = ({ onSubmit }: Props) => {
  const { register, handleSubmit, reset, formState } = useForm<ChatFormData>({
    mode: "onChange",
  });

  const handleFormSubmit = handleSubmit((data) => {
    reset();
    onSubmit(data);
  });

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleFormSubmit();
    }
  };

  return (
   <form
        onSubmit={handleFormSubmit}
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
  )
}

export default ChatInput