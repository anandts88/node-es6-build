import express from 'express';
import sessionCtrl from '../controllers/session';
import authenticationCtrl from '../controllers/authentication';

const router = express.Router();

router.route('/')
  .post(sessionCtrl.login)
  .delete(authenticationCtrl.authenticate, sessionCtrl.logout);

export default router;
