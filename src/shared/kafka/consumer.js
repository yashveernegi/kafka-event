import { kafka } from './client.js';

// Connects a consumer group, subscribes to the topics and calls
// onMessage(event, topic) for every message.
export async function startConsumer({ groupId, topics, onMessage }) {
  const consumer = kafka.consumer({ groupId });

  await consumer.connect();
  await consumer.subscribe({ topics });

  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      const event = JSON.parse(message.value.toString());
      await onMessage(event, topic);
    },
  });

  return consumer;
}
