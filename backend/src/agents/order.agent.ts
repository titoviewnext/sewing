import { Router, Response } from 'express';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { authMiddleware, AuthRequest } from '../middleware/auth.middleware';

const prisma = new PrismaClient();
export const orderRouter = Router();

orderRouter.use(authMiddleware);

const OrderStatusEnum = z.enum(['NEW', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']);

const OrderSchema = z.object({
  customerId: z.string().cuid(),
  description: z.string().min(1),
  status: OrderStatusEnum.optional().default('NEW'),
  dueDate: z.string().datetime().optional(),
  price: z.number().positive().optional(),
  notes: z.string().optional(),
});

orderRouter.get('/', async (_req: AuthRequest, res: Response) => {
  const orders = await prisma.order.findMany({
    include: { customer: { select: { id: true, name: true } } },
    orderBy: { createdAt: 'desc' },
  });
  res.json(orders);
});

orderRouter.post('/', async (req: AuthRequest, res: Response) => {
  const parsed = OrderSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const { dueDate, ...rest } = parsed.data;
  const order = await prisma.order.create({
    data: {
      ...rest,
      dueDate: dueDate ? new Date(dueDate) : undefined,
    },
    include: { customer: { select: { id: true, name: true } } },
  });
  res.status(201).json(order);
});

orderRouter.get('/:id', async (req: AuthRequest, res: Response) => {
  const order = await prisma.order.findUnique({
    where: { id: req.params.id },
    include: { customer: { select: { id: true, name: true } } },
  });
  if (!order) {
    res.status(404).json({ error: 'Order not found' });
    return;
  }
  res.json(order);
});

orderRouter.put('/:id', async (req: AuthRequest, res: Response) => {
  const parsed = OrderSchema.partial().safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  try {
    const { dueDate, ...rest } = parsed.data;
    const order = await prisma.order.update({
      where: { id: req.params.id },
      data: {
        ...rest,
        dueDate: dueDate ? new Date(dueDate) : undefined,
      },
      include: { customer: { select: { id: true, name: true } } },
    });
    res.json(order);
  } catch {
    res.status(404).json({ error: 'Order not found' });
  }
});

orderRouter.delete('/:id', async (req: AuthRequest, res: Response) => {
  try {
    await prisma.order.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch {
    res.status(404).json({ error: 'Order not found' });
  }
});
