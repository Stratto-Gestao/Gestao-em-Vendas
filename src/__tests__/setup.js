import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock do Firebase
vi.mock('./config/firebase', () => ({
  auth: {
    currentUser: null,
    onAuthStateChanged: vi.fn()
  },
  db: {}
}));

// Mock do console para testes mais limpos
global.console = {
  ...console,
  warn: vi.fn(),
  error: vi.fn(),
};
