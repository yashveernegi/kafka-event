import { placeOrder, getOrder } from './order.service.js';

export async function createOrderHandler(req, res) {
  const order = await placeOrder(req.body);
  res.json(order);
}

export function getOrderHandler(req, res) {
  res.json(getOrder(req.params.id) || { error: 'Order not found' });
}
