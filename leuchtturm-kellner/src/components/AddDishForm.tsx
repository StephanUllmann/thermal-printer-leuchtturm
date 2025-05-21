import { useState, type FormEvent } from 'react';
import type { OutletContext } from '../types/index';

import { toast } from 'react-toastify';
import AddCategory from './AddCategory';
import { useOutletContext } from 'react-router-dom';

interface DishFormElements extends HTMLFormControlsCollection {
  title: HTMLInputElement;
  image: { files: FileList };
  category: HTMLInputElement;
}

const AddDishForm = () => {
  const { setTrigger, categories } = useOutletContext<OutletContext>();

  // const [triggerRefetch, setTriggerRefetch] = useState(false);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const elements = (e.target as HTMLFormElement).elements as DishFormElements;
    if (!elements.title) return;
    const title = elements.title.value;
    const image = elements.image.files[0];
    const category = elements.category.value;

    if (!title) {
      toast.error('Füge einen Namen für das Gericht hinzu.');
      return;
    }
    if (!image) {
      toast.error('Füge eine Bild hinzu.');
      return;
    }
    if (!category) {
      toast.error('Füge eine Kategorie hinzu.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('image', image);
    formData.append('category', category);
    try {
      setLoading(true);
      const res = await fetch('http://localhost:3000/dishes', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Error posting new dish', { cause: res });
      toast.success('Neues Gericht hinzugefügt');
      (e.target as HTMLFormElement).reset();
      setFile('');
      setTrigger((p) => !p);
    } catch (error) {
      console.error(error);
      toast.error('Etwas ist schief gelaufen');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} inert={loading}>
      <fieldset className='fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4 mx-auto'>
        <legend className='fieldset-legend'>Neues Gericht hinzufügen</legend>

        <label className='label' htmlFor='title'>
          Name
        </label>
        <input type='text' className='input' placeholder='Name des Gerichts' id='title' name='title' />

        <label className='label' htmlFor='category'>
          Kategorie
        </label>
        <div className='flex'>
          <select defaultValue='Wähle eine Kategorie' className='select' name='category' id='category'>
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
            {file ? <img src={file} alt='' className='object-center object-contain' /> : <span>+</span>}
          </div>
        </label>
        <input
          type='file'
          className='hidden'
          name='image'
          id='image'
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              setFile(URL.createObjectURL(e.target.files[0]));
            }
          }}
        />

        <button className='btn'>
          {loading ? <span className='loading loading-infinity loading-sm'></span> : 'Eintragen'}
        </button>
      </fieldset>
    </form>
  );
};

export default AddDishForm;
