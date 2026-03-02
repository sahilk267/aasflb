# AutoGrowth Engine MVP v1

Multi-tenant AI-powered marketing & lead automation dashboard for local businesses.

## Tech Stack
- **Backend:** FastAPI, SQLAlchemy, Celery, Redis, PostgreSQL
- **Frontend:** React (Vite), Tailwind CSS (scaffolded)
- **Infrastructure:** Docker, Docker Compose, Nginx

## Local Development

### 1. Prerequisites
- Docker & Docker Compose installed.

### 2. Setup
1. Clone the repository.
2. Create/update a `.env` file in the root (template provided).
3. Run the services:
   ```bash
   docker-compose up --build
   ```

### 3. Access
- **Frontend:** [http://localhost](http://localhost)
- **Backend API Docs:** [http://localhost/docs](http://localhost/docs)
- **Health Check:** [http://localhost/api/health](http://localhost/api/health)

## Project Structure
- `backend/`: FastAPI application code.
- `frontend/`: React application code.
- `nginx/`: Nginx reverse proxy configuration.
- `docker-compose.yml`: Service orchestration.

## Features (v1)
- JWT Authentication & Role-based Access.
- Multi-tenancy (Users -> Businesses).
- AI Content Generator endpoint (Mocked).
- Lead Management (Manual entry & Dashboard).
- Celery Task Queue ready for scheduling.
