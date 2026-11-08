// Listens: inventory-updated  ->  charges the customer  ->  sends: payment-confirmed
import { startConsumer } from '../../shared/kafka/consumer.js';
import { sendEvent } from '../../shared/kafka/producer.js';
import { TOPICS } from '../../shared/kafka/topics.js';
import { chargeCustomer } from './payment.service.js';

async function onInventoryUpdated(order) {
  console.log('Received inventory-updated', order);

  const payment = chargeCustomer(order);

  await sendEvent(TOPICS.PAYMENT_CONFIRMED, payment);
}

export function startPaymentEvents() {
  return startConsumer({
    groupId: 'payment-service',
    topics: [TOPICS.INVENTORY_UPDATED],
    onMessage: onInventoryUpdated,
  });
}
