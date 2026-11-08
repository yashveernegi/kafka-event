// Listens: payment-confirmed  ->  notifies the user  ->  sends: user-notified
import { startConsumer } from '../../shared/kafka/consumer.js';
import { sendEvent } from '../../shared/kafka/producer.js';
import { TOPICS } from '../../shared/kafka/topics.js';
import { notifyUser } from './notification.service.js';

async function onPaymentConfirmed(order) {
  console.log('Received payment-confirmed', order);

  notifyUser(order);

  await sendEvent(TOPICS.USER_NOTIFIED, { orderId: order.orderId, userId: order.userId });
}

export function startNotificationEvents() {
  return startConsumer({
    groupId: 'notification-service',
    topics: [TOPICS.PAYMENT_CONFIRMED],
    onMessage: onPaymentConfirmed,
  });
}
