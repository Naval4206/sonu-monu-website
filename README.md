# 🛍️ Sonu Monu – Full Stack Clothing Store Website

A **production-ready full stack clothing store web application** with a modern user interface, secure authentication, and a powerful admin panel for managing products, users, feedback, and queries.

This project is designed as a **real-world business application**, not a demo.

---

## 🚀 Features

### 👤 User Features
- User Signup & Signin (Email optional)
- Auto-login after signup
- Secure JWT authentication
- Logged-in user name shown in navbar
- Product listing with:
  - Search by name
  - Filter by gender & size
  - Sort by price
- Product feedback (login required)
- Store feedback with star rating
- User queries (login required)
- Fully responsive UI (mobile & desktop)
- Global logout sync (admin & user)

---

### 🛠️ Admin Panel Features
- Secure admin login (role-based)
- Admin-only protected routes
- Dashboard with live statistics
- Product management:
  - Add, Edit & Delete products
  - Product image upload
- User management:
  - Edit user details
  - Delete users
  - Manage roles
- Feedback management:
  - Store feedback
  - Product feedback
  - Read / Delete actions
- Query management:
  - View, read & delete user queries
- Clean & professional admin UI
- Sidebar navigation with active states

---

## 🧱 Tech Stack

### Frontend
- **Next.js (App Router)**
- **TypeScript**
- **Tailwind CSS**
- Fully responsive design
- Client & Server Components

### Backend
- **Flask (Python)**
- **JWT Authentication**
- Role-based access control
- RESTful APIs

### Database
- **MySQL**
- Structured relational schema

---

## 🔐 Authentication & Security
- JWT-based authentication
- Admin role protection
- Secure password hashing
- Global logout synchronization
- Protected routes on frontend & backend

---

## 📂 Project Structure (Simplified)

sonu-monu-website/
│── frontend/
│ ├── app/
│ │ ├── admin/
│ │ ├── products/
│ │ ├── feedback/
│ │ ├── queries/
│ │ ├── signin/
│ │ ├── signup/
│ │ └── layout.tsx
│ ├── components/
│ └── styles/
│
│── backend/
│ ├── routes/
│ ├── utils/
│ ├── db.py
│ ├── auth.py
│ └── app.py
│
│── README.md
│── .gitignore


---

## ⚙️ Environment Variables

### Frontend (`frontend/.env.local`)
NEXT_PUBLIC_BACKEND_URL=http://127.0.0.1:8000


### Backend (`backend/.env`)
JWT_SECRET_KEY=your_secret_key
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=sonu_monu


---

## ▶️ Running the Project Locally

### 1️⃣ Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py

Backend runs on:

http://127.0.0.1:8000

2️⃣ Frontend Setup
cd frontend
npm install
npm run dev


Frontend runs on:

http://localhost:3000

🔑 Admin Access

Admin users are identified by:

role = 'admin'
in the users table.

Admin credentials automatically redirect to the admin dashboard after login.

📌 Future Enhancements

Analytics charts in admin panel
Order placement & payment gateway
Email notifications
Cloud image storage (Cloudinary)
Activity logs for admin actions

👨‍💻 Author

Sonu Monu – Full Stack Project
Built with ❤️ as a real-world business application.

⭐ If you like this project, give it a star!