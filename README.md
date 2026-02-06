# 🥗 MealMint - Modern Food Marketplace Platform

MealMint is a high-performance, responsive food delivery marketplace platform built with a focus on speed, user experience, and seamless role-based management. It connects customers with local restaurants, providing a streamlined ordering process and robust management dashboards for vendors and administrators.

![MealMint Banner](https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80)

---

## 🚀 Key Features

### 🛒 Customer Experience
- **Interactive Home Page**: Browse top restaurants and trending cuisines.
- **Advanced Search**: Effortlessly find specific meals or dietary preferences.
- **Smart Cart System**: Real-time cart updates and persistent storage.
- **Order Tracking**: Monitor order status from preparation to delivery.
- **User Profile**: Manage delivery addresses and order history.

### 🏪 Vendor Management
- **Dashboard**: Real-time sales analytics and order overviews.
- **Menu Builder**: Easily add, edit, or remove dishes with custom pricing and images.
- **Order Processing**: Manage incoming orders, update status, and track earnings.
- **Vendor Status**: Transition between "Open" and "Closed" states for the restaurant.

### 🛡️ Admin Dashboard
- **Platform Overview**: Monitor total users, vendors, and revenue.
- **Vendor Verification**: Approve or decline new vendor applications.
- **User Management**: Oversight of both customer and vendor accounts.
- **System Security**: Role-based access control protecting sensitive data.

---

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+), Bootstrap 5
- **Backend/Database**: Firebase v10 (Authentication, Firestore, Security Rules)
- **UI Enahncements**: SweetAlert2 (Notifications), Google Fonts (Poppins), Unsplash API
- **Security**: Role-based Access Control (RBAC) via `role-guard.js`

---

## 📁 Project Structure

```text
Meal-Mint/
├── admin/              # Admin-specific modules and dashboard
├── assets/
│   ├── css/            # Global, Auth, Customer, and Vendor styles
│   ├── js/             # Firebase config, Auth, Cart, and Core logic
│   └── images/         # Local static assets
├── firebase/           # Firestore security rules and configuration
├── pages/              # Customer-facing pages (Home, Restaurant, Profile)
├── vendor/             # Vendor-specific modules and dashboard
└── index.html          # Main landing page
```

---

## ⚙️ Getting Started

### Prerequisites
- A modern web browser.
- A Firebase project (for hosting or local development).

### Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/Meal-Mint.git
   cd Meal-Mint
   ```

2. **Configure Firebase**:
   Update `assets/js/firebase-config.js` with your own credentials:
   ```javascript
   const firebaseConfig = {
       apiKey: "YOUR_API_KEY",
       authDomain: "YOUR_AUTH_DOMAIN",
       projectId: "YOUR_PROJECT_ID",
       storageBucket: "YOUR_STORAGE_BUCKET",
       messagingSenderId: "YOUR_SENDER_ID",
       appId: "YOUR_APP_ID"
   };
   ```

3. **Deploy Rules**:
   Ensure you apply the Firestore rules located in `firebase/firestore.rules` to your Firebase project to secure your data.

4. **Run the Project**:
   Since it's a Vanilla JS project, you can simply open `index.html` in your browser or use a local server like **Live Server** in VS Code.

---

## 🔒 Security

This platform implements strict **Role-Based Access Control (RBAC)**.
- **Role Guard**: Middleware logic in `assets/js/role-guard.js` ensures users can only access pages designated for their role (Admin, Vendor, or Customer).
- **Firestore Rules**: Server-side validation ensuring that users can only read/write data they own.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 📧 Contact

**Project Managed by**: [Faizyab Hussain , Kashif , Gufraan]  
**Website**: [https://meal-mint.netlify.app](https://meal-mint.netlify.app)

---
*Created with ❤️ for the Food Marketplace Community.*
