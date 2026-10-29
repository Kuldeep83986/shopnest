# 🛍️ ShopNest — Full-Stack E-Commerce Application

A full-stack e-commerce web application built with the **MERN stack** (MongoDB, Express.js, React, Node.js). ShopNest supports user authentication, product management, cart, checkout with Razorpay payments, order tracking, email notifications, and a dedicated admin dashboard.

---

## 🚀 Live Demo

- **Frontend:** [https://shopnest-henna-delta.vercel.app](https://shopnest-henna-delta.vercel.app)
- **Backend API:** [https://shopnest-2x3l.onrender.com](https://shopnest-2x3l.onrender.com)

---

## 📁 Project Structure

```
shopnest/
├── backend/                  # Node.js + Express REST API
│   ├── config/
│   │   ├── db.js             # MongoDB connection
│   │   └── cloudinary.js     # Cloudinary image upload config
│   ├── controller/
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── orderController.js
│   │   ├── paymentController.js
│   │   └── analyticsController.js
│   ├── middleware/
│   │   ├── authmiddleware.js  # JWT authentication
│   │   └── adminmiddleware.js # Admin role guard
│   ├── model/
│   │   ├── User.js
│   │   ├── Product.js
│   │   └── Order.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── paymentRoutes.js
│   │   └── analyticsRoutes.js
│   ├── utils/
│   │   └── sendEmail.js      # Nodemailer (Gmail)
│   ├── uploads/              # Temporary local image storage
│   ├── .env                  # Environment variables (not committed)
│   ├── index.js              # Entry point
│   └── package.json
│
└── frontend/                 # React + Vite SPA
    └── src/
        ├── admin/            # Admin-only pages
        │   ├── AdminDashboard.jsx
        │   ├── AdminOrders.jsx
        │   ├── AdminProducts.jsx
        │   ├── AdminUsers.jsx
        │   ├── AddProduct.jsx
        │   └── EditProduct.jsx
        ├── components/
        │   ├── Navbar.jsx
        │   ├── Footer.jsx
        │   └── ProductCard.jsx
        ├── context/
        │   └── AuthContext.jsx   # Auth state (localStorage)
        ├── pages/
        │   ├── Home.jsx
        │   ├── Login.jsx
        │   ├── Register.jsx
        │   ├── ProductDetails.jsx
        │   ├── Cart.jsx
        │   ├── Checkout.jsx
        │   ├── Profile.jsx
        │   └── OrderSuccess.jsx
        ├── redux/
        │   ├── store.js          # Redux Toolkit store
        │   └── cartSlice.js      # Cart state (persisted in localStorage)
        ├── config.js             # API base URL
        └── App.jsx               # Routes
```

---

## ✨ Features

### 👤 User
- Register with welcome email (OTP sent via Gmail)
- Login with JWT-based authentication
- Browse all products / view product detail page
- Add to cart (Redux, persisted in `localStorage`)
- Checkout with delivery address
- Pay via **Razorpay** (INR) with signature verification
- View order history and status
- Profile page

### 🔐 Admin
- Secure admin dashboard (role-based access)
- View analytics: total users, products, orders, revenue
- Add / Edit / Delete products (images uploaded to **Cloudinary**)
- View & manage all orders (update status: Pending → Shipped → Delivered)
- View all registered users

---

## 🗄️ Database Models

### User
| Field | Type | Notes |
|-------|------|-------|
| name | String | required |
| email | String | required, unique |
| password | String | bcrypt hashed |
| role | String | `"user"` \| `"admin"` |
| verified | Boolean | default `false` |

### Product
| Field | Type | Notes |
|-------|------|-------|
| name | String | required |
| description | String | required |
| price | Number | required |
| category | String | required |
| stock | Number | required |
| imageUrl | String | Cloudinary URL |
| rating | Number | default `0` |
| numReviews | Number | default `0` |

### Order
| Field | Type | Notes |
|-------|------|-------|
| user | ObjectId | ref: User |
| items | Array | `{ productId, qty, price }` |
| totalAmount | Number | required |
| address | Object | `{ street, city, postalCode, country }` |
| paymentId | String | Razorpay payment ID |
| status | String | `Pending` \| `Shipped` \| `Delivered` |

---

## 🔌 API Endpoints

### Auth — `/api/auth`
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/register` | Public | Register new user + send welcome email |
| POST | `/login` | Public | Login and receive JWT |
| GET | `/users` | Admin | Get all users |

### Products — `/api/product`
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/` | Public | Get all products |
| POST | `/` | Admin | Create product (with image upload) |
| GET | `/:id` | Public | Get product by ID |
| PUT | `/:id` | Admin | Update product (with optional image) |
| DELETE | `/:id` | Admin | Delete product |

### Orders — `/api/orders`
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/` | User | Create order + send confirmation email |
| GET | `/` | Admin | Get all orders |
| GET | `/myorders` | User | Get current user's orders |
| PUT | `/:id/status` | Admin | Update order status |

### Payments — `/api/payments`
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/order` | Public | Create Razorpay order |
| POST | `/verify` | Public | Verify Razorpay payment signature |

### Analytics — `/api/analytics`
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/` | Admin | Get total users, products, orders, revenue |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite, React Router v7 |
| State Management | Redux Toolkit + Context API |
| HTTP Client | Axios |
| Backend | Node.js, Express.js 5 |
| Database | MongoDB (Atlas) + Mongoose |
| Authentication | JWT + bcryptjs |
| Image Storage | Cloudinary |
| Payments | Razorpay |
| Email | Nodemailer (Gmail) |
| Deployment | Render (backend), — (frontend) |

---

## ⚙️ Local Setup

### Prerequisites
- Node.js >= 18
- MongoDB Atlas account (or local MongoDB)
- Cloudinary account
- Razorpay account
- Gmail account with App Password enabled

---

### 1. Clone the repo

```bash
git clone https://github.com/your-username/shopnest.git
cd shopnest
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key

EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

Start the backend:

```bash
npm run dev       # Development (nodemon)
npm start         # Production
```

Backend runs on: `http://localhost:5000`

---

### 3. Frontend Setup

```bash
cd frontend
npm install
```

In `src/config.js`, set the API URL:

```js
export const API_URL = "http://localhost:5000/api"; // local
// export const API_URL = "https://shopnest-2x3l.onrender.com/api"; // production
```

Start the frontend:

```bash
npm run dev
```

Frontend runs on: `http://localhost:5173`

---

## ☁️ Deployment

### Backend on Render

| Setting | Value |
|---------|-------|
| Root Directory | `backend` |
| Build Command | `npm install` |
| Start Command | `node index.js` |
| Environment | Add all `.env` variables in Render dashboard |
| PORT | Set to `10000` (Render default) |

### Frontend on Vercel / Netlify

```bash
cd frontend
npm run build   # Builds to frontend/dist/
```

Update `src/config.js` to use the live backend URL before building.

---

## 🔑 Environment Variables Reference

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (use `10000` on Render) |
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret key for signing JWT tokens |
| `EMAIL_USER` | Gmail address for sending emails |
| `EMAIL_PASS` | Gmail App Password (not your login password) |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `RAZORPAY_KEY_ID` | Razorpay key ID |
| `RAZORPAY_KEY_SECRET` | Razorpay key secret |

---

## 📜 License

ISC — © Kuldeep
