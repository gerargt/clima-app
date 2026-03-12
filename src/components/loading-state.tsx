import { Spinner } from "@/components/ui/spinner";

type LoadingStateProps = {
  text?: string;
};

export function LoadingState({ text = "Cargando..." }: LoadingStateProps) {
  return (
    <div className="px-8 py-12 flex flex-col items-center gap-3">
      <Spinner className="size-8 text-white/60" />
      <p className="text-white/30 text-xs uppercase tracking-widest">{text}</p>
    </div>
  );
}
