import { kafka } from '../shared/kafka/client.js';
import { TOPICS } from '../shared/kafka/topics.js';

async function run() {
  const admin = kafka.admin();
  await admin.connect();

  // 3 partitions per topic, so up to 3 copies of a service can share the work
  await admin.createTopics({
    topics: Object.values(TOPICS).map((topic) => ({ topic, numPartitions: 3 })),
  });

  console.log('Topics:', await admin.listTopics());
  await admin.disconnect();
}

run();
