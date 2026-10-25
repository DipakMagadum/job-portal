# Job Portal & Recruitment Management System

A full-stack web application that connects students with recruiters. Students can search and apply for jobs, recruiters can manage job openings, and administrators can manage users and company approvals.

## Features

### Student

* Register and log in.
* Browse and search job openings.
* Filter jobs by relevant criteria.
* Apply for jobs with a cover letter and PDF resume.
* Track application status.
* Manage profile information.

### Recruiter

* Register and log in.
* Create and manage a company profile.
* Post, edit, and manage job openings.
* View applicants for posted jobs.
* Update application status.

### Admin

* View platform statistics.
* Review and approve company profiles.
* View and manage user accounts.
* Suspend or reactivate users.

## Tech Stack

**Frontend:** React.js, React Router, Axios
**Backend:** Python, Django, Django REST Framework
**Authentication:** JSON Web Tokens (JWT)
**Database:** SQLite / MySQL
**Tools:** Git, GitHub, Postman

## Project Structure

```text
job-portal/
├── backend/
│   ├── accounts/
│   ├── applications/
│   ├── companies/
│   ├── jobs/
│   ├── job_portal/
│   ├── manage.py
│   └── requirements.txt
│
└── frontend/
    ├── public/
    ├── src/
    │   ├── api/
    │   ├── components/
    │   ├── context/
    │   ├── pages/
    │   └── styles/
    └── package.json
```

## Requirements

* Python 3.12 or a compatible version
* Node.js and npm
* Git
* MySQL Server (when using MySQL)

## Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/DipakMagadum/job-portal.git
cd job-portal
```

### 2. Backend Setup

Open a terminal and run:

```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

Create a `.env` file using `.env.example` as a reference. Configure the database and other environment variables before running the application.

Apply migrations:

```powershell
python manage.py migrate
```

Create an administrator account:

```powershell
python manage.py createsuperuser
```

Start the backend:

```powershell
python manage.py runserver
```

Backend API:

`http://127.0.0.1:8000/api/`

Django Admin:

`http://127.0.0.1:8000/admin/`

### 3. Frontend Setup

Open a second terminal from the project root:

```powershell
cd frontend
npm install
npm start
```

Frontend:

`http://localhost:3000`

Set `REACT_APP_API_BASE_URL` in the frontend `.env` file to the backend API URL.

## Application Workflow

1. A student or recruiter registers an account.
2. A recruiter creates a company profile.
3. An administrator approves the company.
4. The recruiter publishes job openings.
5. Students browse jobs and submit applications.
6. Recruiters review applications and update their status.
7. Students track their application progress.

## API Overview

| Endpoint              | Purpose                           |
| --------------------- | --------------------------------- |
| `/api/auth/register/` | Register an account               |
| `/api/auth/login/`    | Authenticate a user               |
| `/api/auth/me/`       | View or update the user's profile |
| `/api/companies/`     | Manage company profiles           |
| `/api/jobs/`          | Browse and manage job openings    |
| `/api/applications/`  | Manage job applications           |

Authenticated requests use a JWT access token:

`Authorization: Bearer <access_token>`

## Database

The application supports SQLite for local development and MySQL through environment-based configuration.

MySQL configuration and migrations should be completed before using MySQL as the active database.

## Live Demo

Frontend: https://job-portal-s3wy.vercel.app
Backend API: https://job-portal-197b.onrender.com
