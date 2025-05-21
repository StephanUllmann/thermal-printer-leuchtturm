import { useRef, type FormEvent } from 'react';
import { createPortal } from 'react-dom';
import { useOutletContext } from 'react-router-dom';
import { toast } from 'react-toastify';
import type { OutletContext } from '../types';

interface CategoryFormElements extends HTMLFormControlsCollection {
  'new-category': HTMLInputElement;
}

const AddCategory = () => {
  const dialogRef = useRef<null | HTMLDialogElement>(null);

  const { setRefetchCategories } = useOutletContext<OutletContext>();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const elements = (e.target as HTMLFormElement).elements as CategoryFormElements;
    const newCategory = elements['new-category'].value;
    if (!newCategory) return;

    try {
      const res = await fetch(`http://localhost:3000/dishes/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newCategory }),
      });
      if (!res.ok) throw new Error('Error creating new category', { cause: res });
      const data = await res.json();
      console.log(data);
      setRefetchCategories((p) => !p);
      toast.success('Neue Kategorie hinzugefügt');
      (e.target as HTMLFormElement).reset();
      dialogRef.current?.close();
    } catch (error) {
      console.log(error);
      toast.error('Etwas ist schief gelaufen');
    }
  };

  return (
    <>
      <button type='button' className='btn' onClick={() => dialogRef.current?.showModal()}>
        +
      </button>
      {createPortal(
        <dialog ref={dialogRef} className='modal'>
          <form onSubmit={handleSubmit} className='modal-box flex flex-col'>
            <label className='label' htmlFor='new-category'>
              Neue Kategorie
            </label>
            <input
              type='text'
              className='input w-full'
              placeholder='Neue Kategorie'
              id='new-category'
              name='new-category'
            />
            <div className='modal-action'>
              <button type='button' onClick={() => dialogRef.current?.close()} className='btn btn-warning'>
                Schließen
              </button>
              <button className='btn btn-primary'>Hinzufügen</button>
            </div>
          </form>
        </dialog>,
        document.body
      )}
    </>
  );
};

export default AddCategory;
