import type { appState } from '@/lib/store/app-state';

export type AppContextType = {
  state: typeof appState & Record<string, unknown>;
  setState: (key: string, value: string | number | object | boolean) => void;
};