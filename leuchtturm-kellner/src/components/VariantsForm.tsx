import type { FormEvent } from 'react';
import type { Dish, OutletContext } from '../types';
import { toast } from 'react-toastify';
import { useOutletContext } from 'react-router-dom';

interface VariantsElements extends HTMLFormControlsCollection {
  newVariant: HTMLInputElement;
}

const VariantsForm = ({ dishId }: { dishId: Dish['main_dishes']['id'] }) => {
  const { setTrigger, mainDishes } = useOutletContext<OutletContext>();
  console.log(dishId);
  const dish = mainDishes?.find((d) => d.main_dishes.id === dishId);
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const elements = (e.target as HTMLFormElement).elements as VariantsElements;
    if (!elements.newVariant || !dish) return;
    const title = elements.newVariant.value;
    if (!title) return;

    try {
      const res = await fetch(`http://localhost:3000/dishes/${dish.main_dishes.id}/variants`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title }),
      });
      if (!res.ok) throw new Error('Error posting new variant', { cause: res });
      (e.target as HTMLFormElement).reset();
      setTrigger((p) => !p);
    } catch (error) {
      console.error(error);
      toast.error('Etwas ist schief gelaufen');
    }
  };

  const handleDelete = async (variantId: number) => {
    if (!dish) return;
    try {
      const res = await fetch(`http://localhost:3000/dishes/${dish.main_dishes.id}/variants/${variantId}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Error deleting variant', { cause: res });
      setTrigger((p) => !p);
    } catch (error) {
      console.error(error);
      toast.error('Etwas ist schief gelaufen');
    }
  };

  // console.log('VARIANTS: ', dish?.variants);
  return (
    <div
      data-dish
      className='flex flex-col items-center my-3 max-h-80 overflow-y-auto
    '
    >
      <h2>Varianten</h2>
      {dish &&
        Array.isArray(dish.variants) &&
        dish.variants.map((v) => (
          <div className='w-xs  join'>
            <span className='input join-item'>{v.title}</span>

            <button onClick={() => handleDelete(v.id!)} type='button' className='btn join-item w-12'>
              -
            </button>
          </div>
        ))}
      <form className='w-xs join' onSubmit={handleSubmit}>
        <input type='text' className='input join-item' name='newVariant' />
        <button className='btn join-item w-12'>+</button>
      </form>
    </div>
  );
};

export default VariantsForm;
