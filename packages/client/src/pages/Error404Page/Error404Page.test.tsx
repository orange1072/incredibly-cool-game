import { fireEvent, render, screen } from '@testing-library/react';
import { Error404Page } from './Error404Page';
import { BrowserRouter, useNavigate } from 'react-router-dom';

const mockUseNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockUseNavigate,
}));
const mockNavigate = useNavigate();

describe('Error404Page', () => {
  it('contains 404', () => {
    render(
      <BrowserRouter>
        <Error404Page />
      </BrowserRouter>
    );
    expect(screen.getByText('404')).toBeDefined();
  });

  it('has button that navigates to main page', () => {
    render(
      <BrowserRouter>
        <Error404Page />
      </BrowserRouter>
    );
    const btn = screen.getByRole('button', { name: /return/i });
    fireEvent.click(btn);
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});
