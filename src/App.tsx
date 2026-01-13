import { Toaster as Sonner } from '@/components/ui/sonner';
import AppProvider from './lib/store/app-context';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import generateRoutes from './routes';

function App() {
  const router = createBrowserRouter(generateRoutes());

  return (
    <AppProvider>
      <Sonner
        position="top-right"
        closeButton
        expand={true}
        richColors
        duration={10000}
        toastOptions={{
          classNames: {
            success: 'bg-green-500 text-white',
            error: 'bg-red-500 text-white',
            warning: 'bg-yellow-500 text-black',
            info: 'bg-blue-500 text-white',
            toast: 'bg-white text-black border border-gray-200 shadow-md',
          },
        }}
      />
      <RouterProvider router={router} />
    </AppProvider>
  );
}

export default App;
