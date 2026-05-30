# XONET — AI-Powered Freelance Marketplace

Modern freelance marketplace that intelligently connects clients and freelancers through streamlined task management, project tracking, and AI-driven workflow management.

## Project Structure

```text
xonet/
├── frontend/                  # Next.js Frontend
│   ├── app/                   # App Router pages
│   ├── components/            # Reusable UI components
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                   # Utilities & API clients
│   └── public/
│
├── backend/                   # Express Backend
│   ├── src/
│   │   ├── controllers/       # Request handlers
│   │   ├── routes/            # API routes
│   │   ├── models/            # Mongoose models
│   │   ├── middleware/        # Auth & validation
│   │   ├── services/          # Business logic
│   │   └── db/                # Database configuration
│   │
│   └── scripts/
│
└── package.json
```

## Features

* Secure Authentication (JWT)
* Client & Freelancer Workflows
* Task Creation & Management
* Freelancer Applications
* Project Assignment System
* Profile Management
* Skills & Experience Tracking
* MongoDB Atlas Integration
* Responsive Dashboard UI
* Modern Dark Professional Design

## Tech Stack

### Frontend

* Next.js
* React.js
* Tailwind CSS
* shadcn/ui
* Lucide React

### Backend

* Node.js
* Express.js
* JWT Authentication
* REST APIs

### Database

* MongoDB Atlas
* Mongoose

## Quick Start

### Install Dependencies

```bash
npm install
```

### Configure Environment

Backend:

```env
PORT=4000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Frontend:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

### Run Application

```bash
npm run dev
```

Frontend:

```text
http://localhost:3000
```

Backend:

```text
http://localhost:4000
```

## Available Scripts

| Command              | Description               |
| -------------------- | ------------------------- |
| npm run dev          | Run frontend and backend  |
| npm run dev:frontend | Run Next.js frontend      |
| npm run dev:backend  | Run Express backend       |
| npm run build        | Build production frontend |
| npm run start        | Start production build    |

## Core Modules

### Authentication

* User Registration
* User Login
* JWT Authorization
* Protected Routes

### Tasks

* Create Tasks
* Edit Tasks
* Manage Deadlines
* Assign Freelancers
* Track Progress

### Freelancer Portal

* Explore Projects
* Submit Applications
* Manage Assigned Work

### Profile Management

* Skills Management
* Experience Tracking
* Portfolio Links
* Availability Status

## Future Enhancements

* AI Job Matching
* Smart Proposal Generation
* Resume Analysis
* Payment Gateway Integration
* Analytics Dashboard
* Recommendation Engine

## Author

**Darsan Viswanathan**

Built to simplify freelancer-client collaboration through a scalable, modern, and intelligent project management ecosystem.
