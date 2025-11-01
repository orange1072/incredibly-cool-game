import { useState } from 'react';
import { TestErrorComponent } from './TestErrorComponent';

export const ErrorBoundaryTestSection = () => {
  const [shouldThrow, setShouldThrow] = useState(false);

  return (
    <section className="demo-section">
      <h2 className="demo-section-title">6. ErrorBoundary Test</h2>
      <div className="demo-responsive metal-panel">
        <p>Click the button to trigger an error and test ErrorBoundary:</p>
        <button
          className="stalker-button danger"
          onClick={() => setShouldThrow(true)}
        >
          Trigger Error
        </button>
        {shouldThrow && <TestErrorComponent shouldThrow />}
      </div>
    </section>
  );
};
