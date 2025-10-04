import { Request, Response } from 'express';

export class HealthController {
    public checkHealth(req: Request, res: Response): void {
        res.status(200).json({ status: 'UP' });
    }
}