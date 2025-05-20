import { useEffect, useState } from 'react';
import type { Dish } from '../types';

const AddVariants = ({
  setDishSelected,
  trigger,
  selected,
}: {
  setDishSelected: React.Dispatch<React.SetStateAction<Dish | null>>;
  trigger: boolean;
  selected: number | undefined;
}) => {
  const [mainDishes, setMainDishes] = useState<null | Dish[]>(null);

  useEffect(() => {
    fetch(`http://localhost:3000/dishes`)
      .then((res) => res.json())
      .then((data) => setMainDishes(data.result))
      .catch((err) => console.log(err));
  }, [trigger]);

  useEffect(() => {
    const clickOutside = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest('[data-dish]') && !(e.target as HTMLElement).closest('form')) {
        setDishSelected(null);
      }
    };
    document.addEventListener('click', clickOutside);
    return () => document.removeEventListener('click', clickOutside);
  }, [setDishSelected]);

  return (
    <div className='py-4 px-3 flex gap-2 overflow-x-scroll my-5 max-w-xl scroll-smooth  snap-x snap-mandatory snap-always snap-end'>
      {mainDishes?.map((d) => (
        <button
          data-dish
          onClick={() => setDishSelected(d)}
          className={`border w-36 h-36 grid overflow-clip rounded shrink-0 ${
            selected === d.main_dishes.id ? 'ring-3 ring-offset-3 ring-primary' : ''
          }`}
          key={'dish-' + d.main_dishes.id}
        >
          <img
            className='col-end-1 row-end-1'
            draggable='false'
            src={
              `https://res.cloudinary.com/dvniua4ab/image/upload/c_thumb,g_center,h_150,w_150/f_webp/q_auto:eco/` +
              d.main_dishes.image
            }
            alt=''
          />
          <p className='col-end-1 row-end-1 text-slate-100 bg-slate-800/70 h-fit w-fit py-0.5 px-2 rounded m-2 self-end-safe'>
            {d.main_dishes.title}
          </p>
        </button>
      ))}
    </div>
  );
};

export default AddVariants;
