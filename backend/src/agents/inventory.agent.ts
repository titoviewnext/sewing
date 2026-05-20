import { Router, Response } from 'express';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { authMiddleware, AuthRequest } from '../middleware/auth.middleware';

const prisma = new PrismaClient();
export const inventoryRouter = Router();

inventoryRouter.use(authMiddleware);

const InventorySchema = z.object({
  name: z.string().min(1),
  category: z.string().min(1),
  quantity: z.number().int().nonnegative(),
  unit: z.string().min(1),
  costPerUnit: z.number().nonnegative().optional(),
  supplier: z.string().optional(),
  notes: z.string().optional(),
});

inventoryRouter.get('/', async (_req: AuthRequest, res: Response) => {
  const items = await prisma.inventoryItem.findMany({ orderBy: { name: 'asc' } });
  res.json(items);
});

inventoryRouter.post('/', async (req: AuthRequest, res: Response) => {
  const parsed = InventorySchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const item = await prisma.inventoryItem.create({ data: parsed.data });
  res.status(201).json(item);
});

inventoryRouter.get('/:id', async (req: AuthRequest, res: Response) => {
  const item = await prisma.inventoryItem.findUnique({ where: { id: req.params.id } });
  if (!item) {
    res.status(404).json({ error: 'Inventory item not found' });
    return;
  }
  res.json(item);
});

inventoryRouter.put('/:id', async (req: AuthRequest, res: Response) => {
  const parsed = InventorySchema.partial().safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  try {
    const item = await prisma.inventoryItem.update({
      where: { id: req.params.id },
      data: parsed.data,
    });
    res.json(item);
  } catch {
    res.status(404).json({ error: 'Inventory item not found' });
  }
});

inventoryRouter.delete('/:id', async (req: AuthRequest, res: Response) => {
  try {
    await prisma.inventoryItem.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch {
    res.status(404).json({ error: 'Inventory item not found' });
  }
});
