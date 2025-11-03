import { fireEvent, render, screen } from '@testing-library/react';
import { PixelButton } from './PixelButton';

describe('Button', () => {
  const TEXT = 'Test';

  it('renders with text', () => {
    render(<PixelButton>{TEXT}</PixelButton>);
    expect(screen.getByText(TEXT)).toBeDefined();
  });

  it('calls onClick handler when clicked', () => {
    const mockCallback = jest.fn();
    render(<PixelButton onClick={mockCallback}>{TEXT}</PixelButton>);
    const btn = screen.getByText(TEXT);
    fireEvent.click(btn);
    expect(mockCallback).toHaveBeenCalledTimes(1);
  });
});
