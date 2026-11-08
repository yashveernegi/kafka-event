import { Partitioners } from 'kafkajs';
import { kafka } from './client.js';

// One producer per service process
const producer = kafka.producer({ createPartitioner: Partitioners.DefaultPartitioner });

export async function connectProducer() {
  await producer.connect();
}

// Send one event to a topic. The orderId is the key, so all events
// for one order go to the same partition and stay in order.
export async function sendEvent(topic, data) {
  await producer.send({
    topic,
    messages: [{ key: data.orderId, value: JSON.stringify(data) }],
  });
  console.log(`Sent    ${topic}`, data);
}
