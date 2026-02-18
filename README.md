<div align="center">
  <a href="https://github.com/Shades3101/Kart-app">
    <img src="frontend/public/images/web-logo.png" alt="Lumiere Logo" width="300">
  </a>
</div>

<div align="center">

![Project Status](https://img.shields.io/badge/Status-Active-success?style=for-the-badge&logo=git)
![License](https://img.shields.io/badge/License-ISC-blue?style=for-the-badge&logo=open-source-initiative)
![Build](https://img.shields.io/badge/Build-Passing-brightgreen?style=for-the-badge&logo=github-actions)

**India's Premier Marketplace for Buying & Selling Used Books**

[View Demo](#) · [Report Bug](#) · [Request Feature](#)

</div>

---

## 📖 About The Project

**Lumiere** is a dedicated peer-to-peer marketplace designed to give old books a new home. We connect book lovers across India, allowing them to:
- **Sell**: Users can easily list their used books by posting ads, setting prices, and managing their inventory.
- **Buy**: Readers can discover a vast collection of pre-loved books at affordable prices.

Built with a robust **Next.js** frontend and a scalable **Node.js/Express** backend, Lumiere ensures a secure, fast, and user-friendly experience for both buyers and sellers.

## ✨ Key Features

- **📚 Buy & Sell Platform**: A complete ecosystem for users to list their own books for sale and purchase from others.
- **📝 Easy Ad Posting**: Simple 3-step process to list a book: Post Ad Details, Set Price, Get Paid.
- **🔐 Secure Authentication**: Robust user login and registration via Google OAuth and local JWT strategies.
- **🛒 Smart Shopping Cart**: Seamlessly manage multiple books from different sellers in one cart.
- **❤️ Wishlist**: Save interesting reads for later.
- **📦 Order Management**: Track orders from placement to delivery.
- **💳 Secure Payments**: Integrated **Razorpay** for safe transactions between buyers and sellers.
- ** Address Management**: Save multiple shipping addresses for faster checkout.
- **📱 Responsive Design**: Fully responsive UI built with **Tailwind CSS** and **Radix UI** primitives, ensuring a perfect experience on mobile, tablet, and desktop.
- **⚡ High Performance**: Utilizing **Next.js 15+** for server-side rendering and static generation where appropriate.
- **🎨 Beautiful UI/UX**: Enhanced with **Framer Motion** for smooth animations and transitions.

## 🛠️ Tech Stack

### Frontend
*   ![Next.js](https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white) **Next.js** - The React Framework for the Web
*   ![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white) **TypeScript** - Typed JavaScript at Any Scale
*   ![Tailwind CSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white) **Tailwind CSS** - Utility-first CSS framework
*   ![Redux](https://img.shields.io/badge/redux-%23593d88.svg?style=for-the-badge&logo=redux&logoColor=white) **Redux Toolkit** - State Management
*   ![Framer Motion](https://img.shields.io/badge/Framer-Motion?style=for-the-badge&logo=framer&logoColor=black) **Framer Motion** - Production-ready motion library

### Backend
*   ![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white) **Node.js** - JavaScript runtime
*   ![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB) **Express.js** - Web framework for Node.js
*   ![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white) **MongoDB** - NoSQL Database
*   ![Typescript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white) **TypeScript** - Strongly typed programming language

### Services & Tools
*   ![Razorpay](https://img.shields.io/badge/Razorpay-02042B?style=for-the-badge&logo=razorpay&logoColor=3395FF) **Razorpay** - Payment Gateway
*   ![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white) **Cloudinary** - Image Management
*   ![Google](https://img.shields.io/badge/Google_Cloud-4285F4?style=for-the-badge&logo=google-cloud&logoColor=white) **Google OAuth** - Authentication

## � Project Structure

```bash
lumiere/
├── backend/ # Node.js & Express API
│   ├── src/
│   │   ├── config/ # DB & Cloudinary Config
│   │   ├── controllers/# Route Logic
│   │   ├── middleware/ # Auth & Upload Middleware
│   │   ├── models/ # Mongoose Schemas
│   │   ├── routes/ # API Endpoints
│   │   └── utils/ # Helper functions
│   └── package.json
│
└── frontend/ # Next.js 13+ App Router
    ├── app/
    │   ├── account/ # User Dashboard
    │   ├── books/ # Book Listings
    │   ├── book-sell/ # Sell Book Flow
    │   ├── checkout/ # Payment Flow
    │   └── components/ # Reusable UI Components
    ├── public/ # Static Assets
    └── package.json
```

## �📸 Screenshots

<div align="center">
  <!-- Add your screenshots in the assets folder or image links here -->
  <img src="https://via.placeholder.com/800x400?text=Product+Listing+Page" alt="Product Listing" width="800"/>
  <br/><br/>
  <img src="https://via.placeholder.com/800x400?text=Cart+Page" alt="Cart Page" width="800"/>
</div>

## 🚀 Getting Started

Follow these steps to set up the project locally.

### Prerequisites

*   **Node.js** (v18 or higher)
*   **MongoDB** (Local instance or Atlas URI)
*   **npm** or **yarn**

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/lumiere.git
    cd lumiere
    ```

2.  **Install Backend Dependencies**
    ```bash
    cd backend
    npm install
    ```

3.  **Install Frontend Dependencies**
    ```bash
    cd ../frontend
    npm install
    ```

### Configuration

Create a `.env` file in the **backend** directory and add the following variables:

```env
PORT=3001
DB_URL=mongodb://localhost:27017/lumiere
FE_URL=http://localhost:3000
JWT_SECRET=your_jwt_secret_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
CALLBACK_URL=http://localhost:3001/api/auth/google/callback
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Create a `.env.local` file in the **frontend** directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
```

### Running the Application

1.  **Start the Backend Server**
    ```bash
    cd backend
    npm run dev
    ```

2.  **Start the Frontend Server**
    ```bash
    cd frontend
    npm run dev
    ```

The frontend should now be running on `http://localhost:3000` and the backend on `http://localhost:3001`.

## 🤝 Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

Distributed under the ISC License. See `LICENSE` for more information.

---

<div align="center">
  Made with ❤️ by <a href="https://github.com/yourusername">Your Name</a>
</div>
