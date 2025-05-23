import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Nav from '../components/Nav';
import Dock from '../components/Dock';

const themeMap: Record<string, string> = {
  light: 'garden',
  dark: 'night',
};

const MainLayout = () => {
  const [theme, setTheme] = useState<string>('garden');
  return (
    <div data-theme={themeMap[theme]} className='grid grid-rows-[1fr_2rem] min-h-screen'>
      <Nav />
      <main className='mt-20 mx-auto'>
        <Outlet />
      </main>
      <Dock setTheme={setTheme} />
      <ToastContainer aria-label={'Toaster'} />
    </div>
  );
};

export default MainLayout;
