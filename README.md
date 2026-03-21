# Auto-Grad

Auto-Grad is a full-stack application for creating, distributing, and grading assignments (including coding assignments). It includes a Node/Express backend that integrates with Google Cloud services and a React (Vite) frontend.

---

## Contents
- **Backend**: [Backend](Backend) — Express server, routes, controllers, Google Cloud service account files.
- **Frontend**: [my-react-app](my-react-app) — React + Vite SPA that talks to the backend.
- **Uploads**: [uploads](uploads) — stored assignment and submission files.

---

## Quick Start (local)

Prerequisites
- Node.js (v18+ recommended)
- npm or yarn
- MongoDB Atlas or local MongoDB instance

Start the backend
1. Open a terminal and go to the backend folder:

```bash
cd Backend
npm install
```

2. Create a `.env` file in `Backend/` (copy from any example if present) and set the following variables:

- `MONGODB_URI` — MongoDB connection string (required)
- `PORT` — optional, default 5000
- `GOOGLE_APPLICATION_CREDENTIALS` — (recommended) path to your Google service account JSON if you use Google Cloud services. You can also keep the provided `service-account.json` (ensure it is not publicly shared).

Example `.env`:

```
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/mydb
PORT=5000
GOOGLE_APPLICATION_CREDENTIALS=./service-account.json
```

3. Run the server (development):

```bash
npm run dev
```

The backend listens on `http://localhost:5000` by default.

Start the frontend
1. In a new terminal:

```bash
cd my-react-app
npm install
npm run dev
```

2. Open the app in the browser at the Vite-provided URL (usually `http://localhost:5173`).

If your backend runs on a different host/port, update `my-react-app/src/api.js` `baseURL` to point to the backend address.

---

## Environment / Credentials

- Backend expects `MONGODB_URI` in environment. See [Backend/config/db.js](Backend/config/db.js).
- Google Cloud credentials: there are `ai-assistance-...json` and `service-account.json` in `Backend/`. To let Google client libraries pick them up set `GOOGLE_APPLICATION_CREDENTIALS` to the JSON file path or provide credentials via your cloud provider's secret manager.
- For Vercel deployment, set the same environment variables in the Vercel project settings.

---

## API Overview

Base URL: `http://localhost:5000`

- Auth
  - `POST /api/auth/register` — register user
  - `POST /api/auth/login` — login
  - `GET /api/auth/profile` — get current user (auth required)

- Assignments
  - `GET /api/assignments` — list assignments
  - `POST /api/assignments` — create assignment (auth: teacher; supports file upload)
  - `GET /api/assignments/:id` — assignment detail
  - `GET /api/assignments/:id/download/:fileType` — download question/answer file

  - Coding assignment routes:
    - `POST /api/assignments/coding` — create coding assignment (teacher)
    - `GET /api/assignments/coding/:id` — get coding assignment by id

- Submissions
  - `POST /api/submit/assignments/:assignmentId/submissions` — upload or update a submission (student)
  - `GET /api/submit/assignments/:assignmentId/student/:studentId` — student's submission
  - `GET /api/submit/assignments/:assignmentId/submissions` — teacher: list submissions for assignment
  - `PUT /api/submit/submissions/:id/grade` — teacher grades submission
  - `GET /api/submit/submissions/:id` — submission detail
  - `GET /api/submit/submissions/:id/download` — download submission file

Refer to route files in `Backend/routes` for details and required fields.

---

## File Uploads

- Uploaded files are served statically from `/uploads` (see `server.js`).
- The repo contains an `uploads/` folder with `assignments` and `submissions` subfolders.

---

## Development notes

- Run backend in dev with `npm run dev` (nodemon). Production start: `npm start`.
- The backend is configured with `vercel.json` to be deployable on Vercel as a Node serverless function. When deploying, add environment variables through the Vercel dashboard and securely upload any service account keys.
- Frontend uses `my-react-app/src/api.js` axios instance — update `baseURL` when backend URL changes.

---

## Project Structure (high level)

- Backend/ — Node/Express API
  - `controllers/` — route handlers
  - `models/` — Mongoose schemas
  - `routes/` — Express routers
  - `middleware/` — auth, upload, error handler
  - `config/` — DB + cloud config

- my-react-app/ — React frontend (Vite)

- uploads/ — runtime file storage

---

## Deployment

- Frontend: can be deployed on Vercel or Netlify from `my-react-app` build output (`npm run build`).
- Backend: `vercel.json` present in `Backend/` — configure environment variables in Vercel and deploy the `Backend` directory as a project. Alternatively deploy to any Node host (Heroku, DigitalOcean, etc.) ensuring `MONGODB_URI` and Google credentials are available.

---

## Contributing

1. Fork and create a branch for your feature/fix.
2. Run the app locally and add tests where appropriate.
3. Open a pull request with a clear description.

---

## License

Add a license as appropriate for your project.

---

If you'd like, I can also:
- Add example `.env.example` files for Backend and Frontend
- Add scripts to `package.json` for convenience
- Create a short CONTRIBUTING.md and LICENSE file

Thanks — tell me which additional docs you'd like me to add or modify.
