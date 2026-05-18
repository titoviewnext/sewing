import { Router, Response } from 'express';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { authMiddleware, AuthRequest } from '../middleware/auth.middleware';

const prisma = new PrismaClient();
export const customerRouter = Router();

customerRouter.use(authMiddleware);

const CustomerSchema = z.object({
  name: z.string().min(1),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  notes: z.string().optional(),
});

customerRouter.get('/', async (_req: AuthRequest, res: Response) => {
  const customers = await prisma.customer.findMany({ orderBy: { createdAt: 'desc' } });
  res.json(customers);
});

customerRouter.post('/', async (req: AuthRequest, res: Response) => {
  const parsed = CustomerSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const customer = await prisma.customer.create({ data: parsed.data });
  res.status(201).json(customer);
});

customerRouter.get('/:id', async (req: AuthRequest, res: Response) => {
  const customer = await prisma.customer.findUnique({ where: { id: req.params.id } });
  if (!customer) {
    res.status(404).json({ error: 'Customer not found' });
    return;
  }
  res.json(customer);
});

customerRouter.put('/:id', async (req: AuthRequest, res: Response) => {
  const parsed = CustomerSchema.partial().safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  try {
    const customer = await prisma.customer.update({
      where: { id: req.params.id },
      data: parsed.data,
    });
    res.json(customer);
  } catch {
    res.status(404).json({ error: 'Customer not found' });
  }
});

customerRouter.delete('/:id', async (req: AuthRequest, res: Response) => {
  try {
    await prisma.customer.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch {
    res.status(404).json({ error: 'Customer not found' });
  }
});
