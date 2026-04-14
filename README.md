# 🚀 Full-Stack Job Portal System

A modern, production-ready Job Portal System built with **React, Spring Boot, and MySQL**.

## 🌐 Live Deployment Links

| Component | Platform | URL |
| :--- | :--- | :--- |
| **Frontend** | Vercel | [https://job-portal-prrm7ggig-hariom-dubeys-projects.vercel.app/](https://job-portal-prrm7ggig-hariom-dubeys-projects.vercel.app/) |
| **Backend API** | Railway | [https://zonal-youthfulness-production.up.railway.app/](https://zonal-youthfulness-production.up.railway.app/) |
| **Database** | Railway | MySQL (Managed Instance) |

---

## 🔑 Admin Credentials
To access the Administrative control panel:
- **Email**: `admin@jobportal.com`
- **Password**: `admin123`

---

## ✨ Features
- **Candidate Dashboard**: Search jobs, view details, and track applications.
- **Company Dashboard**: Post new jobs and manage recruits.
- **Admin Panel**: Complete control over Users, Companies, and Job Listings.
- **Mobile Responsive**: Fully optimized for Laptop, Tablet, and Mobile views.
- **Secure Authentication**: JWT-based session management.

---

## 🛠️ Technology Stack
- **Frontend**: React.js, Tailwind CSS, Vite.
- **Backend**: Java Spring Boot, Spring Security, JPA/Hibernate.
- **Database**: MySQL.
- **Deployment**: Vercel (Frontend) & Railway (Backend).

---

## 📂 Project Structure
```bash
├── backend/            # Spring Boot Application
├── frontend/           # React Application
├── pom.xml             # Root Maven configuration (Monorepo)
└── system.properties   # Environment configuration
```

## 🚀 How to Run Locally

### Backend:
1. Navigate to `/backend`.
2. Update `application.properties` with your MySQL credentials.
3. Run `./mvnw spring-boot:run`.

### Frontend:
1. Navigate to `/frontend`.
2. Create `.env` and set `VITE_API_BASE_URL=http://localhost:8080/api`.
3. Run `npm install` and `npm run dev`.

---
*Developed by Hariom Dubey*
