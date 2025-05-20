type InsertDish = {
  title: string;
  image: string;
  id?: number;
};
type InsertVariant = {
  title: string;
  id?: number;
  mainDishId?: number;
};
type InsertCategory = {
  name: string;
  id?: number;
};

type Dish = {
  main_dishes: InsertDish;
  categories: InsertCategory;
  variants: InsertVariant | null;
};

export type { InsertDish, InsertVariant, InsertCategory, Dish };
