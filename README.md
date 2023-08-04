# MyContacts

API developed in Express and PostgreSQL to store names and emails.

## How to run

Install Docker.

In the project directory:

### `docker-compose -f docker-compose.yml up -d`

Starts the docker compose to initialize the database server.

### `npm run dev`

Starts the Express server to initialize the API server.

Check the API using Postman or Thunder Client. It should work.

Since Docker Volume is also implemented, data should persist between each docker run.

### `docker-compose -f docker-compose.yml down`

To stop the docker compose and database server.

## Notes for Concurrency

### Easiest way to make the server process the concurrent requests is to use connctection pool.

    ```
    pool : {
    	max : 100,
    	min : 0,
    	acquire: 10000,
    	idle: 5000,
    }
    ```

### Transactions

    If the server is concurrent, implementing Transactions ensures that there is no race condition and conflict while accessing and modifying the database.
