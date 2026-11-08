// Order service
// 1. POST /orders saves the order and sends "order-placed"
// 2. Listens to the other events and updates the order status
import { config } from '../../config/index.js';
import { connectProducer } from '../../shared/kafka/producer.js';
import { startOrderEvents } from './order.events.js';
import { app } from './app.js';

async function start() {
  await connectProducer();
  await startOrderEvents();

  const { port } = config.orderService;
  app.listen(port, () => console.log(`Order API running on http://localhost:${port}`));
}

start();
