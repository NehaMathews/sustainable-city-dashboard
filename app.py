import os
import sqlite3
from datetime import datetime, timezone, timedelta
from flask import Flask, jsonify, request, send_from_directory

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "sustainable_city.db")

app = Flask(__name__)

CITIES = {"Kochi", "Chennai", "Bangalore"}
ISSUE_TYPES = {
    "Waste",
    "Air Quality",
    "Water",
    "Green Space",
    "Transportation",
    "Energy",
    "Other",
}
AREAS = {"North Zone", "Central Zone", "East Zone", "West Zone", "South Zone"}
STATUSES = {"open", "review", "resolved"}


def get_db():
    connection = sqlite3.connect(DB_PATH)
    connection.row_factory = sqlite3.Row
    return connection


def init_db():
    with get_db() as db:
        db.execute(
            """
            CREATE TABLE IF NOT EXISTS reports (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                city TEXT NOT NULL,
                issue_type TEXT NOT NULL,
                area TEXT NOT NULL,
                title TEXT NOT NULL,
                description TEXT NOT NULL,
                status TEXT NOT NULL DEFAULT 'open',
                created_at TEXT NOT NULL
            )
            """
        )
        db.commit()

        count = db.execute("SELECT COUNT(*) FROM reports").fetchone()[0]
        if count == 0:
            seed_reports(db)


def seed_reports(db):
    now = datetime.now(timezone.utc)
    demo = [
        ("Kochi", "Waste", "East Zone", "Overflowing waste bin", "Waste has accumulated around a public bin.", "open", now - timedelta(days=1)),
        ("Kochi", "Green Space", "Central Zone", "Damaged roadside plants", "Several plants along the roadside appear damaged.", "review", now - timedelta(days=2)),
        ("Kochi", "Water", "West Zone", "Water leakage", "A small water leak was observed near a public area.", "resolved", now - timedelta(days=3)),
        ("Chennai", "Waste", "North Zone", "Overflowing community bin", "Waste has accumulated around a public collection point.", "open", now - timedelta(days=1)),
        ("Chennai", "Water", "Central Zone", "Water leakage", "A small water leak was observed near a public area.", "review", now - timedelta(days=2)),
        ("Chennai", "Green Space", "West Zone", "Damaged roadside plants", "Several roadside plants appear damaged.", "resolved", now - timedelta(days=3)),
        ("Bangalore", "Transportation", "Central Zone", "Traffic congestion", "Heavy traffic was observed during a peak travel period.", "open", now - timedelta(days=1)),
        ("Bangalore", "Air Quality", "East Zone", "Dust near roadwork", "Dust was noticed near an active roadwork area.", "review", now - timedelta(days=2)),
        ("Bangalore", "Green Space", "South Zone", "Green space maintenance", "A small public green area needs maintenance.", "resolved", now - timedelta(days=3)),
    ]

    db.executemany(
        """
        INSERT INTO reports
        (city, issue_type, area, title, description, status, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        """,
        [
            (city, issue, area, title, description, status, created.isoformat())
            for city, issue, area, title, description, status, created in demo
        ],
    )
    db.commit()


def report_to_dict(row):
    return {
        "id": row["id"],
        "city": row["city"],
        "type": row["issue_type"],
        "area": row["area"],
        "title": row["title"],
        "description": row["description"],
        "status": row["status"],
        "created_at": row["created_at"],
    }


@app.get("/api/health")
def health():
    return jsonify({"status": "ok", "backend": "Flask", "database": "SQLite"})


@app.get("/api/reports")
def list_reports():
    selected_city = request.args.get("city", "Kochi")
    if selected_city not in CITIES:
        return jsonify({"error": "Unknown city"}), 400

    with get_db() as db:
        rows = db.execute(
            "SELECT * FROM reports WHERE city = ? ORDER BY id DESC",
            (selected_city,),
        ).fetchall()

    return jsonify([report_to_dict(row) for row in rows])


@app.post("/api/reports")
def create_report():
    data = request.get_json(silent=True) or {}

    city = str(data.get("city", "")).strip()
    issue_type = str(data.get("type", "")).strip()
    area = str(data.get("area", "")).strip()
    title = str(data.get("title", "")).strip()
    description = str(data.get("description", "")).strip()

    if city not in CITIES:
        return jsonify({"error": "Please select a valid city."}), 400
    if issue_type not in ISSUE_TYPES:
        return jsonify({"error": "Please select a valid issue type."}), 400
    if area not in AREAS:
        return jsonify({"error": "Please select a valid area."}), 400
    if not title or len(title) > 60:
        return jsonify({"error": "Title is required and must be 60 characters or fewer."}), 400
    if not description or len(description) > 300:
        return jsonify({"error": "Description is required and must be 300 characters or fewer."}), 400

    created_at = datetime.now(timezone.utc).isoformat()

    with get_db() as db:
        cursor = db.execute(
            """
            INSERT INTO reports
            (city, issue_type, area, title, description, status, created_at)
            VALUES (?, ?, ?, ?, ?, 'open', ?)
            """,
            (city, issue_type, area, title, description, created_at),
        )
        db.commit()
        row = db.execute("SELECT * FROM reports WHERE id = ?", (cursor.lastrowid,)).fetchone()

    return jsonify(report_to_dict(row)), 201


@app.patch("/api/reports/<int:report_id>")
def update_report(report_id):
    data = request.get_json(silent=True) or {}
    status = str(data.get("status", "")).strip()

    if status not in STATUSES:
        return jsonify({"error": "Invalid report status."}), 400

    with get_db() as db:
        existing = db.execute("SELECT * FROM reports WHERE id = ?", (report_id,)).fetchone()
        if existing is None:
            return jsonify({"error": "Report not found."}), 404

        db.execute("UPDATE reports SET status = ? WHERE id = ?", (status, report_id))
        db.commit()
        row = db.execute("SELECT * FROM reports WHERE id = ?", (report_id,)).fetchone()

    return jsonify(report_to_dict(row))


@app.delete("/api/reports/<int:report_id>")
def delete_report(report_id):
    with get_db() as db:
        cursor = db.execute("DELETE FROM reports WHERE id = ?", (report_id,))
        db.commit()

    if cursor.rowcount == 0:
        return jsonify({"error": "Report not found."}), 404

    return jsonify({"message": "Report deleted."})


@app.get("/")
def index():
    return send_from_directory(BASE_DIR, "index.html")


@app.get("/<path:filename>")
def static_files(filename):
    return send_from_directory(BASE_DIR, filename)


init_db()


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)
