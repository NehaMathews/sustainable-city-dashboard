SUSTAINABLE CITY DASHBOARD - FLASK + SQLITE VERSION

Academic prototype: a responsive sustainability dashboard using simulated city indicator data, with a small Flask + SQLite backend for Citizen Reports.

Cities (each with its own zone values, heat risk and 7-day trend):
- Kochi
- Chennai
- Bangalore

Pages:
1. Dashboard - city score, best zone, 7-day trend, indicator and zone bars, insights, priority areas.
2. Analytics - compare two zones on any indicator, historical trend, CSV export.
3. City Map - schematic zone map with switchable indicator layers, colour key and zone details.
4. Recommendations - ranked actions, planned-action impact simulator, demo CO2 calculator.
5. Alerts - threshold alerts (below 65 critical, below 70 warning) plus saved notifications.
6. Citizen Reports - submit local issues, view reports, filter by status and update report status through the backend.
7. SDG Goals - indicators mapped to selected Sustainable Development Goals.
8. Settings - dark mode, notifications on/off, city, zone-score CSV export, reset local preferences.

TECHNOLOGY
- Frontend: HTML5, CSS3, vanilla JavaScript
- Backend: Python + Flask
- Database: SQLite
- Deployment: Render + Gunicorn
- Browser localStorage: used only for dashboard preferences/notifications, not Citizen Reports

BACKEND API
- GET    /api/health
- GET    /api/reports?city=Kochi
- POST   /api/reports
- PATCH  /api/reports/<id>
- DELETE /api/reports/<id>

LOCAL RUN
1. Open a terminal in this project folder.
2. Create a virtual environment:
   python -m venv .venv
3. Activate it on Windows:
   .venv\Scripts\activate
4. Install dependencies:
   pip install -r requirements.txt
5. Start Flask:
   python app.py
6. Open:
   http://127.0.0.1:5000

IMPORTANT
- Do NOT open index.html directly for the backend version. Run app.py so the /api routes work.
- The SQLite database file (sustainable_city.db) is created automatically on first run.
- Demo citizen reports are seeded automatically the first time the database is created.
- The sustainability indicator, historical, heat-risk, recommendation, CO2 and SDG values remain simulated academic demonstration data, not official municipal measurements.

RENDER DEPLOYMENT
Build Command:
   pip install -r requirements.txt

Start Command:
   gunicorn app:app

The project can be connected to a GitHub repository and deployed as a Render Web Service. Render provides a public onrender.com URL for the service.

NOTE ABOUT SQLITE ON FREE CLOUD HOSTING
SQLite is intentionally used because this is a simple academic backend. On Render's free web-service filesystem, local files are not durable across certain restarts/redeployments. Therefore SQLite is suitable for demonstrating the backend/database architecture, but persistent production data would normally use a hosted PostgreSQL database.
