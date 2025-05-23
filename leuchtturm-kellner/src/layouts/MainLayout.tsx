import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Nav from '../components/Nav';
import Dock from '../components/Dock';

const MainLayout = () => {
  return (
    <div className='grid grid-rows-[1fr_2rem] min-h-screen'>
      <Nav />
      <main className='mt-20 mx-auto'>
        <Outlet />
      </main>
      <Dock />
      <ToastContainer aria-label={'Toaster'} />
    </div>
  );
};

export default MainLayout;
