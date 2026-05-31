import { render, screen } from '@testing-library/react';
import App from './App';

test('renders TaskFlow heading', () => {
  render(<App />);
  const heading = screen.getByText(/TaskFlow/i);
  expect(heading).toBeInTheDocument();
});

test('renders add task button', () => {
  render(<App />);
  const btn = screen.getByText(/\+ Add/i);
  expect(btn).toBeInTheDocument();
});
