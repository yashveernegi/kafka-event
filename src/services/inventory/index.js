// Inventory service
import { connectProducer } from '../../shared/kafka/producer.js';
import { startInventoryEvents } from './inventory.events.js';

async function start() {
  await connectProducer();
  await startInventoryEvents();

  console.log('Inventory service is waiting for orders...');
}

start();
