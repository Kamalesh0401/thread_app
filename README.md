# Scalable Twitter-like Mini Threading App

This is a scalable Twitter-like threading application that allows users to post threads, reply in real-time, like threads and replies, and manage notifications. The app is built using modern technologies and designed to handle high traffic with performance optimizations.

## Table of Contents
- [Objective](#objective)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [API Endpoints](#api-endpoints)
- [Installation](#installation)
- [Deployment](#deployment)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)

## Objective
Develop a scalable Twitter-like threading system where users can:
- Post text-based threads.
- Reply to threads in real time using WebSockets.
- View all threads and their replies.
- Implement authentication & authorization using JWT.
- Support pagination and caching for scalability.

## Tech Stack
- **Frontend**: React, CSS (using Material-UI or any other component library of choice).
- **Backend**: Node.js, Express.
- **Database**: MySQL with Sequelize ORM.
- **Real-Time Communication**: WebSockets.
- **Authentication**: JSON Web Tokens (JWT).
- **Caching & Performance**: Redis for session storage and rate limiting.

## Features

### 1. User Authentication & Profiles
- **JWT-based authentication** for secure API access.
- Users can register, log in, and view their profiles.
- **API Endpoints**:
  - `POST /auth/register` - Register a new user.
  - `POST /auth/login` - Authenticate a user.
  - `GET /users/:id` - Fetch user details.

### 2. Thread Management
- Users can create, view, and delete threads.
- Each thread contains content, like count, and associated user ID.
- **API Endpoints**:
  - `POST /threads` - Create a thread.
  - `GET /threads` - Fetch all threads (paginated).
  - `GET /threads/:id` - Get thread details.
  - `DELETE /threads/:id` - Delete a thread (only by the owner).

### 3. Reply System (WebSocket Integration)
- Users can reply to threads in real time.
- Replies are associated with threads and have content and timestamps.
- **API Endpoints**:
  - `POST /threads/:id/replies` - Add a reply to a thread.
  - `GET /threads/:id/replies` - Fetch all replies for a thread.
- **WebSocket Events**:
  - `newReply` - Broadcast new replies instantly.
  - `replyUpdated` - Notify users if a reply is edited.

### 4. Like & Engagement System
- Users can like/unlike threads and replies.
- Each like is tracked separately.
- **API Endpoints**:
  - `POST /threads/:id/like` - Like a thread.
  - `POST /replies/:id/like` - Like a reply.
  - `GET /threads/popular` - Fetch top-liked threads.
- Redis caching is used for popular threads.

### 5. Real-Time Notifications
- Users get notified when someone replies or mentions them.
- **API Endpoints**:
  - `GET /notifications` - Fetch user notifications.
  - `POST /notifications/read` - Mark notifications as read.
- **WebSocket Events**:
  - `newMention` - Notify users when mentioned in a reply.
  - `newNotification` - Notify users in real time.

### 6. Performance & Scalability Enhancements
- **Database Optimization**: Use efficient indexing and sharding.

## API Endpoints

### Authentication
- `POST /auth/register`: Register a new user.
- `POST /auth/login`: Login an existing user.

### Threads
- `POST /threads`: Create a new thread.
- `GET /threads`: Get all threads (paginated).
- `GET /threads/:id`: Get a specific thread.
- `DELETE /threads/:id`: Delete a thread.

### Replies
- `POST /threads/:id/replies`: Add a reply to a thread.
- `GET /threads/:id/replies`: Fetch all replies for a specific thread.

### Likes
- `POST /threads/:id/like`: Like a thread.
- `POST /replies/:id/like`: Like a reply.
- `GET /threads/popular`: Fetch popular threads based on likes.

### Notifications
- `GET /notifications`: Get notifications for the user.
- `POST /notifications/read`: Mark notifications as read.

### User
- `GET /users/:id`: Fetch user details.
- `GET /users/:id/threads`: Fetch thread based on user.

## Installation

### Prerequisites
- Node.js (v16 or higher)
- MySQL Database

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/Kamalesh0401/thread_app.git
   cd mini-threading-app
   ```
2. Navigate to the frontend folder and start the frontend server:
   ```bash
   cd frontend
   npm install
   npm start
   ```
3. Open a new terminal and navigate to the backend folder:
   ```bash
   cd backend
   npm install
   ```
4. Configure the `.env` file for database connection:
   ```env
   DB_SERVER="TESTDB"
   DB_NAME="thread_app"
   DB_USER="TEST@123"
   DB_PASSWORD="TEST@123"
   ```
   - Replace `TESTDB` with your MySQL server name.
   - Replace `thread_app` with your database name.
   - Replace `TEST@123` with your database username.
   - Replace `TEST1` with your database password.

5. Start the backend server using nodemon:
   ```bash
   nodemon server.js
   ```
6. The frontend should now be running at `http://localhost:3000/` and the backend at `http://localhost:5000/`.

## Deployment
-Using Netlify am hosting the frontend and link is `https://threadzone.netlify.app/`.

## Testing
- API testing can be done with Postman.


