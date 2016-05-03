import express from 'express';
import clientCtrl from '../controllers/client';

const router = express.Router();

router.route('/')
  .post(clientCtrl.post);

export default router;
