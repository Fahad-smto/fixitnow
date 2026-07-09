import { Router } from 'express';
import * as serviceController from './service.controller';

const router = Router();

router.get('/', serviceController.getAllServices);

export default router;
