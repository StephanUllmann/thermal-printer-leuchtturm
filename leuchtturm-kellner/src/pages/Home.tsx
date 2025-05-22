import type { Dish } from '../types';
import { useCallback, useState } from 'react';
import Categories from '../components/Categories';
import { fetcher } from '../utils';
import useSWR from 'swr';
import { toast } from 'react-toastify';

const Home = () => {
  const { data: mainDishes } = useSWR<Dish[]>('http://localhost:3000/dishes', fetcher);
  const [selection, setSelection] = useState<null | Record<string, number>>(null);

  const changeSelection = useCallback(
    (name: string, operation: 'inc' | 'dec') => {
      setSelection((prev) => {
        const d = operation === 'inc' ? 1 : -1;

        if (!prev && operation === 'inc') return { [name]: 1 };
        if (prev && name in prev && prev[name] === 1 && operation === 'dec') {
          const newSelection = { ...prev };
          delete newSelection[name];
          return newSelection;
        }
        if (prev && !(name in prev) && operation === 'inc') return { ...prev, [name]: 1 };
        if (prev && name in prev) return { ...prev, [name]: prev[name] + d };
        return prev;
      });
    },
    [mainDishes]
  );

  // console.log(selection);

  const ordered =
    mainDishes &&
    Object.entries(Object.groupBy(mainDishes, ({ categories }) => categories.name)).sort((a, b) =>
      a[0].localeCompare(b[0])
    );
  // console.dir(mainDishes);

  const handleSendToKitchen = async () => {
    if (!selection) return;
    const toPrint = Object.entries(selection)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([title, count]) => [title, count.toString()]);

    try {
      const res = await fetch('http://localhost:3000/print/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(toPrint),
      });

      const { msg } = await res.json();
      if (msg !== 'Printed') throw new Error('Print failed');
      setSelection(null);
      toast.success('🧑‍🍳');
    } catch (error) {
      console.log(error);
      toast.error('Das ist schief gegangen');
    }
  };

  return (
    <>
      {selection && (
        <button onClick={handleSendToKitchen} className='fixed top-3 right-5 btn-primary btn'>
          In die Küche!
        </button>
      )}
      <div className=''>
        {ordered?.map(([category, dishes]) => (
          <Categories
            key={category}
            category={category}
            dishes={dishes as Dish[]}
            selection={selection}
            changeSelection={changeSelection}
          />
        ))}
      </div>
    </>
  );
};

export default Home;
