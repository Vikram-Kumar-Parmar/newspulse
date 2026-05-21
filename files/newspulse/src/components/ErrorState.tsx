import { AlertCircle, RefreshCw } from "lucide-react";

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="error-state" role="alert">
      <AlertCircle className="error-state__icon" size={32} strokeWidth={1.5} />
      <h3 className="error-state__title">Couldn't load news</h3>
      <p className="error-state__message">{message}</p>
      {onRetry && (
        <button className="btn btn--secondary" onClick={onRetry} type="button">
          <RefreshCw size={15} />
          Try again
        </button>
      )}
    </div>
  );
}
