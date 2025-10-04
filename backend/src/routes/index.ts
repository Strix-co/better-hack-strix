import { Router } from 'express';
import healthRoutes from './health.routes';

const router = Router();

export const setRoutes = (app: any) => {
    app.use('/api', router);
    router.get('/ping', (req, res) => {
        res.status(200).json({ message: 'pong', timestamp: new Date().toISOString() });
    });
    router.use('/health', healthRoutes);
};
