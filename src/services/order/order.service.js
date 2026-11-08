import { sendEvent } from '../../shared/kafka/producer.js';
import { TOPICS } from '../../shared/kafka/topics.js';
import { orderRepository } from './order.repository.js';
import { ORDER_STATUS } from './order.constants.js';

export async function placeOrder({ userId, productId, quantity, price }) {
  const order = {
    orderId: Date.now().toString(),
    userId,
    productId,
    quantity,
    amount: quantity * price,
    status: ORDER_STATUS.PLACED,
  };
  orderRepository.save(order);

  await sendEvent(TOPICS.ORDER_PLACED, order);

  return order;
}

export function getOrder(orderId) {
  return orderRepository.findById(orderId);
}

export function updateStatus(orderId, status) {
  const order = orderRepository.findById(orderId);
  if (!order) return;

  order.status = status;
  console.log(`Order ${order.orderId} status -> ${order.status}`);
}
