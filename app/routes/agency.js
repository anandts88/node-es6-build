import express from 'express';
import agencyCtrl from '../controllers/agency';

const router = express.Router();

router.route('/')
  .post(agencyCtrl.post);

export default router;
