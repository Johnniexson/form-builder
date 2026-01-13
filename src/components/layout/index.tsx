import { Outlet, ScrollRestoration } from 'react-router';

function AppLayout() {
  return (
    <div className="relative">
      <Outlet />
      <ScrollRestoration />
    </div>
  );
}

export default AppLayout;
