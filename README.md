# Hotel Offer Orchestrator

## About the Project

This is a assignment project.

The main idea is to collect hotel offers from two different suppliers, compare their prices and return the best available offer for each hotel.

For example, if the same hotel is available from both suppliers, the system will select the supplier offering the lower price.

## Technologies Used

- Node.js
- TypeScript
- Express.js
- Temporal
- Redis
- Docker 

## Main Features

- Fetch hotel data from two mock suppliers.
- Call both suppliers in parallel.
- Remove duplicate hotel listings.
- Select the cheapest offer for each hotel.
- Store aggregated hotel data in Redis.
- Filter hotels using minimum and maximum prices.

## Project Status

Currently working 

## How to Run

Setup and execution instructions will be added after the application is implemented.

## Backend Architecture

I have divided the backend into different folders so that each part has its own responsibility.

- **Routes:** Define the API endpoints.
- **Controllers:** Handle incoming requests, validate input and send responses.
- **Services:** Contain the main business logic.
- **Types:** Define the structure of hotel data using TypeScript interfaces.


