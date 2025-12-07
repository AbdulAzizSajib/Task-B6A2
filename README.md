# Vehicle Rental Management System

A comprehensive RESTful API for managing vehicle rentals with role-based access control for administrators and customers.

## 🔗 Live URL

[https://https://task-b6-a2.vercel.app/](https://task-b6-a2.vercel.app/)

## ✨ Features

### Authentication & Authorization
- User registration and login with JWT-based authentication
- Role-based access control (Admin & Customer roles)
- Secure password hashing with bcrypt

### User Management
- User profile retrieval
- Role-based user data access

### Vehicle Management
- Create, read, update, and delete vehicles (Admin only)
- View available vehicles (All users)
- Automatic availability status management
- Vehicle filtering and search capabilities

### Booking Management
- Create bookings with automatic pricing calculation
- View all bookings (Admin) or personal bookings (Customer)
- Cancel bookings before start date (Customer)
- Mark bookings as returned and update vehicle availability (Admin)
- Comprehensive booking validation and business rules

## 🛠️ Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **TypeScript** - Type-safe development

### Database
- **PostgreSQL** - Relational database
- **node-postgres (pg)** - PostgreSQL client

### Authentication & Security
- **JSON Web Tokens (JWT)** - Token-based authentication
- **bcryptjs** - Password hashing

### Development Tools
- **tsx** - TypeScript execution and watch mode
- **TypeScript Compiler** - Build tool
- **dotenv** - Environment variable management

## 📋 Prerequisites

Before running this project, ensure you have:

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn package manager

## 🚀 Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/AbdulAzizSajib/Task-B6A2.git
cd Task-B6A2
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Database Setup

Create a PostgreSQL database and set up the required tables:

```sql
-- Create users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'customer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create vehicles table
CREATE TABLE vehicles (
    id SERIAL PRIMARY KEY,
    vehicle_name VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,
    registration_number VARCHAR(100) UNIQUE NOT NULL,
    daily_rent_price DECIMAL(10, 2) NOT NULL,
    availability_status VARCHAR(50) NOT NULL DEFAULT 'available',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create bookings table
CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES users(id),
    vehicle_id INTEGER REFERENCES vehicles(id),
    rent_start_date DATE NOT NULL,
    rent_end_date DATE NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 4. Environment Variables

Create a `.env` file in the root directory:

```env
PORT=5000
NODE_ENV=development

# Database Configuration
DB_USER=your_db_user
DB_HOST=localhost
DB_NAME=vehicle_rental
DB_PASSWORD=your_db_password
DB_PORT=5432

# JWT Secret
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d
```

### 5. Build the Project

```bash
npm run build
```

### 6. Run the Application

**Development Mode:**
```bash
npm run dev
```

**Production Mode:**
```bash
npm start
```

The server will start on `http://localhost:5000`

## 📖 Usage Instructions

### API Endpoints

#### Authentication
- `POST /api/v1/register` - Register a new user
- `POST /api/v1/login` - Login and receive JWT token

#### Users
- `GET /api/v1/users` - Get all users (Admin only)
- `GET /api/v1/users/:userId` - Get user by ID

#### Vehicles
- `POST /api/v1/vehicles` - Create a vehicle (Admin only)
- `GET /api/v1/vehicles` - Get all vehicles
- `GET /api/v1/vehicles/:vehicleId` - Get vehicle by ID
- `PUT /api/v1/vehicles/:vehicleId` - Update vehicle (Admin only)
- `DELETE /api/v1/vehicles/:vehicleId` - Delete vehicle (Admin only)

#### Bookings
- `POST /api/v1/bookings` - Create a booking (Admin & Customer)
- `GET /api/v1/bookings` - Get bookings (All for Admin, Own for Customer)
- `PUT /api/v1/bookings/:bookingId` - Update booking status (Role-based)

### Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

### Example Requests

**Register a User:**
```json
POST /api/v1/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "role": "customer"
}
```

**Create a Booking:**
```json
POST /api/v1/bookings
Authorization: Bearer <token>
{
  "customer_id": 1,
  "vehicle_id": 2,
  "rent_start_date": "2024-01-15",
  "rent_end_date": "2024-01-20",
  "total_price": 250,
  "status": "active"
}
```

**Cancel a Booking (Customer):**
```json
PUT /api/v1/bookings/1
Authorization: Bearer <token>
{
  "status": "cancelled"
}
```

**Mark Booking as Returned (Admin):**
```json
PUT /api/v1/bookings/1
Authorization: Bearer <token>
{
  "status": "returned"
}
```

## 🔒 Business Rules

### Customer Permissions
- Can view and create bookings
- Can only cancel own bookings before start date
- Can view own booking history

### Admin Permissions
- Full access to all resources
- Can manage vehicles (CRUD operations)
- Can mark bookings as returned
- Can view all bookings and users
- Vehicle availability auto-updates when booking is returned

## 📁 Project Structure

```
Task-B6A2/
├── src/
│   ├── config/           # Configuration files (DB, environment)
│   ├── middleware/       # Authentication middleware
│   ├── modules/
│   │   ├── auth/        # Authentication logic
│   │   ├── bookings/    # Booking management
│   │   ├── users/       # User management
│   │   └── vehicles/    # Vehicle management
│   ├── types/           # TypeScript type definitions
│   └── server.ts        # Application entry point
├── .env                 # Environment variables
├── package.json         # Dependencies and scripts
├── tsconfig.json        # TypeScript configuration
└── README.md           # Project documentation
```

## 👨‍💻 Author

**Abdul Aziz Sajib**

## 📄 License

ISC
