// Notification service
import { connectProducer } from '../../shared/kafka/producer.js';
import { startNotificationEvents } from './notification.events.js';

async function start() {
  await connectProducer();
  await startNotificationEvents();

  console.log('Notification service is waiting for events...');
}

start();
