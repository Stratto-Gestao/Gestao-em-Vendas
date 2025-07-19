import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from '../App';

describe('App Component', () => {
  it('renders without crashing', () => {
    render(<App />);
    // Verifica se o componente renderiza sem erros
    expect(document.body).toBeInTheDocument();
  });
});
