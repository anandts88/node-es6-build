import express from 'express';
import sessionRoute from './session';
import userRoute from './user';
import clientRoute from './client';
import agencyRoute from './agency';
import winston from '../config/winston';

const router = express.Router();

winston.info('In Routers');
/** GET /health-check - Check service health */
router.get('/health-check', (req, res) => res.send('OK'));

router.use('/session', sessionRoute);
router.use('/users', userRoute);
router.use('/clients', clientRoute);
router.use('/agencies', agencyRoute);

export default router;
