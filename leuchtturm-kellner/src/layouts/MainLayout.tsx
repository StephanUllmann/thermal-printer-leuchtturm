import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Nav from '../components/Nav';
import { useEffect, useState } from 'react';
import type { Dish, OutletContext, InsertCategory } from '../types';

const MainLayout = () => {
  const [mainDishes, setMainDishes] = useState<null | Dish[]>(null);
  const [categories, setCategories] = useState<null | InsertCategory[]>(null);

  const [trigger, setTrigger] = useState(false);
  const [refetchCategories, setRefetchCategories] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:3000/dishes`)
      .then((res) => res.json())
      .then((data) => setMainDishes(data.result))
      .catch((err) => console.log(err));
  }, [trigger]);

  useEffect(() => {
    fetch(`http://localhost:3000/dishes/categories`)
      .then((res) => res.json())
      .then((data) => setCategories(data.result))
      .catch((err) => console.log(err));
  }, [refetchCategories]);

  const outletContext: OutletContext = {
    trigger,
    setTrigger,
    mainDishes,
    setMainDishes,
    categories,
    setCategories,
    setRefetchCategories,
  };

  return (
    <div className='grid grid-rows-[1fr_2rem] min-h-screen'>
      <Nav />
      <main className='mt-20 mx-auto'>
        <Outlet context={outletContext} />
      </main>
      <footer>&copy; '25</footer>
      <ToastContainer aria-label={'Toaster'} />
    </div>
  );
};

export default MainLayout;
