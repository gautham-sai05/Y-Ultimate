# Y‑Ultimate Platform

This repository is a complete, production-ready platform for youth Ultimate Frisbee coaching, tournament management, and live scoring, built on a vanilla HTML/CSS/JS frontend and a FastAPI/PostgreSQL backend.

---

## One-Step Setup & Run

**Step 1:**  
Clone the repository, set up your backend (with FastAPI, PostgreSQL, RBAC, JWT), configure the API endpoint (`API_BASE`) in `js/config.js`, and serve the frontend as static files. Everything else is ready out of the box.

---

## Features (All Current Functionality)

### Frontend

- **Role-based Dashboards:** Coach, Parent, Volunteer, Sponsor, Player, Tournament Admin, with tailored views and actions for each.
- **Public Pages:** Homepage, live match schedule (calendar), live scores, and FAQ.
- **Children & Team Management:** List, profile, progress export (CSV/PDF), and analytics.
- **Notifications:** Real-time notification badge, dropdown, and full page, with mark-as-read and bulk actions.
- **Attendance Management:** Session and tournament attendance by coach/volunteer, with history and charts.
- **Live Scoring:** Volunteers can update scores during matches and mark attendance live; public gets real-time scoreboards.
- **LSAS Assessment:** Track and chart life skills (respect, teamwork, fair play, self-control, communication).
- **Home Visits:** Coach logs, views, and manages family/home visit notes.
- **Reports & Exports:** PDF/CSV export of children/stats for coaches and sponsors.
- **Sponsor Portal:** See all sponsored children, attendance, LSAS averages, search/filter, export lists.
- **Tournament Admin:** Manage tournaments, teams, match schedules, and daily match activity.
- **Player Dashboard:** Track goals, assists, spirit, tournaments joined/available, performance timeline.
- **Mobile-ready:** Responsive layouts and screens for all device sizes.

### Backend

- **User & Role Management:** Secure JWT login, OAuth2, RBAC, password hashing (bcrypt, truncate >72B).
- **CRUD APIs:** Full create/read/update/delete on users, teams, tournaments, matches, and attendance.
- **Tournament & Matches:** Schedule matches, assign teams/venues, update scores, track status (live, completed).
- **SQLAlchemy/PostgreSQL:** Persistent, scalable, and reliable data storage.
- **Attendance Histories:** Record and query child/team attendance.
- **Notifications Engine:** Per-role, per-user notifications, mark/read/update support.
- **Secure Middleware:** Role checks for every endpoint; protects all sensitive routes.
- **API Docs:** Live documentation at `/docs` when running the backend server.

---

## Roles & What They Can Do

- **Coach:** Manage children, track attendance, assessments, visits, analytics, export data, receive/send notifications.
- **Parent:** View their child's progress, attendance, LSAS skills, and remarks.
- **Volunteer:** Update live match scores, record player attendance, see today’s/upcoming matches, activity log.
- **Sponsor:** View sponsored children’s stats and detailed progress, export performance data, see averages.
- **Tournament Admin:** Set up and manage tournaments, schedule and oversee matches and teams, daily progress.
- **Player:** Track personal stats (goals, assists, spirit), discover/join tournaments.
- **Public:** View matches calendar, current live games, read FAQs — no login needed.

---

## Technologies Used

- **Frontend:** HTML5, CSS3, Bootstrap 5, JavaScript (ES6+), Chart.js, FullCalendar
- **Backend:** FastAPI (Python), SQLAlchemy ORM for PostgreSQL, JWT authentication, passlib/bcrypt, python-jose, uvicorn
- **Database:** PostgreSQL

---

## Instructions (Unified)

1. Clone the repository.
2. Set up and run PostgreSQL.
3. In backend folder:  
   - Create and activate Python virtualenv  
     ```
     python3 -m venv venv && source venv/bin/activate
     ```
   - Install dependencies  
     ```
     pip install -r requirements.txt
     ```
   - Set env variables (`DATABASE_URL`, `SECRET_KEY`), run DB migrations
   - Run backend:  
     ```
     uvicorn main:app --reload --port 8001
     ```
4. In frontend folder:  
   - Edit `js/config.js` to set `API_BASE` (your backend's API root)
   - Serve statically (e.g., `python -m http.server 8080`)
   - Browse to `http://localhost:8080`
5. **One instruction: Use the dashboards, public pages, and all REST API features as described above, everything else is ready to go!**

---

## Usage & Security Notes

- All passwords are hashed and truncated for bcrypt safety.
- JWT tokens are used for API calls — send as `Authorization: Bearer <token>`.
- RBAC restricts all sensitive API endpoints to the right roles.
- CORS should be enabled in FastAPI for your frontend's origin.

---

## Troubleshooting

- If you see `No module named ...`, run `pip install -r requirements.txt` in your active venv.
- If database errors: Ensure your PostgreSQL is running and accessible as per `DATABASE_URL`.
- For CORS/API issues: Match `API_BASE` in `js/config.js` to your backend and enable CORS.
- Export/PDF/CSV errors: Check backend file response headers and permissions.
- UI problems: Clear cache, check for correct static asset paths and backend responses.

---

## License

MIT

---

*Built by Team Dark Null for Tech4Good/OASIS Hackathon.*
