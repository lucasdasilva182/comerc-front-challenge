import { vi } from 'vitest';
import '@testing-library/jest-dom/vitest';

global.fetch = vi.fn();

vi.mock('vue-router', () => ({
  useRoute: vi.fn(),
  useRouter: vi.fn(() => ({
    push: vi.fn(),
  })),
}));
