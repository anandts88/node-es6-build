import express from 'express';
import userCtrl from '../controllers/user';

const router = express.Router();

router.route('/')
  .post(userCtrl.post);

export default router;
