import { Router, Response } from 'express';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { authMiddleware, AuthRequest } from '../middleware/auth.middleware';

const prisma = new PrismaClient();
export const measurementRouter = Router();

measurementRouter.use(authMiddleware);

const MeasurementSchema = z.object({
  customerId: z.string().cuid(),
  chest: z.number().positive().optional(),
  waist: z.number().positive().optional(),
  hips: z.number().positive().optional(),
  shoulders: z.number().positive().optional(),
  sleeveLength: z.number().positive().optional(),
  inseam: z.number().positive().optional(),
  height: z.number().positive().optional(),
  weight: z.number().positive().optional(),
  notes: z.string().optional(),
});

measurementRouter.get('/:customerId', async (req: AuthRequest, res: Response) => {
  const measurement = await prisma.measurement.findUnique({
    where: { customerId: req.params.customerId },
  });
  if (!measurement) {
    res.status(404).json({ error: 'Measurements not found for this customer' });
    return;
  }
  res.json(measurement);
});

measurementRouter.post('/', async (req: AuthRequest, res: Response) => {
  const parsed = MeasurementSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const measurement = await prisma.measurement.upsert({
    where: { customerId: parsed.data.customerId },
    update: parsed.data,
    create: parsed.data,
  });
  res.status(201).json(measurement);
});

measurementRouter.put('/:id', async (req: AuthRequest, res: Response) => {
  const parsed = MeasurementSchema.partial().safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  try {
    const measurement = await prisma.measurement.update({
      where: { id: req.params.id },
      data: parsed.data,
    });
    res.json(measurement);
  } catch {
    res.status(404).json({ error: 'Measurement record not found' });
  }
});
