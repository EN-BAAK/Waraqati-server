# Waraqati Backend

Waraqati is a modern platform designed to simplify requesting and managing government services.  
This repository contains the **Backend API**, responsible for handling business logic, data management, authentication, and communication with the frontend application.

---

## 📌 Overview

The backend powers the Waraqati platform by providing secure and scalable APIs for:

- Managing users (Clients, Employees, Admins)
- Handling service requests lifecycle
- Managing services, categories, questions, and required documents
- File uploads and storage
- Authentication and authorization

---

## 🛠️ Tech Stack

- **Node.js**
- **Express.js**
- **TypeScript**
- **MySQL**
- **Sequelize ORM**

---

## 🏗️ Architecture

The project follows a **modular and scalable architecture**, separating concerns into multiple layers:

- Controllers → Handle request/response
- Services → Business logic
- Models → Database structure (Sequelize)
- Routers → API endpoints
- Middlewares → Authentication, validation, error handling
- Utils → Helper functions

---

## 👥 User Roles

### 👑 Admin
- Full system control
- Manage:
  - Employees
  - Clients
  - Services
  - Categories
  - Questions
  - Required documents
- View and manage all client requests

---

### 🧑‍💼 Employee
- Handle client requests
- Claim unassigned requests
- Update request status
- View assigned and completed work

---

### 👤 Client
- Submit service requests
- Upload required documents
- Answer service-related questions
- Track request status
- Rate completed services

---

## 🚀 Core Features

### 🔹 Services Management
- Create, update, delete services
- Attach:
  - Categories
  - Questions
  - Required documents
- Service attributes:
  - Name
  - Description
  - Duration
  - Price
  - Rating

---

### 🔹 Requests System
- Clients submit requests
- Employees process them
- Multiple request statuses supported
- Full lifecycle tracking

---

### 🔹 Categories
- Organize services
- Include:
  - Title
  - Description
  - Image

---

### 🔹 Questions System
- Dynamic questions per service/category
- Supports:
  - Text answers
  - Multiple choice
- Custom ordering

---

### 🔹 Documents System
- Reusable required documents
- Linked dynamically to services
- Example:
  - ID Image
  - Certificates

---

### 🔹 File Upload System
- Files are stored locally in: `/uploads`
- Supports images and general files
- Linked to users and requests

---

## 🔐 Authentication & Authorization

- Authentication is handled via **Cookies**
- Uses **JWT (JSON Web Tokens)**
- Middleware-based protection:
- Verify user authentication
- Verify user role (Admin / Employee / Client)

### Security Features:
- Role-based access control (RBAC)
- Protected routes
- Secure cookie handling

---

## ✅ Validation

All incoming requests are validated using:

- **express-validator**

Validation covers:
- Request body
- URL params
- Query parameters

---

## ⚠️ Error Handling

- Centralized error handling system
- Consistent API error responses
- Proper HTTP status codes
- Safe error messages for production

---

## ⚙️ Installation & Setup

### 1. Clone Frontend Repository

```bash
git clone https://github.com/EN-BAAK/Waraqati-server
cd Waraqati-server
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables
Create a .env file in the root directory and add:

---

## ⚙️ Environment Variables
Create a `.env` file in the root directory:

```env
NODE_ENV=

PORT=

COOKIE_EXPIRE_MS=
COOKIE_EXPIRE=
COOKIE_NAME=

DB_USERNAME=
DB_PASSWORD=
DB_NAME=
DB_HOST=
DB_PORT=

SALT=
JWT_SECRET=

MAIL_MESSAGE_EMAIL=
MAIL_MESSAGE_PASS=
MAIL_MESSAGE_PORT=
MAIL_MESSAGE_HOST=

FRONTEND_URL=
```
### 4. Build the Project

```bash
npm run build
```

### 5. Setup Frontend
Clone the frontend repository:

```bash
git clone https://github.com/EN-BAAK/Waraqati-frontend
```
Then follow the instructions in its README.md.


### 6. Run the Application

```bash
npm start
```

## 📈 Future Improvements (TODO)

- Improve account verification system
- Notifications system (email / in-app)
- Advanced request tracking
- Performance optimizations
- Logging system
- API documentation (Swagger)

## 📌 Notes

- Designed with scalability and maintainability in mind
- Follows clean architecture principles
- Strong separation of concerns
- Secure and extensible

## 📄 License

This project is open-source and available under the MIT License.

---

**Designed and coded by me.**