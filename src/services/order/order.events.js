// Listens to the downstream events and updates the order status
import { startConsumer } from '../../shared/kafka/consumer.js';
import { TOPICS } from '../../shared/kafka/topics.js';
import { updateStatus } from './order.service.js';
import { ORDER_STATUS } from './order.constants.js';

const STATUS_BY_TOPIC = {
  [TOPICS.INVENTORY_UPDATED]: ORDER_STATUS.INVENTORY_UPDATED,
  [TOPICS.PAYMENT_CONFIRMED]: ORDER_STATUS.PAID,
  [TOPICS.USER_NOTIFIED]: ORDER_STATUS.COMPLETED,
};

export function startOrderEvents() {
  return startConsumer({
    groupId: 'order-service',
    topics: Object.keys(STATUS_BY_TOPIC),
    onMessage: async (event, topic) => updateStatus(event.orderId, STATUS_BY_TOPIC[topic]),
  });
}
