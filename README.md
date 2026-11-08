# Kafka order events (simple Node.js sample)

![Order flow](docs/order-flow.png)

```
POST /orders
   │
   ▼
order-api ──order-placed──► inventory ──inventory-updated──► payment ──payment-confirmed──► notification ──user-notified
   ▲                                          │                               │                                  │
   └──────────────── order-api listens to these and updates the order status ─┴──────────────────────────────────┘
```

Order status: `PLACED → INVENTORY_UPDATED → PAID → COMPLETED`

## Project structure

```
src/
├── config/
│   └── index.js                   Settings from env vars (KAFKA_BROKERS, KAFKA_CLIENT_ID, PORT)
├── shared/kafka/                  Kafka code used by every service
│   ├── client.js                  Kafka connection
│   ├── topics.js                  Topic names
│   ├── producer.js                connectProducer(), sendEvent(topic, data)
│   └── consumer.js                startConsumer({ groupId, topics, onMessage })
├── services/
│   ├── order/
│   │   ├── index.js               Entry point: producer + consumer + HTTP server
│   │   ├── app.js                 Express app
│   │   ├── order.routes.js        POST /orders, GET /orders/:id
│   │   ├── order.controller.js    HTTP request → service call → response
│   │   ├── order.service.js       placeOrder, getOrder, updateStatus
│   │   ├── order.repository.js    In-memory order storage
│   │   ├── order.events.js        Listens to downstream events, updates status
│   │   └── order.constants.js     Order statuses
│   ├── inventory/
│   │   ├── index.js               Entry point
│   │   ├── inventory.events.js    order-placed → reduce stock → inventory-updated
│   │   └── inventory.service.js   Stock data and reduceStock()
│   ├── payment/
│   │   ├── index.js
│   │   ├── payment.events.js      inventory-updated → charge → payment-confirmed
│   │   └── payment.service.js     chargeCustomer()
│   └── notification/
│       ├── index.js
│       ├── notification.events.js payment-confirmed → email → user-notified
│       └── notification.service.js notifyUser()
└── scripts/
    └── create-topics.js           Creates the 4 topics (3 partitions each)
```

Each service keeps Kafka code (`*.events.js`) separate from business logic (`*.service.js`), so the logic can be changed or tested without touching Kafka.

Other files: `Dockerfile` (one image for all services), `docker-compose.yml` (Kafka + all services), `.env.example` (environment variables), `flow.md` (step-by-step walkthrough).

## Run everything in parallel

Start Docker Desktop first.

**Option A: everything in Docker (closest to production)**

```powershell
docker compose up --build
```

Run 3 copies of the payment service (Kafka splits the work between them):

```powershell
docker compose up --build --scale payment=3
```

**Option B: Kafka in Docker, Node on your laptop (easiest for coding)**

```powershell
npm install
npm run kafka:up
npm run topics
npm run dev          # starts all 4 services in one terminal, color-coded logs
```

**Option C: separate servers**

Run each service on its own machine and point it at the Kafka cluster:

```powershell
$env:KAFKA_BROKERS = "10.0.1.11:9092,10.0.1.12:9092,10.0.1.13:9092"
npm run payment
```

## Try it

```powershell
$o = Invoke-RestMethod -Method Post -Uri http://localhost:3000/orders -ContentType 'application/json' -Body '{"userId":"u1","productId":"P100","quantity":2,"price":500}'
Start-Sleep 2
Invoke-RestMethod http://localhost:3000/orders/$($o.orderId)
```

Note: `order-api` keeps orders in memory, so run only one copy of it. With a real database you could scale it too.



## Run everything 
# Start Docker
```
docker compose up --build
```

# Place Order
```curl -X POST http://localhost:3000/orders \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "u1",
    "productId": "P100",
    "quantity": 2,
    "price": 500
  }'
```


# Check order status
```curl --location --request GET 'http://localhost:3000/orders/${Order Id}' \
--header 'Content-Type: application/json' \
--data '{
    "userId": "u1",
    "productId": "P100",
    "quantity": 2,
    "price": 500
  }'
```

# See the events stored in Kafka
```
docker compose exec kafka /opt/kafka/bin/kafka-console-consumer.sh --bootstrap-server kafka:19092 --topic order-placed --from-beginning --property print.key=true
```