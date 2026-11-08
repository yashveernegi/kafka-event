import { Router } from 'express';
import { createOrderHandler, getOrderHandler } from './order.controller.js';

export const orderRoutes = Router();

orderRoutes.post('/orders', createOrderHandler);
orderRoutes.get('/orders/:id', getOrderHandler);
