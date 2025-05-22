import { useState, type FormEvent } from 'react';
import useSWR from 'swr';
import { toast } from 'react-toastify';
import AddCategory from './AddCategory';
import VariantsForm from './VariantsForm';
import { fetcher } from '../utils';
import type { Dish, InsertCategory } from '../types';

const editDish = async (dishId: number, formData: FormData) => {
  const res = await fetch(`http://localhost:3000/dishes/${dishId}`, {
    method: 'PUT',
    body: formData,
  });

  if (!res.ok) throw new Error('Error posting new dish', { cause: res });
  const data = await res.json();
  return data;
};

const EditDishForm = ({ dishId }: { dishId: Dish['main_dishes']['id'] }) => {
  const [fileURL, setFileURL] = useState('');
  const [file, setFile] = useState<null | File>(null);
  const { data: categories } = useSWR<InsertCategory[]>('http://localhost:3000/dishes/categories', fetcher);

  const { data: dishes, mutate, isValidating } = useSWR<Dish[]>('http://localhost:3000/dishes', fetcher);
  const dish = dishes?.find((d) => d.main_dishes.id === dishId);
  const [selectedCategory, setSelectedCategory] = useState(() => dish!.categories);
  const [title, setTitle] = useState(dish!.main_dishes.title);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('category', selectedCategory!.id!.toString());
    if (file) formData.append('image', file);
    try {
      const optimisticData = dishes?.map((d) => {
        if (d.main_dishes.id !== dishId) return d;

        return { ...d, [d.main_dishes.title]: title };
      });

      await mutate(editDish(dishId!, formData), {
        optimisticData,
        rollbackOnError: true,
        populateCache: true,
        revalidate: true,
      });

      toast.success('Gespeichert');
      setFile(null);
      setFileURL('');
    } catch (error) {
      console.error(error);
      toast.error('Etwas ist schief gelaufen');
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} inert={isValidating}>
        <fieldset className='fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4 mx-auto'>
          <legend className='fieldset-legend'>- {title} - bearbeiten</legend>

          <label className='label' htmlFor='title'>
            Name
          </label>
          <input
            type='text'
            className='input'
            placeholder='Name des Gerichts'
            id='title'
            name='title'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <label className='label' htmlFor='category'>
            Kategorie
          </label>
          <div className='flex'>
            <select
              value={selectedCategory.id}
              className='select'
              name='category'
              id='category'
              onChange={(e) => setSelectedCategory(() => categories?.find((c) => c.id === +e.target.value))}
            >
              <option disabled={true}>Wähle eine Kategorie</option>
              {categories?.map((c) => (
                <option value={c.id} key={c.name + c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <AddCategory />
          </div>

          <label className='label flex flex-col items-start' htmlFor='image'>
            <p className='text-start'>Bild</p>
            <div className='w-20 aspect-square border rounded grid place-content-center text-3xl cursor-pointer overflow-hidden'>
              <img
                src={
                  fileURL ||
                  `https://res.cloudinary.com/dvniua4ab/image/upload/c_thumb,g_center,h_150,w_150/f_webp/q_auto:eco/` +
                    dish!.main_dishes.image
                }
                alt=''
                className='object-center object-contain'
              />
            </div>
          </label>
          <input
            type='file'
            className='hidden'
            name='image'
            id='image'
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) {
                setFileURL(URL.createObjectURL(f));
                setFile(f);
              }
            }}
          />

          <button className='btn'>
            {isValidating ? <span className='loading loading-infinity loading-sm'></span> : 'Speichern'}
          </button>
        </fieldset>
      </form>
      <VariantsForm dishId={dishId} />
    </>
  );
};

export default EditDishForm;
