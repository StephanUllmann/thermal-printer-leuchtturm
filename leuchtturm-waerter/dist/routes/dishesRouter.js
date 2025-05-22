import express from 'express';
import { getAllDishes, createDish, createVariant, deleteVariant, getCategories, createCategory, updateDish, deleteDish, } from '../controllers/dishesControllers.js';
import upload from '../middlewares/upload.js';
const dishesRouter = express.Router();
dishesRouter.get('/', getAllDishes);
dishesRouter.post('/', upload.single('image'), createDish);
dishesRouter.put('/:dishId', upload.single('image'), updateDish);
dishesRouter.delete('/:dishId', deleteDish);
dishesRouter.post('/:dishId/variants', createVariant);
dishesRouter.delete('/:dishId/variants/:variantsId', deleteVariant);
dishesRouter.get('/categories', getCategories);
dishesRouter.post('/categories', createCategory);
export default dishesRouter;
//# sourceMappingURL=dishesRouter.js.map