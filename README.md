# Blood Bridge - Blood Donation Management System

**Client Side Repository**: [View on GitHub](https://github.com/SamiunAuntor/PH-Assignment-11_Blood-Bridge_Client)  
**Server Side Repository**: [View on GitHub](https://github.com/SamiunAuntor/PH-Assignment-11_Blood-Bridge_Server)

A modern, secure MERN Stack web application for managing blood donation requests and connecting donors with recipients. Users can register as donors, create donation requests, search for donors, manage requests, and contribute to funding. Built with role-based access control for Admin, Volunteer, and Donor roles.

🌐 **Live Demo**  
🔗 [View Live Application](https://placeholder.com)

---

## 📋 Table of Contents

- [Live Demo](#-live-demo)
- [Project Overview](#-project-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Running the Project](#-running-the-project)
- [Project Structure](#-project-structure)
- [Key Features](#-key-features)
- [User Roles](#-user-roles)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [Future Scope](#-future-scope)

---

## 🎯 Project Overview

Blood Bridge is a comprehensive blood donation management platform that facilitates the connection between blood donors and recipients. The application enables users to register as donors, create donation requests, search for compatible donors based on blood group and location, manage donation requests with status tracking, and contribute to organizational funding. The platform includes role-based dashboards for Admin, Volunteer, and Donor users with appropriate permissions and access controls.

---

## ✨ Features

### 🔐 Authentication & Authorization
- **User Registration**: Register with email, name, avatar, blood group, location (district/upazila), and password
- **User Login**: Secure login with email and password using Firebase Authentication
- **Role-Based Access Control**: Three user roles (Admin, Volunteer, Donor) with different permissions
- **Protected Routes**: Private routes protected with authentication and role-based access
- **User Status Management**: Admin can block/unblock users

### 🩸 Donation Request Management
- **Create Donation Request**: Donors can create requests with recipient details, location, hospital info, date/time, and blood group
- **View All Requests**: Public page showing all pending donation requests
- **Request Details**: Detailed view of each donation request with all information
- **Edit Requests**: Donors can edit their own donation requests
- **Delete Requests**: Donors can delete their own requests (with confirmation)
- **Status Management**: Track request status (pending, inprogress, done, canceled)
- **Donation Response**: Logged-in users can respond to requests, changing status from pending to inprogress

### 👥 User Management (Admin)
- **All Users Page**: View all registered users in tabular format
- **Role Management**: Admin can change user roles (donor → volunteer → admin)
- **Status Management**: Admin can block/unblock users
- **User Filtering**: Filter users by status (active/blocked)

### 🔍 Search & Discovery
- **Search Donors**: Search for donors by blood group, district, and upazila
- **PDF Export**: Download search results as PDF (jsPDF integration)
- **Location-Based Search**: Uses Bangladesh district and upazila data

### 📊 Dashboard Features
- **Dashboard Home**: Role-specific dashboard with statistics and recent requests
- **Statistics Cards**: Total users, total funding, donation requests count
- **Analytics Charts**: Admin dashboard includes pie chart showing donation request status overview (pending, inprogress, done, canceled)
- **Recent Requests**: Display 3 most recent donation requests
- **Pagination**: Implemented for donation requests and users lists
- **Status Filtering**: Filter requests by status (pending, inprogress, done, canceled)

### 💰 Funding System
- **Funding Page**: View all funding contributions in tabular format
- **Give Fund**: Button to contribute funding (Stripe integration ready)
- **Total Funding Display**: Shows total funds collected

### 📱 Responsive Design
- **Mobile-First**: Fully responsive design for mobile, tablet, and desktop
- **Table Scrolling**: Horizontal scrolling for tables on mobile devices
- **Sidebar Navigation**: Responsive sidebar for dashboard navigation
- **Modern UI**: Clean, modern interface with proper spacing and alignment

### 🎨 UI/UX Features
- **Loading States**: Loading spinners during API calls
- **Toast Notifications**: Modern toast notifications using react-hot-toast
- **SweetAlert2**: Beautiful confirmation modals for critical actions
- **Error Handling**: Custom 404 error page
- **Form Validation**: Client-side form validation
- **Image Upload**: ImageBB integration for avatar uploads

---

## 🛠 Tech Stack

### Core Technologies
- **React 19.x** - UI library
- **Vite 7.x** - Build tool and dev server
- **JavaScript (ES6+)** - Programming language
- **React Router 7.x** - Client-side routing
- **MongoDB** - Database (server-side)
- **Express.js** - Backend framework (server-side)
- **Node.js** - Runtime environment (server-side)

### Authentication & Backend
- **Firebase Authentication** - User authentication
- **Axios** - HTTP client with interceptors
- **JWT** - Token-based authentication (server-side)

### Styling & UI Libraries
- **Tailwind CSS 4.x** - Utility-first CSS framework
- **DaisyUI 5.x** - Component library for Tailwind
- **Lucide React** - Icon library
- **React Icons** - Additional icon library

### Utilities & Packages
- **jsPDF** - PDF generation
- **jsPDF-AutoTable** - Table generation in PDF
- **Recharts** - Chart library for data visualization
- **SweetAlert2** - Beautiful alert modals
- **react-hot-toast** - Toast notifications
- **React Hook Form** - Form management
- **React Loading Indicators** - Loading spinners

### Development Tools
- **ESLint** - Code linting
- **Vite** - Build tool

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v16.x or higher)
- **npm** (v7.x or higher) or **yarn**
- **Modern web browser** (Chrome, Firefox, Safari, Edge)
- **Git** (for cloning the repository)

---

## 🚀 Installation

### 1. Clone the repository

```bash
git clone https://github.com/SamiunAuntor/PH-Assignment-11_Blood-Bridge_Client.git
cd PH-Assignment-11_Blood-Bridge_Client
```

### 2. Install dependencies

```bash
npm install
```

or

```bash
yarn install
```

### 3. Environment Variables

Create a `.env` file in the root directory and add the following variables:

```env
VITE_API_URL=your-api-url-here
VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-firebase-auth-domain
VITE_FIREBASE_PROJECT_ID=your-firebase-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-firebase-storage-bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your-firebase-messaging-sender-id
VITE_FIREBASE_APP_ID=your-firebase-app-id
```

---

## 🏃 Running the Project

### Development Mode

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

Output will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

### Linting

```bash
npm run lint
```

---

## 📁 Project Structure

```
blood-bridge-client/
├── public/
│   ├── districts.json          # Bangladesh districts data
│   ├── divisions.json          # Bangladesh divisions data
│   └── upzillas.json           # Bangladesh upazilas data
├── src/
│   ├── assets/                 # Images, icons, logos
│   │   ├── banner-*.jpg        # Banner images
│   │   ├── logo.png            # Application logo
│   │   ├── loginPhoto.jpg      # Login page image
│   │   └── user.png            # Default user avatar
│   ├── Components/             # Reusable UI components
│   │   ├── Banner.jsx          # Home page banner
│   │   ├── ContactUsSection.jsx # Contact form section
│   │   ├── FeaturedSection.jsx # Featured section
│   │   ├── Footer.jsx          # Footer component
│   │   ├── Loading.jsx         # Loading spinner
│   │   └── NavBar.jsx          # Navigation bar
│   ├── Firebase/               # Firebase configuration
│   │   ├── AuthProvider.jsx    # Firebase auth context
│   │   └── firebase.config.js  # Firebase config
│   ├── Hooks/                  # Custom React hooks
│   │   ├── useAuth.jsx         # Authentication hook
│   │   ├── useAxios.jsx        # Axios instance hook
│   │   └── useRole.jsx         # User role hook
│   ├── Layouts/                # Layout components
│   │   ├── DashboardLayout.jsx # Dashboard layout with sidebar
│   │   └── HomeLayout.jsx       # Home page layout
│   ├── Pages/                  # Page components
│   │   ├── AllBloodDonationRequest.jsx    # All requests (Admin/Volunteer)
│   │   ├── AllUsers.jsx                   # All users (Admin)
│   │   ├── CreateDonationRequest.jsx      # Create request (Donor)
│   │   ├── DashboardHome.jsx              # Dashboard home
│   │   ├── DonationRequestDetails.jsx     # Request details
│   │   ├── DonationRequests.jsx           # Public requests page
│   │   ├── EditDonationRequest.jsx        # Edit request (Donor)
│   │   ├── Error404Page.jsx               # 404 error page
│   │   ├── Funding.jsx                    # Funding page
│   │   ├── HomePage.jsx                   # Home page
│   │   ├── LoginPage.jsx                  # Login page
│   │   ├── MyAllDonationRequests.jsx      # My requests (Donor)
│   │   ├── RegisterPage.jsx               # Registration page
│   │   ├── SearchDonors.jsx               # Search donors page
│   │   └── UserProfile.jsx                 # User profile page
│   ├── PrivateRoutes/          # Route protection components
│   │   ├── AdminOrVolunteerPages.jsx      # Admin/Volunteer routes
│   │   ├── AdminPages.jsx                 # Admin-only routes
│   │   ├── DonorPages.jsx                 # Donor routes
│   │   └── ProtectedRoute.jsx             # General protected routes
│   ├── Utilities/              # Utility functions
│   │   ├── ToastMessage.jsx   # Toast notification utility
│   │   └── UploadImage.js      # Image upload utility
│   ├── Router.jsx              # React Router configuration
│   ├── main.jsx                # Application entry point
│   └── index.css               # Global styles
├── eslint.config.js            # ESLint configuration
├── index.html                  # HTML template
├── package.json                # Dependencies and scripts
├── vite.config.js              # Vite configuration
└── README.md                   # Project documentation
```

---

## 🎨 Key Features

### Authentication System
- Secure user registration with email/password
- Firebase Authentication integration
- Protected routes with role-based access
- User session management

### Donation Request Management
- Create, view, edit, and delete donation requests
- Status tracking (pending → inprogress → done/canceled)
- Location-based filtering (district/upazila)
- Pagination for large datasets
- Status-based filtering

### Search Functionality
- Search donors by blood group and location
- PDF export of search results
- Real-time search results

### User Management (Admin)
- View all users in tabular format
- Change user roles (donor → volunteer → admin)
- Block/unblock users
- Filter users by status

### Dashboard Features
- Role-specific dashboards
- Statistics cards (users, funding, requests)
- Analytics charts (Admin: pie chart for donation request status overview)
- Recent requests display
- Quick actions and navigation

### Responsive Design
- Mobile-first approach
- Horizontal scrolling for tables on mobile
- Responsive sidebar navigation
- Optimized for all screen sizes

### UI/UX Enhancements
- Loading states for async operations
- Toast notifications for user feedback
- SweetAlert2 for confirmations
- Custom 404 error page
- Form validation
- Image upload with ImageBB

---

## 👥 User Roles

### 🌐 Admin
- Full access to all features
- User management (view, block/unblock, change roles)
- Manage all donation requests
- View statistics and funding information
- Edit and delete any donation request

### 🩸 Donor
- Register and maintain profile
- Create donation requests
- View own donation requests
- Edit and delete own requests
- Search for donors
- Respond to donation requests
- Update request status (inprogress → done/canceled)

### 🤝 Volunteer
- View all donation requests
- Update donation request status only
- View statistics and funding information
- Cannot edit or delete requests
- Cannot manage users

---

## 🚀 Deployment

### Client Deployment
- **Platform**: Netlify / Vercel / Surge / Firebase Hosting
- **SPA Routing**: Configure redirects for client-side routing
- **Environment Variables**: Add all environment variables in deployment platform
- **Firebase Auth**: Add deployment domain to Firebase authorized domains

### Server Deployment
- **Platform**: Vercel / Render / Railway
- **CORS**: Configure CORS to allow client domain
- **Environment Variables**: Add MongoDB URI and JWT secret

### Important Deployment Notes
- ✅ Ensure server is working on production (no CORS/404/504 errors)
- ✅ Live link should work perfectly without errors
- ✅ No errors on page reload from any route
- ✅ Add domain to Firebase authorized domains
- ✅ Logged-in users should not redirect to login on reloading private routes

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -m 'Add YourFeature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a Pull Request

---

## 🔮 Future Scope

- [ ] Stripe payment integration for funding
- [ ] Email notifications for donation requests
- [ ] Push notifications for mobile users
- [ ] Daily/weekly/monthly donation request statistics charts
- [ ] Donor rating and review system
- [ ] Blood donation history tracking
- [ ] Multi-language support
- [ ] Dark mode toggle
- [ ] Advanced search filters
- [ ] Donation request reminders
- [ ] Social media integration
- [ ] Mobile app development

---

## 📝 Notes

- No Lorem Ipsum or default alerts used
- SPA routing ensures no errors on reload
- All CRUD actions use toast/SweetAlert notifications
- Responsive and modern UI design
- Secure authentication with Firebase
- Role-based access control implemented
- Image upload using ImageBB
- PDF generation for search results
- Pagination implemented where necessary
- Status filtering for requests and users

---

## 📄 License

This project is private and not licensed for public use.

---

## 👤 Author

**Samiun Auntor**

- GitHub: [@SamiunAuntor](https://github.com/SamiunAuntor)
- Server Repository: [Blood Bridge Server](https://github.com/SamiunAuntor/PH-Assignment-11_Blood-Bridge_Server)

---

**Built with ❤️ using Node, Express, React, Vite, Firebase, and MongoDB**

---


## ⚠️ Important Reminders

- Ensure all environment variables are properly configured
- Add your deployment domain to Firebase authorized domains
- Test all routes for proper reload behavior
- Verify CORS configuration on server
- Ensure no console errors in production
- Test responsive design on multiple devices
