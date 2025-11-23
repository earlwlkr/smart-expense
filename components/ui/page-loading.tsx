import { LoadingSpinner } from "./loading-spinner";

interface PageLoadingProps {
  message?: string;
  size?: "sm" | "md" | "lg";
}

export function PageLoading({
  message = "Loading...",
  size = "md",
}: PageLoadingProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] space-y-4">
      <LoadingSpinner size={size} />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}
