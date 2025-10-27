import { useState } from 'react';
import { Button } from '../Button';

export const ErrorThrowButton = () => {
  const [shouldError, setShouldError] = useState(false);

  if (shouldError) {
    throw new Error('Test error triggered from ErrorThrowButton!');
  }

  return (
    <Button onClick={() => setShouldError(true)} styleType="danger">
      Throw Error
    </Button>
  );
};
