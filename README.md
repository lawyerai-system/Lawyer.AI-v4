# ⚖️ LAWYER.AI - Premium AI Judicial Platform

Welcome to **Lawyer.AI**, an advanced legal ecosystem designed for citizens, law students, and legal professionals. This platform leverages the power of Artificial Intelligence and high-end 3D visualizations to transform how legal tasks are handled.

---

## 🌟 Vision
Lawyer.AI aims to democratize legal access through technology, providing tools for document analysis, moot court practice, and strategic legal planning.

## 🚀 Getting Started

#### Lawyer.AI v4 (Monorepo)

The most advanced AI-powered legal assistance platform, now organized for scale.

## 📂 Project Structure
- `/client`: Frontend built with React + Vite.
- `/server`: Backend built with Node.js + Express.

## 🚀 Getting Started

1. **Install Dependencies** (from the root folder):
   ```bash
   npm install
   ```

2. **Run Everything** (Frontend & Backend):
   ```bash
   npm run dev
   ```

3. **Backend Only**:
   ```bash
   npm run server
   ```

4. **Frontend Only**:
   ```bash
   npm run client
   ```

---

## 🔐 Configuration (.env)

The application requires various environment variables to function correctly (Database, Gemini AI, Email services).

### 📍 Setup
Create an `.env` file inside the **`backend`** directory.

### 📋 Required Content Template
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_jwt_secret
JWT_EXPIRES_IN=90d
EMAIL_USER=your_email@gmail.com
EMAIL_APP_PASSWORD=your_gmail_app_password
GEMINI_API_KEY=your_google_gemini_api_key
TWILIO_AUTH_TOKEN=your_twilio_token
ACCESS_TOKEN_SECRET=your_access_token_secret
```

> [!IMPORTANT]
> Never commit your `.env` file to a public repository. It is ignored by default in our `.gitignore`.

---

## 🛠️ Running the Application

You can start both the frontend and backend simultaneously from the root directory.

### Development Mode
From the **root directory**, run:
```bash
npm run dev
```
- **Frontend**: available at `http://localhost:5173`
- **Backend API**: available at `http://localhost:5000`

---

## ✨ Core Features
- 🤖 **Legal AI Chat**: 24/7 intelligent legal assistance.
- 📄 **AI Document Analyzer**: Instant insights and risk extraction from legal PDFs.
- 🎓 **Moot Court Simulator**: Immersive AI-hosted courtroom trial practice.
- 📑 **IPC Dictionary**: Fast, searchable access to Indian Penal Code sections.
- 🧠 **Strategy Generator**: AI-driven tactical advice for cases.
- ⚖️ **Open Case Library**: Collaborative repository for shared legal research.

---

## 👩‍💻 Collaborators
- **Team**: Lawyer.AI
- **GitHub Repository**: [Lawyer.AI-v4](https://github.com/lawyerai-system/Lawyer.AI-v4)
