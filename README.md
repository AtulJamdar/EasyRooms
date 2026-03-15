# Roommate Platform

A student room and roommate finding platform built with the MERN stack.

## Project Structure

This repo follows a standard **MERN** architecture with a separate frontend and backend.

- `client/` - React frontend
- `server/` - Express backend

## Folder Overview

- `client/src/components` - Reusable UI components
- `client/src/pages` - Route pages
- `client/src/hooks` - Reusable React hooks
- `client/src/services` - API service clients (Axios)
- `client/src/context` - React context providers
- `client/src/utils` - Utility functions/helpers

- `server/config` - Configuration (DB, environment)
- `server/controllers` - Express route controllers
- `server/middleware` - Express middleware (auth, validation, security)
- `server/models` - Mongoose models
- `server/routes` - Express route definitions
- `server/services` - Business logic and services
- `server/server.js` - Entry point for the backend server

## Running the Backend Server

1. Copy `.env.example` to `.env` and fill in your MongoDB connection string and JWT secret.
2. In a terminal, run:

```bash
cd server
npm install
npm run dev
```

3. The backend will start on the port from `.env` (default: `5000`).

You can verify the server is running by visiting:

```
http://localhost:5000/api/health
```

## Running the Frontend (React)

From a new terminal, start the frontend dev server:

```bash
cd client
npm install
npm run dev
```

Then open:

```
http://localhost:3000
```

The frontend will authenticate against the backend (default: `http://localhost:5000`).

## Next Steps

1. Setup backend environment and dependencies.
2. Define database models.
3. Implement authentication and room posting APIs.
