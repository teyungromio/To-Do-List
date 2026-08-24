# TaskFlow - Full-Stack To-Do List Assignment

A complete React + Express + MongoDB + JWT application.

## Requirements covered

- JWT login and registration
- Bearer token attached to protected API requests
- Protected dashboard route
- Create, read, update and delete tasks
- Toggle task completion
- MongoDB persistence
- User-specific task ownership
- Client and server validation
- Loading skeletons
- Non-breaking error/success notifications
- REST endpoints using GET, POST, PUT/PATCH and DELETE
- Secure password hashing with bcrypt
- Helmet and CORS
- Environment variable configuration
- Clean frontend/backend separation

## Folder structure

```text
todo-fullstack-complete/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── services/
│   ├── .env.example
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
└── README.md
```

## 1. MongoDB Atlas

Create a MongoDB Atlas cluster and database user.

Make sure your current IP is allowed in Atlas Network Access.

Copy the connection string.

## 2. Backend environment

Inside `backend`, copy `.env.example` to `.env`.

Set:

```env
PORT=5000
MONGO_URI=mongodb+srv://USERNAME:PASSWORD@CLUSTER.mongodb.net/todoapp?retryWrites=true&w=majority
JWT_SECRET=use_a_long_random_secret_here
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

Never commit `.env`.

## 3. Frontend environment

Inside `frontend`, copy `.env.example` to `.env`.

```env
VITE_API_URL=http://localhost:5000/api
```

## 4. Install and run

Open VS Code at the project root.

### Terminal 1

```bash
cd backend
npm install
npm run dev
```

Expected output:

```text
MongoDB connected: ...
Server running on http://localhost:5000
```

### Terminal 2

```bash
cd frontend
npm install
npm run dev
```

Open:

```text
http://localhost:5173
```

## API endpoints

### Authentication

```text
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

### Tasks

```text
GET    /api/tasks
POST   /api/tasks
PUT    /api/tasks/:id
PATCH  /api/tasks/:id
DELETE /api/tasks/:id
```

Protected endpoints require:

```text
Authorization: Bearer <JWT>
```

## Important security note

The JWT is stored in React memory rather than localStorage. This prevents the token from being persisted in browser storage. A production deployment can further improve this architecture by using Secure, HttpOnly cookies for refresh/session tokens.

## CRUD synchronization

The frontend only changes its task array after the API operation succeeds. In particular, DELETE waits for a successful server response before removing the task from React state.

## Submission

For GitHub:

```bash
git init
git add .
git commit -m "Complete full-stack To-Do application"
git branch -M main
git remote add origin YOUR_GITHUB_REPOSITORY
git push -u origin main
```

Do not commit `.env`.
