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
      className="mt-2 flex shrink-0 items-end gap-3 rounded-[24px] border border-slate-200 bg-slate-50/80 p-2 shadow-[inset_0_1px_2px_rgba(15,23,42,0.04)]"
    >
      <textarea
        {...register("prompt", {
          required: true,
          validate: (data) => data.trim().length > 0,
        })}
        onKeyDown={onKeyDown}
        autoFocus
        rows={1}
        className="max-h-32 min-h-[44px] w-full resize-none border-none bg-transparent px-3 py-2 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:outline-none focus:ring-0"
        placeholder="Ask any text..."
        maxLength={1000}
      />

      <button
        type="submit"
        disabled={!formState.isValid}
        className={`flex h-11 w-11 items-center justify-center rounded-full transition-all duration-200 ${
          formState.isValid
            ? "bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-lg shadow-indigo-500/25 hover:-translate-y-0.5"
            : "bg-slate-200 text-slate-400"
        }`}
      >
        <FaArrowUp className="h-4 w-4" />
      </button>
    </form>
  )
}

export default ChatInput