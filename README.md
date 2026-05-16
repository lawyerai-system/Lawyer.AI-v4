# ⚖️ LegalPal - Premium AI Legal Companion

<p align="center">
  <img src="./client/public/legalpal_logo.png" width="200" alt="LegalPal Logo">
</p>

Welcome to **LegalPal**, an advanced legal ecosystem designed to bridge the gap between complex legal systems and everyday people. Whether you are a citizen seeking clarity, a law student practicing for the courtroom, or a legal professional streamlining research, LegalPal is your intelligent companion.

---

## 🌟 Our Mission
LegalPal aims to democratize legal access through technology, providing professional-grade tools for document analysis, moot court practice, and strategic legal planning—all within a user-friendly, high-fidelity environment.

## 📂 Project Architecture
The platform is built as a high-performance monorepo for maximum scalability and developer efficiency:
- **/client**: A modern, glassmorphic frontend built with **React + Vite** and **Styled-Components**.
- **/server**: A robust, modular backend built with **Node.js + Express** and **MongoDB**.
- **/models**: Specialized ML models for legal document processing and outcome prediction.

---

## 🚀 Quick Start

1. **Install Dependencies** (from the root folder):
   ```bash
   npm install
   ```

2. **Run the Full Stack** (Frontend & Backend):
   ```bash
   npm run dev
   ```

### Individual Commands:
- **Backend Only**: `npm run server`
- **Frontend Only**: `npm run client`

---

## ✨ Core Features
- 🤖 **Legal AI Chat**: 24/7 intelligent consultation powered by cutting-edge LLMs.
- 📄 **AI Document Analyzer**: Instant risk assessment and clause extraction from legal documents.
- 🎓 **Virtual Courtroom**: Immersive AI-hosted courtroom trial practice and simulations.
- 📑 **IPC Finder**: Blazing-fast, categorized search through the Indian Penal Code.
- 🧠 **Strategy Generator**: AI-driven tactical advice for litigation and case building.
- ⚖️ **Case Library**: A collaborative, high-performance repository for legal research.

---

## 🔐 Environment Setup
Create an `.env` file inside the **`server`** directory (formerly backend) with the following variables:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email@gmail.com
EMAIL_APP_PASSWORD=your_app_password
GEMINI_API_KEY=your_google_ai_key
```

> [!IMPORTANT]
> Ensure your MongoDB connection is active before starting the server.

---

## 👩‍💻 Collaborators
- **Brand**: LegalPal (formerly Lawyer.AI)
- **GitHub Repository**: [Lawyer.AI-v4](https://github.com/lawyerai-system/Lawyer.AI-v4)

© 2026 LegalPal. Empowering justice through intelligence.
