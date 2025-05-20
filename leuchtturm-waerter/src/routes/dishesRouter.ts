import express from 'express';
import {
  getAllDishes,
  createDish,
  createVariant,
  deleteVariant,
  getCategories,
  createCategory,
} from '../controllers/dishesControllers.js';
import upload from '../middlewares/upload.js';

const dishesRouter = express.Router();

dishesRouter.get('/', getAllDishes);

dishesRouter.post('/', upload.single('image'), createDish);

dishesRouter.post('/:dishId/variants', createVariant);

dishesRouter.delete('/:dishId/variants/:variantsId', deleteVariant);

dishesRouter.get('/categories', getCategories);
dishesRouter.post('/categories', createCategory);

export default dishesRouter;
