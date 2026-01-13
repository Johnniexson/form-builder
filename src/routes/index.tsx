import React from 'react';
import AppLayout from '@/components/layout';
import ErrorBoundary from '@/components/layout/ErrorBoundary';

const StartPage = React.lazy(() => import('@/pages/StartPage'));
const NotFound = React.lazy(() => import('@/pages/NotFound'));

export default function generateRoutes() {
  return [
    {
      path: '/',
      element: (
        <ErrorBoundary>
          <AppLayout />
        </ErrorBoundary>
      ),
      children: [
        {
          path: '',
          element: <StartPage />,
        },
      ],
    },
    {
      path: '*',
      element: <NotFound />,
    },
  ];
}
