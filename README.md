<div align="center">
  <img src="https://img.icons8.com/color/96/000000/product-management.png" alt="AssetFlow Logo" width="100"/>
  <h1>AssetFlow 🚀</h1>
  <p><strong>A comprehensive organization asset management system designed to streamline the tracking, allocation, maintenance, and auditing of company assets.</strong></p>

  <p>
    <a href="https://reactjs.org/"><img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" /></a>
    <a href="https://nodejs.org/"><img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" /></a>
    <a href="https://www.postgresql.org/"><img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" /></a>
    <a href="https://expressjs.com/"><img src="https://img.shields.io/badge/Express.js-404D59?style=for-the-badge" alt="Express.js" /></a>
    <a href="#"><img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" alt="Vite" /></a>
  </p>
</div>

---

## 🌟 Key Features

### 🏢 1. Organization & User Management
* **Manage Roles:** Seamlessly handle roles, departments, and employees across the organization.
* **Security First:** Secure user authentication bolstered with robust role-based access control (RBAC).

### 📦 2. Asset Tracking & Lifecycle
* **Bird's Eye View:** Comprehensive dashboard providing a detailed asset overview at a glance.
* **Smart Categorization:** Track assets effortlessly by categories, current status, and exact location.
* **Lifecycle Management:** Handle asset allocations, transfers between employees, and smooth return processes.

### 📅 3. Resource Booking & Maintenance
* **Shared Assets:** Efficient resource booking system for seamlessly utilizing shared company assets.
* **Upkeep & Repairs:** Create, monitor, and track maintenance requests for damaged or under-maintenance items.

### 🔍 4. Auditing & Reporting
* **Regular Checks:** Conduct scheduled audit cycles to verify and ensure asset availability.
* **Discrepancy Tracking:** Automatically track and report discrepancies and missing items.
* **Always Informed:** Detailed activity logging and real-time system notifications.

---

## 🛠️ Tech Stack

<details>
<summary><b>💻 Frontend</b></summary>

- **React 19** — Next-gen UI library
- **Vite** — Lightning fast build tool
- **React Router** — Declarative routing
- **Axios** — Promise based HTTP client
</details>

<details>
<summary><b>⚙️ Backend</b></summary>

- **Node.js & Express** — Fast and scalable server framework
- **PostgreSQL** — Powerful, open source object-relational database
- **JWT** — Secure Authentication
- **Bcrypt** — Password Hashing
- **Helmet & Morgan** — Enhanced Security & Request Logging
</details>

---

## 📂 Project Structure

```bash
.
├── client/                # Frontend React application
│   ├── src/               # React source files
│   ├── package.json       # Frontend dependencies
│   └── vite.config.js     # Vite configuration
├── server/                # Backend Node.js application
│   ├── database/          # SQL schema and DB scripts
│   ├── server.js          # Express server entry point
│   └── package.json       # Backend dependencies
└── README.md              # Project documentation
```

---

## 🚀 Getting Started

Follow these steps to get a local copy up and running.

### Prerequisites

* [Node.js](https://nodejs.org/) (v16 or higher recommended)
* [PostgreSQL](https://www.postgresql.org/) database running on your local machine

### 🗄️ 1. Database Setup

1. Create a new PostgreSQL database (e.g. `assetflow_db`).
2. Run the SQL script located at `server/database/schema.sql` to generate the necessary tables:
   ```bash
   psql -U your_username -d assetflow_db -f server/database/schema.sql
   ```

### ⚙️ 2. Backend Setup

1. Navigate to the server directory:
   ```bash
   cd server
   ```
2. Install the necessary packages:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `server` directory. Example:
   ```env
   PORT=5000
   DB_USER=your_pg_user
   DB_PASSWORD=your_pg_password
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=assetflow_db
   JWT_SECRET=your_super_secret_key
   ```
4. Start the backend development server:
   ```bash
   npm run dev
   ```

### 💻 3. Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd client
   ```
2. Install the frontend dependencies:
   ```bash
   npm install
   ```
3. Start the frontend Vite development server:
   ```bash
   npm run dev
   ```

---

## 📜 License

Distributed under the **ISC License**. See `LICENSE` for more information.

<div align="center">
  <p>Built with ❤️ by the AssetFlow Team</p>
</div>
