

type DotProps = {
  className?: string;
};

const Dot = ({ className}: DotProps) => {
  return (
    <span
      className={`inline-block h-2 w-2 animate-pulse rounded-full bg-green-500 ${className}`}
    />
  );
};

export const TypingIndicator = () => {
  return (
    <div className="flex gap-1 self-start rounded-xl bg-slate-200 px-3 py-3">
      <Dot />
      <Dot className="[animation-delay:200ms]" />
      <Dot className="[animation-delay:400ms]" />
    </div>
  );
};

