import express from 'express';
import { simplePrint } from '../controllers/printerControllers.js';

const printRouter = express.Router();

printRouter.post('/', simplePrint);

export default printRouter;
