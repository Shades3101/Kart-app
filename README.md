<h1 align="center">Kart</h1>

<p align="center">
  <b>India's Premier Marketplace for Buying & Selling Used Books</b>
  <br />
  <a href="https://github.com/Shades3101/Kart-app"><strong>Explore the docs »</strong></a>
  <br />
  <br />
  <a href="#">View Demo</a>
  ·
  <a href="https://github.com/Shades3101/Kart-app/issues">Report Bug</a>
  ·
  <a href="https://github.com/Shades3101/Kart-app/issues">Request Feature</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Status-Active-success?style=for-the-badge&logo=git&logoColor=white" alt="Status" />
  <img src="https://img.shields.io/badge/License-ISC-blue?style=for-the-badge&logo=open-source-initiative&logoColor=white" alt="License" />
  <img src="https://img.shields.io/badge/Build-Passing-brightgreen?style=for-the-badge&logo=github-actions&logoColor=white" alt="Build" />
</p>

<br />

---

## 📖 Table of Contents
- [About The Project](#-about-the-project)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Screenshots](#-screenshots)
- [Getting Started](#-getting-started)
- [Usage](#-usage)
- [Contributing](#-contributing)
- [License](#-license)

---

## 📖 About The Project

**Kart** is a dedicated peer-to-peer marketplace designed to give old books a new home. We connect book lovers across India, fostering a sustainable reading culture by allowing users to trade pre-loved books effortlessly.

### Built With
Kart leverages a modern full-stack architecture to provide a lightning-fast and secure experience:
*   **Next.js 15+** for the dynamic and responsive frontend.
*   **Node.js & Express** for a scalable backend API.
*   **MongoDB** for flexible data storage.
*   **Redux Toolkit** for seamless state management.

---

## ✨ Key Features

| Feature | Description |
| :--- | :--- |
| 📚 **Marketplace** | A complete ecosystem to list, browse, and buy used books. |
| 📝 **Ad Posting** | Simple 3-step listing process for sellers. |
| 🔐 **Auth** | Secure Google OAuth and JWT-based authentication. |
| 🛒 **Smart Cart** | Advanced cart management for multiple items and sellers. |
| ❤️ **Wishlist** | Keep track of books you want to read next. |
| 📦 **Orders** | Real-time order tracking and management. |
| 💳 **Payments** | Integrated **Razorpay** for secure financial transactions. |
| 📍 **Addresses** | Multiple shipping address support for user convenience. |
| 📱 **Responsive** | Optimized for mobile, tablet, and desktop views. |

---

## 🛠️ Tech Stack

### 🎨 Frontend
<p align="left">
  <img src="https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/redux-%23593d88.svg?style=for-the-badge&logo=redux&logoColor=white" alt="Redux" />
  <img src="https://img.shields.io/badge/Framer-Motion?style=for-the-badge&logo=framer&logoColor=black" alt="Framer Motion" />
</p>

### ⚙️ Backend
<p align="left">
  <img src="https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white" alt="NodeJS" />
  <img src="https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB" alt="Express.js" />
  <img src="https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens" alt="JWT" />
</p>

### 🛠️ Infrastructure & Tools
<p align="left">
  <img src="https://img.shields.io/badge/Razorpay-02042B?style=for-the-badge&logo=razorpay&logoColor=3395FF" alt="Razorpay" />
  <img src="https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white" alt="Cloudinary" />
  <img src="https://img.shields.io/badge/Google_Cloud-4285F4?style=for-the-badge&logo=google-cloud&logoColor=white" alt="Google OAuth" />
</p>

---

## 📂 Project Structure

```bash
Kart/
├── 📁 backend/             # Node.js & Express API
│   ├── 📁 src/
│   │   ├── 📁 config/      # DB & Cloudinary Configuration
│   │   ├── 📁 controllers/ # Business Logic
│   │   ├── 📁 middleware/  # Authentication & File Uploads
│   │   ├── 📁 models/      # Mongoose Schemas
│   │   ├── 📁 routes/      # Express Routes
│   │   └── 📁 utils/       # Utility Functions
│   └── 📄 package.json
│
└── 📁 frontend/            # Next.js 13+ App Router
    ├── 📁 app/             # Application Pages
    │   ├── 📁 account/     # User Profile & Dashboard
    │   ├── 📁 books/       # Marketplace Listings
    │   ├── 📁 book-sell/   # Seller Onboarding Flow
    │   ├── 📁 checkout/    # Order & Payment Flow
    │   └── 📁 components/  # Reusable UI Library
    ├── 📁 public/          # Static Assets & Icons
    └── 📄 package.json
```

---

## 📸 Screenshots

<div align="center">
  <table border="0">
    <tr>
      <td align="center">
        <b>✨ Landing Page</b><br />
        <img src="frontend/public/Landing Page.png" alt="Landing Page" width="400" height="250" style="object-fit: cover; border-radius: 8px;" />
      </td>
      <td align="center">
        <b>🛍️ Product Details</b><br />
        <img src="frontend/public/Product Details Page.png" alt="Product Details" width="400" height="250" style="object-fit: cover; border-radius: 8px;" />
      </td>
    </tr>
    <tr>
      <td align="center">
        <b>📚 Marketplace</b><br />
        <img src="frontend/public/2.png" alt="Marketplace" width="400" height="250" style="object-fit: cover; border-radius: 8px;" />
      </td>
      <td align="center">
         <b>🛒 Shopping Flow</b><br />
         <img src="frontend/public/Checkout.png" alt="Checkout" width="400" height="250" style="object-fit: cover; border-radius: 8px;" />
      </td>
    </tr>
  </table>
</div>

---

## 🚀 Getting Started

### Prerequisites
*   Node.js (v18+)
*   MongoDB Atlas or Local Instance
*   npm or pnpm

### Setup

1. **Clone the Repo**
   ```bash
   git clone https://github.com/Shades3101/Kart-app.git
   cd lumiere
   ```

2. **Server Configuration**
   ```bash
   cd backend && npm install
   cp .env.example .env # Or manually create it
   ```

3. **Client Configuration**
   ```bash
   cd ../frontend && npm install
   cp .env.example .env.local
   ```

### Execution
Run both servers in separate terminals:
```bash
# Backend
npm run dev

# Frontend
npm run dev
```

---

## 🤝 Contributing

We ❤️ contributions! Check out our [contribution guidelines](#) to get started.

1. Fork the Project
2. Create Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit Changes (`git commit -m 'Add AmazingFeature'`)
4. Push to Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the **ISC License**. See `LICENSE` for more information.

<div align="center">
  <br />
  <img src="https://forthebadge.com/images/badges/built-with-love.svg" height="25">
  <img src="https://forthebadge.com/images/badges/made-with-typescript.svg" height="25">
  <img src="https://forthebadge.com/images/badges/not-a-bug-a-feature.svg" height="25">
</div>
