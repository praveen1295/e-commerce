# E-commerce Website

An e-commerce platform for browsing, purchasing, and managing products.

## Live Demo

[Visit the website](https://e-commerce-frontend-39iv.onrender.com)

---

## Features

### User Features

- Browse products with categories and filters.
- View product details with images and descriptions.
- Add products to the cart and proceed with checkout.
- View order history and manage account settings.
- **Real-time Customer Chat**: Customers can interact with support agents in real-time to get assistance with their orders or products.

### Admin Features

- Manage product inventory: Add, edit, or delete products.
- **Inventory Update**: Admins can update product quantities and details in real-time.
- View sales data and user information.
- Handle discounts and pricing dynamically.
- Manage customer queries through the real-time chat feature.

---

## Tech Stack

### Frontend

- **React.js**: For building user interfaces.
- **Redux**: For state management.
- **Tailwind CSS**: For styling components.
- **React Router**: For navigation.
- **Socket.io**: For implementing real-time communication (customer chat feature).

### Backend

- **Node.js**: Backend runtime environment.
- **Express.js**: Framework for API creation.
- **MongoDB**: Database for storing user and product data.
- **Mongoose**: ODM for MongoDB.
- **Socket.io**: For enabling real-time communication (customer chat and inventory updates).

---

## Installation and Setup

### Prerequisites

- Node.js installed on your system.
- MongoDB database connection.
- Socket.io library for real-time functionality.

### Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/praveen1295/e-commerce.git
   ```

### Key Updates:

1. **Real-Time Customer Chat**: A feature for customers to communicate with support agents using **Socket.io**.
2. **Inventory Update**: Admins can update product details in real-time, and users will be notified of inventory changes.
3. **Socket.io Setup**: Instructions on configuring `SOCKET_SERVER_URL` and using **Socket.io** for both frontend and backend real-time communication.
