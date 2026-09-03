# 📄 AI-Powered Resume Builder (Full-Stack MERN Application)

A modern, responsive, full-stack AI-assisted Resume Builder application built with **React 19**, **Vite**, **Tailwind CSS**, **Node.js**, **Express**, **MongoDB**, and **Google Gemini / OpenAI**. 

Users can build ATS-friendly resumes, import existing PDF resumes, leverage AI to polish summaries and bullet points, customize templates & themes in real-time, and download or share their resumes publicly.

---

## 🌟 Key Features

### 🤖 AI Assistance & Smart Parsing
- **AI Summary Enhancer**: Automatically generate and refine punchy, professional summaries using generative AI.
- **AI Job Description Optimizer**: Enhance bullet points and work experiences to be more impactful and action-oriented.
- **PDF Resume Upload & Auto-Fill**: Extract text from existing PDF resumes using `react-pdftotext` and have AI parse sections directly into your form.

### 🎨 Customization & Templates
- **Multiple Professional Templates**:
  - **Classic Template**: Traditional, ATS-compliant formatting suitable for corporate roles.
  - **Modern Template**: Clean sidebar layout with dynamic accent colors.
  - **Minimal Template**: Sleek, distraction-free typography-first design.
  - **Minimal with Image**: Modern card layout with profile picture integration.
- **Dynamic Accent Color Picker**: Choose custom colors to personalize headers, icons, and borders.
- **Profile Photo Upload**: Secure image processing and hosting via **ImageKit**.

### 💼 Comprehensive Resume Management
- **Interactive Multi-Section Form**:
  - Personal Information & Contact Details
  - Professional Summary
  - Work Experience (with multiple bullet points & role details)
  - Education & Academic Background
  - Key Skills & Competencies
  - Projects with live links and descriptions
- **Live Real-time Preview**: Instant visual updates as you type.
- **Download as PDF**: Browser-native print-to-PDF formatting.
- **Public Shareable Links**: Generate public URLs (`/preview/:id`) for sharing directly with recruiters or clients.

### 🔐 Authentication & Security
- **JWT-Based Authentication**: Secure registration and login workflows with token protection.
- **Password Reset via Email OTP**: Password recovery using **Nodemailer** for email verification.
- **Protected Endpoints**: Middleware route protection for personal resume data.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [React 19](https://react.dev/) with [Vite](https://vitejs.dev/)
- **State Management**: [@reduxjs/toolkit](https://redux-toolkit.js.org/) & [react-redux](https://react-redux.js.org/)
- **Routing**: [React Router v7](https://reactrouter.com/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Notifications**: [React Hot Toast](https://react-hot-toast.com/)
- **PDF Extraction**: [react-pdftotext](https://www.npmjs.com/package/react-pdftotext)
- **HTTP Client**: [Axios](https://axios-http.com/)

### Backend
- **Runtime**: [Node.js](https://nodejs.org/) (ES Modules)
- **Framework**: [Express 5](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) via [Mongoose](https://mongoosejs.com/)
- **AI Integration**: [OpenAI SDK](https://www.npmjs.com/package/openai) (compatible with Google Gemini API endpoint)
- **File Uploads & Media CDN**: [Multer](https://www.npmjs.com/package/multer) + [ImageKit](https://imagekit.io/)
- **Security & Utilities**: `jsonwebtoken`, `bcrypt`, `cors`, `dotenv`, `nodemailer`

---

## 📁 Project Structure

```text
React-Project/
├── client/                      # Frontend Application (React + Vite)
│   ├── assets/                  # Static assets & Resume Templates
│   │   └── templates/           # Classic, Modern, Minimal, MinimalImage
│   ├── src/
│   │   ├── app/                 # Redux store & slices
│   │   ├── components/          # Form components, Navbar, ColorPicker, etc.
│   │   ├── config/              # Axios API client setup
│   │   ├── pages/               # Dashboard, ResumeBuilder, Preview, Login, ForgotPass
│   │   ├── App.jsx              # Application router & layout
│   │   ├── index.css            # Tailwind & global CSS
│   │   └── main.jsx             # React DOM entry point
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── server/                      # Backend API (Node.js + Express)
│   ├── config/                  # DB, AI (Gemini/OpenAI), ImageKit, Multer configs
│   ├── controllers/             # UserController, resumeController, aiController
│   ├── middleware/              # Auth middleware (JWT protect)
│   ├── model/                   # User & Resume Mongoose schemas
│   ├── routes/                  # userRoutes, resumeRouter, aiRoutes
│   ├── utils/                   # Helper functions (email generation, token helpers)
│   ├── package.json
│   └── server.js                # Express app entry point
│
├── package.json                 # Monorepo / root scripts (concurrent dev runner)
└── README.md
```

---

## ⚙️ Environment Variables

### Server (`server/.env`)

Create a `.env` file in the `server/` directory:

```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLIENT_URL=http://localhost:5173

# Gemini / OpenAI API
GEMINI_API_KEY=your_gemini_or_openai_api_key
GEMINI_BASE_URL=https://generativelanguage.googleapis.com/v1beta/openai/

# ImageKit Configuration (for profile image uploads)
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint

# Email / Nodemailer (for OTP password recovery)
SENDER_EMAIL=your_email@gmail.com
SENDER_PASSWORD=your_email_app_password
```

### Client (`client/.env` - Optional)

```env
VITE_BASE_URL=http://localhost:3000
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18+ or v22 recommended)
- **MongoDB** (Local instance or MongoDB Atlas)
- **Gemini API Key** or **OpenAI API Key**

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/React-Project.git
cd React-Project
```

### 2. Install Dependencies

#### Install Root Dependencies:
```bash
npm install
```

#### Install Client Dependencies:
```bash
cd client
npm install
cd ..
```

#### Install Server Dependencies:
```bash
cd server
npm install
cd ..
```

### 3. Run Development Server

Run both client and server concurrently using the root command:

```bash
npm run dev
```

Or run them individually:

- **Frontend**:
  ```bash
  cd client
  npm run dev
  # Accessible at http://localhost:5173
  ```

- **Backend**:
  ```bash
  cd server
  npm run dev
  # Running at http://localhost:3000
  ```

---

## 📡 API Reference Overview

### User Routes (`/api/users`)
- `POST /register` - Register a new user
- `POST /login` - User login & token generation
- `GET /data` - Fetch authenticated user profile
- `GET /resumes` - Fetch all resumes belonging to authenticated user
- `POST /forgot-password` - Request password reset OTP
- `POST /reset-password` - Reset password with OTP

### Resume Routes (`/api/resumes`)
- `POST /create` - Create a new resume
- `PUT /update` - Update resume content & upload profile picture
- `GET /get/:resumeId` - Fetch specific resume for editing
- `GET /public/:resumeId` - Public access for shared resumes
- `DELETE /delete/:resumeId` - Delete a resume

### AI Routes (`/api/ai`)
- `POST /enhance-pro-sum` - AI enhancement for professional summary
- `POST /enhance-job-desc` - AI refinement for job descriptions
- `POST /upload-resume` - AI parsing of extracted resume text into structured schema

---

## 📜 License

This project is licensed under the [ISC License](LICENSE).
