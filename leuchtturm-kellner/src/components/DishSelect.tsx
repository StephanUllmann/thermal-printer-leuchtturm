import type { Dish } from '../types';

const DishSelect = ({
  dish,
  selection,
  changeSelection,
}: {
  dish: Dish;
  selection: null | Record<string, number>;
  changeSelection: (name: string, operation: 'inc' | 'dec') => void;
}) => {
  const handleSelect = (operation: 'inc' | 'dec') => {
    changeSelection(dish.main_dishes.title, operation);
  };

  return (
    <li className='list-row'>
      <div>
        <img
          className='size-10 rounded-box'
          src={
            `https://res.cloudinary.com/dvniua4ab/image/upload/c_thumb,g_center,h_150,w_150/f_webp/q_auto:eco/` +
            dish.main_dishes.image
          }
          alt=''
        />
      </div>
      <div className='content-center'>
        <div className='text-sm capitalize font-semibold opacity-60'>{dish.main_dishes.title}</div>
      </div>
      <button onClick={() => handleSelect('dec')} className='btn btn-square '>
        &minus;
      </button>
      <span className='content-center'>{selection?.[dish.main_dishes.title] ?? 0}</span>
      <button onClick={() => handleSelect('inc')} className='btn btn-square '>
        &#x2B;
      </button>
    </li>
  );
};

export default DishSelect;
