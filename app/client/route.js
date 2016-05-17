import express from 'express';
import validation from './validation';
import controller from './controller';

const router = express.Router();

router.route('/')
  .post(validation.post, controller.post)
  .get(controller.get);

router.route('/:id')
  .put(controller.put)
  .delete(controller.remove)

export default router;
