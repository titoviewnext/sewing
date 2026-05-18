import { Router, Response } from 'express';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { authMiddleware, AuthRequest } from '../middleware/auth.middleware';

const prisma = new PrismaClient();
export const invoiceRouter = Router();

invoiceRouter.use(authMiddleware);

const InvoiceStatusEnum = z.enum(['DRAFT', 'SENT', 'PAID', 'OVERDUE']);

const InvoiceSchema = z.object({
  customerId: z.string().cuid(),
  orderId: z.string().cuid().optional(),
  status: InvoiceStatusEnum.optional().default('DRAFT'),
  amount: z.number().positive(),
  dueDate: z.string().datetime().optional(),
  notes: z.string().optional(),
});

invoiceRouter.get('/', async (_req: AuthRequest, res: Response) => {
  const invoices = await prisma.invoice.findMany({
    include: {
      customer: { select: { id: true, name: true } },
      order: { select: { id: true, description: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
  res.json(invoices);
});

invoiceRouter.post('/', async (req: AuthRequest, res: Response) => {
  const parsed = InvoiceSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const { dueDate, ...rest } = parsed.data;
  const invoice = await prisma.invoice.create({
    data: {
      ...rest,
      dueDate: dueDate ? new Date(dueDate) : undefined,
    },
    include: {
      customer: { select: { id: true, name: true } },
      order: { select: { id: true, description: true } },
    },
  });
  res.status(201).json(invoice);
});

invoiceRouter.get('/:id', async (req: AuthRequest, res: Response) => {
  const invoice = await prisma.invoice.findUnique({
    where: { id: req.params.id },
    include: {
      customer: { select: { id: true, name: true } },
      order: { select: { id: true, description: true } },
    },
  });
  if (!invoice) {
    res.status(404).json({ error: 'Invoice not found' });
    return;
  }
  res.json(invoice);
});

invoiceRouter.put('/:id', async (req: AuthRequest, res: Response) => {
  const parsed = InvoiceSchema.partial().safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  try {
    const { dueDate, ...rest } = parsed.data;
    const invoice = await prisma.invoice.update({
      where: { id: req.params.id },
      data: {
        ...rest,
        dueDate: dueDate ? new Date(dueDate) : undefined,
      },
      include: {
        customer: { select: { id: true, name: true } },
        order: { select: { id: true, description: true } },
      },
    });
    res.json(invoice);
  } catch {
    res.status(404).json({ error: 'Invoice not found' });
  }
});

invoiceRouter.delete('/:id', async (req: AuthRequest, res: Response) => {
  try {
    await prisma.invoice.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch {
    res.status(404).json({ error: 'Invoice not found' });
  }
});
