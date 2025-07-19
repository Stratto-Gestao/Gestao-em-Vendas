import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Loading from '../components/Loading';

describe('Loading Component', () => {
  it('renders loading spinner', () => {
    render(<Loading />);
    
    // Verifica se o texto "Carregando..." está presente
    expect(screen.getByText('Carregando...')).toBeInTheDocument();
  });

  it('renders with custom text', () => {
    const customText = 'Processando dados...';
    render(<Loading text={customText} />);
    
    // Verifica se o texto personalizado está presente
    expect(screen.getByText(customText)).toBeInTheDocument();
  });
});
