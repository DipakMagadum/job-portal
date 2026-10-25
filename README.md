# Job Portal & Recruitment Management System

A full-stack job portal built with **Django REST Framework** (backend API) and
**React** (frontend SPA), covering three role-based modules: **Student**,
**Recruiter**, and **Admin**.

---
## 🚀 Live Links

🌐 Frontend: https://job-portal-s3wy.vercel.app

⚙️ Backend API: https://job-portal-197b.onrender.com

## ✅ Features

- JWT-based Student & Recruiter registration/login
- Recruiter-owned Company profiles (with admin approval workflow)
- Job posting, editing, closing/reopening
- Job search with filters (location, job type, keyword, skills)
- Apply for jobs with cover letter + PDF resume upload
- Track application status (Applied → Shortlisted → Interview → Selected/Rejected)
- Recruiter dashboard: manage jobs & review applicants, update statuses
- Admin dashboard: platform stats, approve companies, suspend/reinstate users
- REST APIs for everything, built with Django REST Framework

## 🛠 Tech Stack

- **Backend:** Python, Django, Django REST Framework, SimpleJWT, django-filter
- **Frontend:** React.js, React Router, Axios
- **Database:** MySQL (SQLite by default for zero-setup local dev — see below)
- **Auth:** JWT (access + refresh tokens)
- **Tools:** Git & GitHub, Postman (for API testing)

---

## 📁 Project Structure

```
job_portal/
├── backend/                 # Django + DRF API
│   ├── job_portal/          # Project settings, urls
│   ├── accounts/            # Custom User, StudentProfile, RecruiterProfile, auth & admin views
│   ├── companies/           # Company model, approval workflow
│   ├── jobs/                # Job postings, search/filter
│   ├── applications/        # Job applications & status pipeline
│   ├── manage.py
│   ├── requirements.txt
│   └── .env.example
│
└── frontend/                 # React SPA
    ├── src/
    │   ├── api/               # axios client + endpoint functions
    │   ├── context/           # AuthContext (JWT session, role)
    │   ├── components/        # Navbar, ProtectedRoute, StatusPill/Pipeline
    │   ├── pages/              # Student / Recruiter / Admin pages
    │   └── styles/global.css
    └── package.json
```

---

## 🚀 Backend Setup (Django)

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

pip install -r requirements.txt

cp .env.example .env            # defaults to SQLite, works out of the box

python manage.py migrate
python manage.py createsuperuser   # create an admin login
python manage.py runserver
```

The API will be running at **http://127.0.0.1:8000/api/**.
Django admin is at **http://127.0.0.1:8000/admin/**.

> The superuser you create with `createsuperuser` is a Django superuser —
> to also make it show up correctly in the Admin dashboard's role checks,
> set its `role` field to `ADMIN` from `/admin/` (Users → your user → Role Info).

### Switching to MySQL

The tech stack calls for MySQL. By default the project uses SQLite so it
runs instantly with zero setup. To switch to MySQL:

```bash
mysql -u root -p -e "CREATE DATABASE job_portal_db CHARACTER SET utf8mb4;"
```

Edit `backend/.env`:
```
USE_MYSQL=True
MYSQL_DATABASE=job_portal_db
MYSQL_USER=root
MYSQL_PASSWORD=yourpassword
MYSQL_HOST=localhost
MYSQL_PORT=3306
```

Then re-run migrations:
```bash
pip install mysqlclient   # already in requirements.txt
python manage.py migrate
```

---

## 💻 Frontend Setup (React)

```bash
cd frontend
npm install
npm start
```

The app runs at **http://localhost:3000** and talks to the API at the URL
configured in `frontend/.env` (`REACT_APP_API_BASE_URL`, defaults to
`http://127.0.0.1:8000/api`).

---

## 🧪 Trying it out

1. Start the backend (`python manage.py runserver`) and frontend (`npm start`).
2. Go to `http://localhost:3000/register` and create a **Recruiter** account.
3. As the recruiter, go to **Company** and create your company profile.
4. Log in as an **Admin** (your Django superuser, with `role=ADMIN`) at
   `/admin/companies` and approve the company.
5. Back as the recruiter, post a job from **My Jobs → Post a job**.
6. Register a **Student** account, browse `/jobs`, and apply.
7. As the recruiter, open the job's **Applicants** view and move the
   application through the pipeline (Shortlisted → Interview → Selected).
8. The student sees the live status update on **My Applications**.

---

## 📬 REST API Overview (for Postman)

Base URL: `http://127.0.0.1:8000/api`

| Endpoint | Method | Description |
|---|---|---|
| `/auth/register/` | POST | Register a student or recruiter |
| `/auth/login/` | POST | Login, returns JWT access/refresh + user info |
| `/token/refresh/` | POST | Refresh an expired access token |
| `/auth/me/` | GET/PATCH | View/update your own profile |
| `/auth/resume/upload/` | POST | Upload resume PDF (student) |
| `/auth/admin/stats/` | GET | Platform-wide stats (admin) |
| `/auth/admin/users/` | GET | List users, filter by `?role=` (admin) |
| `/auth/admin/users/<id>/toggle-active/` | POST | Suspend/reinstate a user (admin) |
| `/companies/` | GET/POST | List / create companies |
| `/companies/<id>/` | GET/PATCH | Company detail / update |
| `/companies/<id>/approve/` | POST | Approve a company (admin) |
| `/jobs/` | GET/POST | Search jobs (`?q=`, `?location=`, `?job_type=`) / post a job (recruiter) |
| `/jobs/?mine=true` | GET | Recruiter's own postings |
| `/jobs/<id>/` | GET/PATCH/DELETE | Job detail / update / close |
| `/applications/` | GET/POST | List your applications / apply to a job |
| `/applications/<id>/update_status/` | PATCH | Update applicant status (recruiter) |
| `/applications/<id>/withdraw/` | POST | Withdraw an application (student) |

All authenticated requests need the header:
`Authorization: Bearer <access_token>`

---

## 🔒 Roles & Permissions Summary

| Action | Student | Recruiter | Admin |
|---|:---:|:---:|:---:|
| Register/login | ✅ | ✅ | via superuser |
| Create/manage company | — | ✅ (own) | approve any |
| Post/edit/close jobs | — | ✅ (own) | view all |
| Apply to jobs, upload resume | ✅ | — | — |
| Review applicants, update status | — | ✅ (own jobs) | view all |
| Approve companies, suspend users | — | — | ✅ |

---

## 📝 Notes

- Resumes are limited to PDF uploads (`application/pdf`, `.pdf`).
- New companies are unapproved by default; their jobs stay hidden from
  students until an admin approves them from `/admin/companies`.
- Applying twice to the same job is blocked at the database and API level.
