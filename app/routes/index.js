import express from 'express';
import sessionRoute from './session';
import clientRoute from '../client/route';
import agencyRoute from '../agency/route';
import winston from '../config/winston';

const router = express.Router();

winston.info('In Routers');
/** GET /health-check - Check service health */
router.get('/health-check', (req, res) => res.send('OK'));

router.use('/session', sessionRoute);
router.use('/clients', clientRoute);
router.use('/agencies', agencyRoute);

export default router;
