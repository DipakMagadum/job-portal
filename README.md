# Job Portal & Recruitment Management System

A full-stack job portal that connects students with recruiters through a single platform. Students can explore job opportunities and track their applications, while recruiters can manage company profiles, publish job openings, and review applicants. Administrators oversee platform activity, user accounts, and company approvals.

## Live Demo

* **Frontend:** [Job Portal](https://job-portal-seven-kohl-20.vercel.app)
* **Backend API:** [Django REST API](https://job-portal-backend-zq7i.onrender.com/api/jobs/)
* **Admin Panel:** [Django Admin](https://job-portal-backend-zq7i.onrender.com/admin/)

> The application is deployed using Vercel, Render, and TiDB Cloud. The backend may take a little time to respond after a period of inactivity on the free hosting plan.

## Features

### Student

* Register and log in securely using JWT authentication.
* Browse, search, and filter available jobs.
* Apply for jobs with a cover letter and PDF resume.
* Track application status.
* View and update profile information.

### Recruiter

* Register and log in.
* Create and manage company profiles.
* Post, edit, and manage job openings.
* Review applicants for posted jobs.
* Update application statuses.

### Administrator

* View platform statistics through the admin dashboard.
* Review and approve company profiles.
* View and manage user accounts.
* Suspend or reactivate users.

## Technology Stack

| Layer             | Technologies                                                |
| ----------------- | ----------------------------------------------------------- |
| Frontend          | React.js, React Router                                      |
| API Communication | Axios                                                       |
| Backend           | Python, Django, Django REST Framework                       |
| Authentication    | JSON Web Tokens (JWT)                                       |
| Database          | TiDB Cloud (MySQL-compatible), SQLite for local development |
| Static Files      | WhiteNoise                                                  |
| Deployment        | Vercel, Render                                              |
| Development Tools | Git, GitHub, Postman                                        |

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

## Getting Started

Follow these steps to run the project locally.

### Prerequisites

Make sure you have the following installed:

* Python 3.12
* Node.js and npm
* Git

For local MySQL development, you will also need a MySQL-compatible database. SQLite can be used for local development without installing MySQL.

### 1. Clone the Repository

```bash
git clone https://github.com/DipakMagadum/job-portal.git
cd job-portal
```

### 2. Set Up the Backend

Open a terminal and navigate to the backend directory:

```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

Create a `.env` file using `.env.example` as a reference. Configure the required environment variables for your chosen database.

Apply the database migrations:

```powershell
python manage.py migrate
```

Create an administrator account if you need access to the Django Admin panel:

```powershell
python manage.py createsuperuser
```

Start the development server:

```powershell
python manage.py runserver
```

The backend will be available at:

`http://127.0.0.1:8000`

### 3. Set Up the Frontend

Open a second terminal from the project root:

```powershell
cd frontend
npm install
```

Create a frontend `.env` file and configure the backend API URL:

```env
REACT_APP_API_BASE_URL=http://127.0.0.1:8000/api
```

Start the frontend development server:

```powershell
npm start
```

The frontend will be available at:

`http://localhost:3000`

## API Endpoints

The backend exposes REST API endpoints for authentication and the main application features.

| Endpoint              | Purpose                                   |
| --------------------- | ----------------------------------------- |
| `/api/auth/`          | Authentication and account-related routes |
| `/api/companies/`     | Company profile operations                |
| `/api/jobs/`          | Job listing and management                |
| `/api/applications/`  | Job application operations                |
| `/api/token/refresh/` | Refresh JWT access tokens                 |

The exact operations available at each endpoint depend on the configured Django URL routes and permissions.

### Authentication

Authenticated API requests use a JWT access token in the request header:

```http
Authorization: Bearer <access_token>
```

## Application Workflow

1. Students and recruiters register for an account.
2. Recruiters create company profiles.
3. Administrators review company profiles for approval.
4. Approved recruiters publish job openings.
5. Students browse available jobs and submit applications.
6. Recruiters review applications and update their statuses.
7. Students track the progress of their applications.

## Database Configuration

The project supports SQLite for local development and MySQL-compatible databases through environment-based configuration.

The deployed application uses TiDB Cloud, which provides a MySQL-compatible database service.

Before deploying to a different environment, configure the database connection and apply all required Django migrations.

**Security:** Keep database credentials, Django secret keys, and other sensitive configuration in environment variables. Never commit `.env` files or production secrets to GitHub.

## Deployment

The application is deployed as separate frontend and backend services:

* **Frontend:** Vercel
* **Backend:** Render
* **Database:** TiDB Cloud

The frontend uses `REACT_APP_API_BASE_URL` to communicate with the backend API. Configure the production API URL in the frontend hosting environment and allow the deployed frontend origin in Django's CORS settings.

## Future Improvements

* Add automated tests for authentication, job management, and applications.
* Improve error handling and form validation.
* Add pagination and advanced job filters.
* Expand deployment monitoring and API documentation.

---

Built as a full-stack project to practise frontend development, REST API integration, authentication, database management, and deployment.
