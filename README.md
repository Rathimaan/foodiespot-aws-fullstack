# 🍕 FoodieSpot - Full-Stack Food Delivery Application (React.js + Node.js + AWS)

> **Project Submission for 2026 Graduates React.js + Node.js + AWS Developer Role at PluginHive**  
> **Candidate**: Rathimaan  
> **Tech Stack**: React.js, Node.js, Express.js, MongoDB, AWS S3, AWS EC2, AWS EBS, AWS IAM, Docker

---

## 🌟 Executive Overview

**FoodieSpot** is a modern, high-performance full-stack web application for online food ordering and restaurant management. It features a responsive customer-facing storefront built with **React.js**, a feature-packed Admin Dashboard, a RESTful API powered by **Node.js & Express**, and cloud infrastructure powered by **AWS (S3, EC2, EBS, IAM)**.

---

## 🚀 Key Features & Highlights

- 🛒 **React Customer Application (`/frontend`)**:
  - Interactive food category filtering & real-time search.
  - State-managed cart with dynamic quantity increment/decrement.
  - User authentication (JWT token login & registration modal).
  - Multi-step checkout with order verification and stripe payment flow.
  - S3 cloud image rendering with local fallback compatibility.

- 👨‍🍳 **React Admin Management Portal (`/admin`)**:
  - Add new menu items with image uploads.
  - Real-time food listing management with category tag filters.
  - Delete food items with automatic AWS S3 object cleanup.
  - Live order tracking and status updates.

- ⚡ **Node.js & Express REST Backend (`/backend`)**:
  - Clean MVC architectural pattern.
  - AWS S3 integration using `@aws-sdk/client-s3`.
  - Smart storage adapter: Direct AWS S3 bucket streaming when credentials exist; local disk storage fallback out-of-the-box.
  - Password hashing with `bcryptjs` and secure session token generation via `jsonwebtoken`.
  - MongoDB Atlas database integration.

- ☁️ **AWS Cloud & DevOps Integration (`/aws`)**:
  - **AWS S3**: Bucket media storage for high-availability image assets.
  - **AWS IAM**: Fine-grained JSON least-privilege security policies (`aws/iam-policy-s3.json`).
  - **AWS EC2 & EBS**: Automated EC2 installation script (`aws/deploy-ec2.sh`) and EBS volume mounting for persistent data/logs.
  - **Docker**: Multi-container `docker-compose.yml` for zero-configuration local evaluation & cloud deployment.

---

## 🏗️ Project Architecture

```
FoodieSpot-AWS-FullStack/
├── admin/                      # React Admin Web Dashboard
│   ├── src/                    # Components, Pages (Add, List, Orders)
│   └── package.json
├── backend/                    # Node.js + Express REST API Server
│   ├── config/                 # Database (db.js) & AWS S3 (s3.js)
│   ├── controllers/            # Food, User, Cart, Order Controllers
│   ├── routes/                 # Express API Routes & AWS Status Route
│   ├── models/                 # Mongoose Schema Definitions
│   ├── .env.example            # Environment variables template
│   └── package.json
├── frontend/                   # React Customer Ordering Web Application
│   ├── src/                    # Context API, Components, Pages
│   └── package.json
├── aws/                        # AWS Cloud Deployment & Policy Files
│   ├── iam-policy-s3.json      # AWS IAM Security Policy
│   ├── s3-bucket-policy.json   # AWS S3 Bucket Policy
│   └── deploy-ec2.sh           # AWS EC2 Shell Automation Script
├── AWS_SETUP.md                # Detailed AWS Architecture & Setup Guide
├── docker-compose.yml          # Multi-container orchestration
└── README.md                   # Project documentation
```

---

## ⚡ Quick Start Guide (Local Running & Evaluation)

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- MongoDB (Local instance or MongoDB Atlas Connection String)

### 1. Clone & Setup Backend
```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` and set your `MONGO_URL` and `JWT_SECRET`.  
*(AWS credentials in `.env` are optional! If omitted, the app automatically switches to Local Disk Fallback Mode so you can evaluate the app immediately).*

Start Backend Server:
```bash
npm run server
```
*Backend runs on `http://localhost:4000`*

### 2. Setup & Start Frontend
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs on `http://localhost:5173`*

### 3. Setup & Start Admin Dashboard
```bash
cd admin
npm install
npm run dev
```
*Admin Dashboard runs on `http://localhost:5174`*

---

## 🐳 Quick Run with Docker

To run the full stack (Backend + Frontend) via Docker:

```bash
docker-compose up --build
```

---

## 🧪 AWS Integration Status Verification

Evaluators can verify the AWS status live by calling:

```http
GET http://localhost:4000/api/aws/status
```

Refer to [`AWS_SETUP.md`](./AWS_SETUP.md) for full details on AWS S3 Bucket Policies, IAM Least Privilege Roles, EC2 Deployment, and EBS volume setup.
