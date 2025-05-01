[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/mNaxAqQD)

# Countries Explorer Application

A full-stack web application to explore and save information about countries around the world. Built with React, Node.js, Express, and MongoDB.

## Features

- Browse countries from around the world
- View detailed information about each country
- Filter countries by region, population, area, language, etc.
- User authentication (register, login)
- Save favorite countries to your profile
- Responsive design for mobile and desktop

## Project Structure

```
countries-explorer/
├── backend/             # Node.js Express API
│   ├── src/             # Backend source code
│   │   ├── controllers/ # API controllers
│   │   ├── models/      # MongoDB schema models
│   │   ├── routes/      # API routes
│   │   ├── middleware/  # Middleware functions
│   │   └── server.js    # Entry point
│   └── .env             # Environment variables
├── src/                 # React frontend
│   ├── components/      # Reusable UI components
│   ├── context/         # React context providers
│   ├── pages/           # Page components
│   ├── services/        # API services
│   └── App.jsx          # Main app component
└── package.json         # Project configuration
```

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or Atlas account)
- Yarn package manager

## Getting Started

### Install Dependencies

```bash
# Install frontend dependencies
yarn install

# Install backend dependencies
yarn setup:backend
```

### Configure Environment Variables

Create a `.env` file in the backend directory with:

```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/countries-explorer
JWT_SECRET=your_secret_key_here
```

Replace `your_secret_key_here` with a secure random string.

### Running the Application

#### Development Mode (with hot-reloading)

To run both frontend and backend together:

```bash
yarn dev:full
```

Or run them separately:

```bash
# Frontend only (http://localhost:5173)
yarn dev

# Backend only (http://localhost:5000)
yarn dev:backend
```

#### Production Mode

Build and start the application:

```bash
# Build both frontend and backend
yarn build:full

# Start the backend server
yarn start

# In production, you would serve the build folder
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user
- `GET /api/auth/me` - Get current user data

### User Favorites

- `GET /api/users/favorites` - Get all user favorites
- `POST /api/users/favorites` - Add a country to favorites
- `DELETE /api/users/favorites/:countryCode` - Remove a country from favorites

### Countries

- `GET /api/countries` - Get all countries
- `GET /api/countries/code/:code` - Get a country by its alpha code
- `GET /api/countries/name/:name` - Get countries by name
- `GET /api/countries/region/:region` - Get countries by region

## Technological Stack

### Frontend

- React
- React Router
- Framer Motion
- TailwindCSS
- Axios

### Backend

- Node.js
- Express
- MongoDB with Mongoose
- JWT Authentication
- Bcrypt

## License

MIT
