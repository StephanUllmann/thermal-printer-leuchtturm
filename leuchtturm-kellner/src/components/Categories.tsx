import type { Dish } from '../types';
import DishSelect from './DishSelect';

const Categories = ({
  category,
  dishes,
  selection,
  changeSelection,
}: {
  category: string;
  dishes: Dish[];
  selection: null | Record<string, number>;
  changeSelection: (name: string, operation: 'inc' | 'dec') => void;
}) => {
  return (
    <section className='group w-[70vw]'>
      <h2>{category}</h2>
      <ul className='list bg-base-100 rounded-box shadow-md'>
        {dishes?.map((dish) => (
          <DishSelect
            key={dish.main_dishes.title}
            dish={dish}
            selection={selection}
            changeSelection={changeSelection}
          />
        ))}
      </ul>
      <div className='group-last:hidden divider'></div>
    </section>
  );
};

export default Categories;
