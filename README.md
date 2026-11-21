# Hotel Offer Orchestrator

## About the Project

Hotel Offer Orchestrator is a backend application built using Node.js, TypeScript, Express, Temporal, and Redis.

The main purpose of this project is to collect hotel offers from two different suppliers, compare their prices, remove duplicate hotels, and return the best available offer for each hotel.

The application also supports price filtering and handles supplier failures so that one unavailable supplier does not stop the entire process.

## Tech Stack

- **Node.js** – JavaScript runtime
- **TypeScript** – Type-safe development
- **Express.js** – REST API
- **Temporal** – Workflow orchestration
- **Redis** – Hotel offer storage and price filtering
- **Docker** – Containerization
- **Docker Compose** – Running all services together
- **Postman** – API testing

## How It Works

1. The user sends a request with a city name.
2. The Express API starts a Temporal workflow.
3. Temporal calls Supplier A and Supplier B in parallel.
4. Both suppliers return their hotel data.
5. The workflow combines the results.
6. Duplicate hotels are identified using their names.
7. If both suppliers offer the same hotel, the cheaper offer is selected.
8. The final deduplicated results are saved in Redis.
9. If a price range is provided, Redis filters the hotels using their prices.
10. The API returns the final response.

## Supplier Failure Handling

The application also handles supplier failures.

- If both suppliers work, their results are combined.
- If one supplier fails, the workflow continues using the other supplier's results.
- If both suppliers fail, the application returns HTTP `503 Service Unavailable`.
- If a supplier successfully returns an empty list, the workflow continues normally.

Temporal activity retries are configured with a maximum of 3 attempts.

## API Endpoints

### Main API

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/hotels?city=delhi` | Get the best hotel offers for a city |
| GET | `/api/hotels?city=delhi&minPrice=5000&maxPrice=8000` | Filter hotels by price |
| GET | `/` | Welcome message |
| GET | `/health` | Checks application and both supplier health statuses. |
| GET | `/health/suppliers` | Check both supplier endpoints |

### Mock Supplier APIs

| Method | Endpoint | Description |
|---|---|---|
| GET | `/supplierA/hotels?city=delhi` | Get Supplier A hotel data |
| GET | `/supplierB/hotels?city=delhi` | Get Supplier B hotel data |

## Example API Response

Request:

`GET /api/hotels?city=delhi`

Example response:

```json
[
  {
    "name": "Holtin",
    "price": 5340,
    "supplier": "Supplier B",
    "commissionPct": 20
  },
  {
    "name": "Radison",
    "price": 5900,
    "supplier": "Supplier A",
    "commissionPct": 13
  }
]
```

The response contains the best available offer for each hotel.

## Redis Implementation

Redis is used to store the deduplicated hotel offers.

Each city's hotel data is stored using a key in this format:

`hotels:delhi`

A Redis Sorted Set is used for storing hotel offers.

- The hotel price is stored as the score.
- The hotel details are stored as JSON.
- `ZRANGEBYSCORE` is used to filter hotels within a requested price range.

This allows price filtering to happen directly inside Redis.

## Temporal Workflow

The Temporal workflow is responsible for coordinating both supplier requests.

Both supplier activities run in parallel using `Promise.allSettled()`.

This allows the workflow to continue even if one supplier fails.

Activity retry configuration:

- Initial retry interval: 1 second
- Maximum retry interval: 10 seconds
- Backoff coefficient: 2
- Maximum attempts: 3

If both suppliers fail, the workflow reports a typed application failure.

## Project Structure

```text
hotel-offer-orchestrator/
│
├── src/
│   ├── activities/
│   │   └── hotelActivities.ts
│   │
│   ├── config/
│   │   └── redis.ts
│   │
│   ├── controllers/
│   │   └── hotelController.ts
│   │
│   ├── errors/
│   │   └── SuppliersUnavailableError.ts
│   │
│   ├── routes/
│   │   ├── hotelRoutes.ts
│   │   └── supplierRoutes.ts
│   │
│   ├── services/
│   │   ├── hotelService.ts
│   │   └── redisHotelService.ts
│   │
│   ├── suppliers/
│   │   ├── suppliersA.ts
│   │   └── suppliersB.ts
│   │
│   ├── temporal/
│   │   ├── client.ts
│   │   └── worker.ts
│   │
│   ├── types/
│   │   └── hotel.ts
│   │
│   ├── workflows/
│   │   └── hotelWorkflow.ts
│   │
│   └── server.ts
│
├── Hotel-Offer-Orchestrator.postman_collection.json
├── Dockerfile
├── docker-compose.yml
├── .dockerignore
├── .gitignore
├── package.json
├── package-lock.json
├── tsconfig.json
└── README.md
```

## Running the Project

### Prerequisites

- Node.js
- npm
- Docker Desktop
- Postman (optional, for API testing)

### Run using Docker Compose

Clone the repository:

```bash
git clone https://github.com/pranjal3844/hotel-offer-orchestrator.git
cd hotel-offer-orchestrator
```

Start all services:

```bash
docker compose up --build -d
```

Check running containers:

```bash
docker compose ps
```

View application logs:

```bash
docker compose logs -f
```

Stop all services:

```bash
docker compose down
```

### Local development

Install dependencies:

```bash
npm install
```

Build the TypeScript project:

```bash
npm run build
```

Start the development server:

```bash
npm run dev
```

Run the Temporal worker separately:

```bash
npm run worker
```

For local development, Redis and Temporal must also be running and accessible using the environment settings.

## Environment Variables

The application uses the following environment variables:

| Variable | Description |
|---|---|
| `PORT` | Express server port |
| `REDIS_HOST` | Redis hostname |
| `REDIS_PORT` | Redis port |
| `TEMPORAL_ADDRESS` | Temporal server address |
| `TEMPORAL_NAMESPACE` | Temporal namespace |
| `HOTEL_TASK_QUEUE` | Temporal task queue |
| `SUPPLIER_API_URL` | Base URL used by supplier activities |

Docker Compose provides the internal service addresses when running the complete application.

## API Testing

A Postman collection is included in the repository:

`Hotel-Offer-Orchestrator.postman_collection.json`

It covers:

1. Fetch hotels for Delhi.
2. Filter hotels by price.
3. Search for a city with no results.
4. Request without a city.
5. Invalid price values.
6. Missing price parameters.
7. Invalid price range.

The collection also includes response assertions.

## Future Improvements

- Connect real hotel supplier APIs.
- Add authentication and authorization.
- Add more advanced hotel ranking options.
- Improve monitoring and structured logging.
- Add automated integration tests.

## Author

Built as a backend engineering project to explore API development, workflow orchestration, caching, database operations, and containerization.
