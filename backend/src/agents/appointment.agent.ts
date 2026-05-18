import { Router, Response } from 'express';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { authMiddleware, AuthRequest } from '../middleware/auth.middleware';

const prisma = new PrismaClient();
export const appointmentRouter = Router();

appointmentRouter.use(authMiddleware);

const AppointmentStatusEnum = z.enum(['SCHEDULED', 'CONFIRMED', 'COMPLETED', 'CANCELLED']);

const AppointmentSchema = z.object({
  customerId: z.string().cuid(),
  scheduledAt: z.string().datetime(),
  duration: z.number().int().positive().optional(),
  status: AppointmentStatusEnum.optional().default('SCHEDULED'),
  purpose: z.string().min(1),
  notes: z.string().optional(),
});

appointmentRouter.get('/', async (_req: AuthRequest, res: Response) => {
  const appointments = await prisma.appointment.findMany({
    include: { customer: { select: { id: true, name: true } } },
    orderBy: { scheduledAt: 'asc' },
  });
  res.json(appointments);
});

appointmentRouter.post('/', async (req: AuthRequest, res: Response) => {
  const parsed = AppointmentSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const { scheduledAt, ...rest } = parsed.data;
  const appointment = await prisma.appointment.create({
    data: { ...rest, scheduledAt: new Date(scheduledAt) },
    include: { customer: { select: { id: true, name: true } } },
  });
  res.status(201).json(appointment);
});

appointmentRouter.get('/:id', async (req: AuthRequest, res: Response) => {
  const appointment = await prisma.appointment.findUnique({
    where: { id: req.params.id },
    include: { customer: { select: { id: true, name: true } } },
  });
  if (!appointment) {
    res.status(404).json({ error: 'Appointment not found' });
    return;
  }
  res.json(appointment);
});

appointmentRouter.put('/:id', async (req: AuthRequest, res: Response) => {
  const parsed = AppointmentSchema.partial().safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  try {
    const { scheduledAt, ...rest } = parsed.data;
    const appointment = await prisma.appointment.update({
      where: { id: req.params.id },
      data: {
        ...rest,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : undefined,
      },
      include: { customer: { select: { id: true, name: true } } },
    });
    res.json(appointment);
  } catch {
    res.status(404).json({ error: 'Appointment not found' });
  }
});

appointmentRouter.delete('/:id', async (req: AuthRequest, res: Response) => {
  try {
    await prisma.appointment.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch {
    res.status(404).json({ error: 'Appointment not found' });
  }
});
