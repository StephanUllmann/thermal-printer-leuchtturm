import { useState, type FormEvent } from 'react';
import type { Dish, OutletContext } from '../types';
import { useOutletContext } from 'react-router-dom';
import AddCategory from './AddCategory';
import { toast } from 'react-toastify';
import VariantsForm from './VariantsForm';

const EditDishForm = ({ dish }: { dish: Dish }) => {
  const [fileURL, setFileURL] = useState('');
  const [file, setFile] = useState<null | File>(null);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(() => dish.categories);
  const [title, setTitle] = useState(dish.main_dishes.title);
  const { categories, setTrigger } = useOutletContext<OutletContext>();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('category', selectedCategory!.id!.toString());
    if (file) formData.append('image', file);
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:3000/dishes/${dish.main_dishes.id}`, {
        method: 'PUT',
        body: formData,
      });

      if (!res.ok) throw new Error('Error posting new dish', { cause: res });
      toast.success('Gespeichert');
      setFile(null);
      setFileURL('');
      setTrigger((p) => !p);
    } catch (error) {
      console.error(error);
      toast.error('Etwas ist schief gelaufen');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} inert={loading}>
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
                    dish.main_dishes.image
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
            {loading ? <span className='loading loading-infinity loading-sm'></span> : 'Speichern'}
          </button>
        </fieldset>
      </form>
      <VariantsForm dishId={dish.main_dishes.id} />
    </>
  );
};

export default EditDishForm;
