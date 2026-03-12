type ErrorAlertProps = {
  message: string;
};

export function ErrorAlert({ message }: ErrorAlertProps) {
  return (
    <div className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-red-300 text-xs leading-relaxed">
      ⚠ {message}
    </div>
  );
}
