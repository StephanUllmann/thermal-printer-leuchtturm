import { useState } from 'react';
import type { Dish } from '../types';

const EditDishForm = ({ dish }: { dish: Dish }) => {
  const [file, setFile] = useState('');
  const [loading, setLoading] = useState(false);

  return (
    <form onSubmit={() => {}} inert={loading}>
      <fieldset className='fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4 mx-auto'>
        <legend className='fieldset-legend'>- {dish.main_dishes.title} - bearbeiten</legend>

        <label className='label' htmlFor='title'>
          Name
        </label>
        <input
          type='text'
          className='input'
          placeholder='Name des Gerichts'
          id='title'
          name='title'
          value={dish.main_dishes.title}
        />

        <label className='label' htmlFor='category'>
          Kategorie
        </label>
        <div className='flex'>
          {/* <select defaultValue='Wähle eine Kategorie' className='select' name='category' id='category'>
            <option disabled={true}>Wähle eine Kategorie</option>
            {categories?.map((c) => (
              <option value={c.id} key={c.name + c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <AddCategory setTriggerRefetch={setTriggerRefetch} /> */}
        </div>

        <label className='label flex flex-col items-start' htmlFor='image'>
          <p className='text-start'>Bild</p>
          <div className='w-20 aspect-square border rounded grid place-content-center text-3xl cursor-pointer overflow-hidden'>
            <img
              src={
                file ||
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
          onChange={(e) => setFile(URL.createObjectURL(e.target.files[0]))}
        />

        <button className='btn'>
          {loading ? <span className='loading loading-infinity loading-sm'></span> : 'Eintragen'}
        </button>
      </fieldset>
    </form>
  );
};

export default EditDishForm;
