// Listens: order-placed  ->  reduces stock  ->  sends: inventory-updated
import { startConsumer } from '../../shared/kafka/consumer.js';
import { sendEvent } from '../../shared/kafka/producer.js';
import { TOPICS } from '../../shared/kafka/topics.js';
import { reduceStock } from './inventory.service.js';

async function onOrderPlaced(order) {
  console.log('Received order-placed', order);

  reduceStock(order.productId, order.quantity);

  await sendEvent(TOPICS.INVENTORY_UPDATED, order);
}

export function startInventoryEvents() {
  return startConsumer({
    groupId: 'inventory-service',
    topics: [TOPICS.ORDER_PLACED],
    onMessage: onOrderPlaced,
  });
}
