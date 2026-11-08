// All settings come from environment variables, with defaults for local development.
//   KAFKA_BROKERS  your laptop:       localhost:9092 (default)
//                  docker compose:    kafka:19092
//                  separate servers:  10.0.1.11:9092,10.0.1.12:9092,10.0.1.13:9092
export const config = {
  kafka: {
    clientId: process.env.KAFKA_CLIENT_ID || 'shop',
    brokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(','),
  },
  orderService: {
    port: Number(process.env.PORT) || 3000,
  },
};
