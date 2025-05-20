import { useState } from 'react';
import AddVariants from '../components/AddVariants';
import AddDishForm from '../components/AddDishForm';
import type { Dish } from '../types';
import EditDishForm from '../components/EditDishForm';

const AddDish = () => {
  const [dishSelected, setDishSelected] = useState<null | Dish>(null);
  const [trigger, setTrigger] = useState(false);

  return (
    <>
      {dishSelected ? <EditDishForm dish={dishSelected} /> : <AddDishForm setTrigger={setTrigger} />}
      <AddVariants trigger={trigger} setDishSelected={setDishSelected} selected={dishSelected?.main_dishes.id} />
    </>
  );
};

export default AddDish;
