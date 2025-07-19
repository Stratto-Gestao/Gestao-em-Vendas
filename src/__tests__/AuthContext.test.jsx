import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { AuthProvider } from '../contexts/AuthContext';

// Mock do Firebase para testes
vi.mock('../config/firebase', () => ({
  auth: {
    currentUser: null,
    onAuthStateChanged: vi.fn()
  },
  db: {}
}));

describe('AuthContext', () => {
  it('provides authentication context', () => {
    const TestComponent = () => {
      return <div>Test Component</div>;
    };

    const { getByText } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(getByText('Test Component')).toBeInTheDocument();
  });
});
