import express from 'express';
import { orderRoutes } from './order.routes.js';

export const app = express();

app.use(express.json());
app.use(orderRoutes);
