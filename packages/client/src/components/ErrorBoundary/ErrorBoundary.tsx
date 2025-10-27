import { ReactNode, ErrorInfo } from 'react';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';
import { Button } from '../Button';
import styles from './ErrorBoundary.module.scss';

interface FallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

const ErrorFallback = ({ error, resetErrorBoundary }: FallbackProps) => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Something went wrong</h1>
        <p className={styles.message}>
          An unexpected error occurred. Please try reloading the page.
        </p>

        {process.env.NODE_ENV === 'development' && error && (
          <details className={styles.details}>
            <summary className={styles.summary}>
              Error details (development only)
            </summary>
            <pre className={styles.errorText}>{error.toString()}</pre>
          </details>
        )}

        <div className={styles.buttonContainer}>
          <Button onClick={resetErrorBoundary}>Try again</Button>
          <Button onClick={() => window.location.reload()}>Reload page</Button>
        </div>
      </div>
    </div>
  );
};

interface ErrorBoundaryProps {
  children: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

export const ErrorBoundary = ({ children, onError }: ErrorBoundaryProps) => {
  return (
    <ReactErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={onError}
      onReset={() => {}}
    >
      {children}
    </ReactErrorBoundary>
  );
};
