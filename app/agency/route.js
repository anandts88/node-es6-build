import express from 'express';
import validation from './validation';
import controller from './controller';

const router = express.Router();

router.route('/')
  .post(validation.post, controller.post);

router.route('/:id')
  .put(validation.put, controller.put);

export default router;
