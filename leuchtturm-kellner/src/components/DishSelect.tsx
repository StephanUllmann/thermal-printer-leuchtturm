import { useEffect, useRef, useState } from 'react';
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
  const liRef = useRef<null | HTMLLIElement>(null);
  const [showVariants, setShowVariants] = useState(false);

  const hasVariants = (dish.variants && dish.variants?.length > 0) ?? false;

  const handleSelect = (title: string, operation: 'inc' | 'dec') => {
    changeSelection(title, operation);
  };

  const totalStandard = selection
    ? Object.entries(selection)
        .filter((entry) => {
          return entry[0].startsWith(dish.main_dishes.title);
        })
        .reduce((acc, val) => (acc += val[1]), 0)
    : 0;

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (liRef.current && !liRef.current.contains(e.target as HTMLElement)) {
        setShowVariants(false);
      }
    };

    document.addEventListener('click', handleClick, true);

    return () => document.removeEventListener('click', handleClick, true);
  }, []);

  return (
    <li ref={liRef} className=''>
      <div className='list-row shadow' onClick={() => hasVariants && setShowVariants((p) => !p)}>
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
          <div className='text-lg capitalize font-semibold opacity-80'>{dish.main_dishes.title}</div>
        </div>
        {hasVariants ? (
          <>
            {totalStandard > 0 && <span className='content-center'>{totalStandard}</span>}
            <button className='mr-10'>
              <svg
                width='16'
                height='16'
                fill='currentColor'
                className={`transition-transform rotate-0 ${showVariants ? 'rotate-180 outline-0' : ''}}`}
                viewBox='0 0 16 16'
              >
                <path
                  fillRule='evenodd'
                  d='M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708'
                />
              </svg>
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => (hasVariants ? setShowVariants(true) : handleSelect(dish.main_dishes.title, 'dec'))}
              className='btn btn-square '
            >
              &minus;
            </button>

            <span className='content-center'>{totalStandard}</span>

            <button
              onClick={() => (hasVariants ? setShowVariants(true) : handleSelect(dish.main_dishes.title, 'inc'))}
              className='btn btn-square '
            >
              &#x2B;
            </button>
          </>
        )}
      </div>
      {hasVariants && (
        <ul
          className={`mb-5 overflow-clip transition-[height] transition-discrete shadow-lg ${
            showVariants ? 'h-auto' : 'h-0'
          }`}
        >
          <li className='list-row justify-between flex'>
            <div className='content-center'>
              <div className='ml-5 text-xs capitalize font-semibold opacity-60'>Standard</div>
            </div>
            <div>
              <button onClick={() => handleSelect(dish.main_dishes.title, 'dec')} className='btn btn-square'>
                &minus;
              </button>
              <span className='content-center mx-2'>{selection?.[dish.main_dishes.title] ?? 0}</span>
              <button onClick={() => handleSelect(dish.main_dishes.title, 'inc')} className='btn btn-square'>
                &#x2B;
              </button>
            </div>
          </li>
          {dish.variants!.map((v) => {
            const key = `${dish.main_dishes.title} -- ${v.title}`;
            return (
              <li key={key} className='list-row justify-between flex'>
                <div className='content-center'>
                  <div className='ml-5 text-xs capitalize font-semibold opacity-60'>{v.title}</div>
                </div>
                <div>
                  <button onClick={() => handleSelect(key, 'dec')} className='btn btn-square'>
                    &minus;
                  </button>
                  <span className='content-center mx-2'>{selection?.[key] ?? 0}</span>
                  <button onClick={() => handleSelect(key, 'inc')} className='btn btn-square'>
                    &#x2B;
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </li>
  );
};

export default DishSelect;
