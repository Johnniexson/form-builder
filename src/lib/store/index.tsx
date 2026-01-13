import { useContext } from 'react';
import { AppContext } from './app-context';
import { FormBuilderContext } from './form-builder-context';

export const useFormBuilder = () => {
  const context = useContext(FormBuilderContext);
  if (!context) {
    throw new Error('useFormBuilder must be used within FormBuilderProvider');
  }
  return context;
};

export const useAppStore = () => useContext(AppContext);
