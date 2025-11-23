import { LoadingSpinner } from "./loading-spinner";

interface ComponentLoadingProps {
  isLoading: boolean;
  children: React.ReactNode;
  loadingMessage?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function ComponentLoading({
  isLoading,
  children,
  loadingMessage,
  size = "sm",
  className = "",
}: ComponentLoadingProps) {
  if (isLoading) {
    return (
      <div className={`flex items-center justify-center p-4 ${className}`}>
        <div className="flex items-center space-x-2">
          <LoadingSpinner size={size} />
          {loadingMessage && (
            <span className="text-sm text-muted-foreground">
              {loadingMessage}
            </span>
          )}
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
