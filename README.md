# XONET — AI-Powered Freelance Marketplace

Modern freelance marketplace that connects clients and freelancers through project management, task tracking, and AI-powered workflow automation.

## Preview

<p align="center">
  <img src="https://github.com/user-attachments/assets/74552f15-e7aa-47a3-84b3-a2611a2d2d3b" width="48%" />
  <img src="https://github.com/user-attachments/assets/94cb7c34-14c4-45c5-aa53-5c5ab67b2a17" width="48%" />
</p>

<p align="center">
  <img src="https://github.com/user-attachments/assets/b0ebc494-ba0e-479c-8da9-45c7199ce38d" width="48%" />
  <img src="https://github.com/user-attachments/assets/614c70b6-60e9-427c-a827-ea3fb8915fc9" width="48%" />
</p>

<p align="center">
  <img src="https://github.com/user-attachments/assets/03a3765a-b27b-4473-8a0e-5ec6ea1e0498" width="75%" />
</p>

---

## Tech Stack

### Frontend

* Next.js
* React.js
* Tailwind CSS
* shadcn/ui

### Backend

* Node.js
* Express.js
* JWT Authentication

### Database

* MongoDB Atlas
* Mongoose

---

## Project Structure

```text
xonet/
├── frontend/
│   ├── app/
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   └── public/
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   └── db/
│   └── scripts/
│
└── package.json
```

---

## Environment Variables

### Backend

```env
PORT=4000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

### Frontend

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

---

## Installation

```bash
git clone <repository-url>
cd xonet
npm install
```

---

## Run the Application

```bash
npm run dev
```

| Service  | URL                   |
| -------- | --------------------- |
| Frontend | http://localhost:3000 |
| Backend  | http://localhost:4000 |

---

## Author

**Darsan Viswanathan**
