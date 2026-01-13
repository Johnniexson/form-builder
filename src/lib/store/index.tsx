import { useContext } from 'react';
import { AppContext } from './app-context';

export const useAppStore = () => useContext(AppContext);
