import { Router } from 'express';
import { authRouter } from '../agents/auth.agent';
import { customerRouter } from '../agents/customer.agent';
import { orderRouter } from '../agents/order.agent';
import { measurementRouter } from '../agents/measurement.agent';
import { inventoryRouter } from '../agents/inventory.agent';
import { appointmentRouter } from '../agents/appointment.agent';
import { invoiceRouter } from '../agents/invoice.agent';
import { apiRateLimiter, authRateLimiter } from '../middleware/rate-limit.middleware';

export const router = Router();

router.use('/auth', authRateLimiter, authRouter);
router.use('/customers', apiRateLimiter, customerRouter);
router.use('/orders', apiRateLimiter, orderRouter);
router.use('/measurements', apiRateLimiter, measurementRouter);
router.use('/inventory', apiRateLimiter, inventoryRouter);
router.use('/appointments', apiRateLimiter, appointmentRouter);
router.use('/invoices', apiRateLimiter, invoiceRouter);
