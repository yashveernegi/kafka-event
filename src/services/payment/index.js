// Payment service
import { connectProducer } from '../../shared/kafka/producer.js';
import { startPaymentEvents } from './payment.events.js';

async function start() {
  await connectProducer();
  await startPaymentEvents();

  console.log('Payment service is waiting for events...');
}

start();
