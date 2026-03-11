# ResumeAI — AI-Powered Resume Builder

A full-stack Resume Builder web application with AI content generation, multiple templates, and one-click PDF export.

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, TailwindCSS v3 |
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose |
| PDF Export | html2pdf.js |
| AI Assistance | OpenAI GPT or Google Gemini API |

## ✨ Features

- **Resume Creation** — Fill in name, email, phone, summary, education, work experience, skills, and projects
- **Resume Templates** — 3 templates: Classic (free), Modern (free), Premium (paid/locked)
- **Live Preview** — See your resume update in real-time as you type
- **Save & Edit** — Persist resumes to MongoDB and load them back anytime
- **PDF Download** — Export any free-template resume as a high-quality PDF
- **AI Assist**:
  - 🤖 **Generate Summary** — Auto-write a professional summary based on your profile
  - ✨ **Improve Experience** — Rewrite job descriptions with strong action verbs
  - 💡 **Suggest Skills** — Get 10 relevant skill suggestions based on your role
- **Upgrade Prompt** — Template 3 is locked with a premium upgrade CTA

## 📁 Project Structure

```
resume-builder/
├── backend/
│   ├── models/
│   │   └── Resume.js          # Mongoose schema
│   ├── routes/
│   │   ├── resume.js          # CRUD routes
│   │   └── ai.js              # AI generation routes
│   ├── server.js              # Express server entry point
│   ├── .env                   # Environment variables
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── ResumeForm.jsx          # Full form with all fields
    │   │   ├── ResumePreview.jsx       # Template renderer
    │   │   ├── TemplateSelector.jsx    # Template switcher UI
    │   │   └── templates/
    │   │       ├── Template1.jsx       # Classic layout
    │   │       ├── Template2.jsx       # Two-column modern
    │   │       └── Template3.jsx       # Premium locked
    │   ├── pages/
    │   │   ├── HomePage.jsx            # Landing page + saved resumes
    │   │   └── BuilderPage.jsx         # Main builder UI
    │   ├── utils/
    │   │   ├── api.js                  # Axios API client
    │   │   └── pdfDownload.js          # html2pdf.js wrapper
    │   ├── App.jsx
    │   └── main.jsx
    ├── tailwind.config.js
    └── package.json
```

## ⚙️ Setup Instructions

### Prerequisites
- Node.js v18+
- MongoDB (local or MongoDB Atlas)

### 1. Clone & Install

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Configure Backend Environment

Edit `backend/.env`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/resumebuilder

# Choose ONE AI provider:
# Option A — OpenAI
OPENAI_API_KEY=your_openai_api_key_here
AI_PROVIDER=openai

# Option B — Google Gemini
# GEMINI_API_KEY=your_gemini_api_key_here
# AI_PROVIDER=gemini
```

### 3. Start the Application

**Backend** (Terminal 1):
```bash
cd backend
npm start
# Server runs on http://localhost:5000
```

**Frontend** (Terminal 2):
```bash
cd frontend
npm run dev
# App runs on http://localhost:5173
```

### 4. Open in Browser

Navigate to `http://localhost:5173`

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/resume/create` | Create a new resume |
| GET | `/api/resume/:id` | Get resume by ID |
| PUT | `/api/resume/update/:id` | Update resume by ID |
| GET | `/api/resume/` | List all resumes |
| DELETE | `/api/resume/:id` | Delete a resume |
| POST | `/api/ai/generate-summary` | Generate AI summary |
| POST | `/api/ai/improve-experience` | Improve job description |
| POST | `/api/ai/suggest-skills` | Suggest relevant skills |

## 📋 MongoDB Resume Schema

```js
{
  name: String,         // required
  email: String,        // required
  phone: String,
  location: String,
  linkedin: String,
  website: String,
  summary: String,
  education: [{ institution, degree, field, startYear, endYear, gpa }],
  experience: [{ company, position, startDate, endDate, current, description }],
  skills: [String],
  projects: [{ name, description, technologies, link }],
  template: Number,     // 1 | 2 | 3
  timestamps: true
}
```

## 💡 Assumptions

1. **AI Provider**: The app defaults to OpenAI. To use Gemini, set `AI_PROVIDER=gemini` in `.env`. Both providers use the same request/response interface via the backend abstraction layer.
2. **Template 3 is locked** on the frontend and will refuse PDF export — actual payment integration is out of scope.
3. **Authentication** is not implemented — the app is single-user or shared (can be extended with JWT).
4. **MongoDB** must be running locally, or `MONGODB_URI` must be set to an Atlas connection string.
5. **CORS** is open (`*`) — restrict in production environments.

## 🛠️ Development Scripts

```bash
# Frontend
npm run dev      # Start dev server
npm run build    # Production build
npm run preview  # Preview production build

# Backend
npm start        # Production start
npm run dev      # With nodemon (install: npm i -D nodemon)
```
