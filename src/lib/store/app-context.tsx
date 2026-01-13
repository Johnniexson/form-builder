import { type FC, createContext, useState } from 'react';
import { appState } from './app-state';

interface AppContextType {
  state: typeof appState & Record<string, unknown>;
  setState: (key: string, value: string | number | object | boolean) => void;
}

export const AppContext = createContext<AppContextType>({
  state: appState,
  setState: () => {},
});

const AppProvider: FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [state, _setState] = useState(appState);

  const setState = (key: string, value: string | number | object | boolean) => {
    _setState((innerState) => ({ ...innerState, [key]: value }));
  };

  return (
    <AppContext.Provider
      value={{
        state,
        setState,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
