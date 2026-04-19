interface AlertErrorProps {
  message: string;
}

export function AlertError({ message }: AlertErrorProps) {
  return (
    <div className="bg-red-500/20 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg">
      {message}
    </div>
  );
}
