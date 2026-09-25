# Sustainable City Dashboard

A full-stack web-based dashboard for visualizing and understanding urban sustainability performance at the neighborhood level.

The Sustainable City Dashboard brings together simulated environmental and sustainability indicators into an interactive interface, helping users explore city performance, identify priority areas, view alerts, understand SDG progress, and submit local environmental reports.

> **Academic Prototype:** The sustainability indicator, historical, heat-risk, recommendation, CO₂, and SDG values used in this project are simulated demonstration data and are not official municipal measurements.

## Live Website

**[Sustainable City Dashboard](https://sustainable-city-dashboard.onrender.com/)**

### Backend Health Check

**[API Health Check](https://sustainable-city-dashboard.onrender.com/api/health)**

---

## Project Overview

Urban sustainability involves multiple interconnected areas such as energy consumption, air quality, transportation, waste management, water resources, and green spaces.

The Sustainable City Dashboard provides a centralized interface for exploring these areas at the city and neighborhood level.

The dashboard allows users to:

- View an overall sustainability score
- Explore sustainability indicators
- Compare different zones
- Analyze historical trends
- Identify priority areas
- View sustainability alerts
- Explore environmental recommendations
- Simulate the impact of planned actions
- View Sustainable Development Goal (SDG) progress
- Submit and manage citizen environmental reports
- Export selected data as CSV
- Customize dashboard preferences

The project is designed as an academic software prototype demonstrating how a digital sustainability dashboard could support urban environmental awareness and decision-making.

---

## Objectives

The main objectives of the project are to:

1. Provide a centralized view of urban sustainability indicators.
2. Present sustainability performance at the neighborhood level.
3. Help users identify areas that require attention.
4. Provide actionable sustainability recommendations.
5. Allow citizens to report local environmental issues.
6. Present alerts based on sustainability indicator thresholds.
7. Connect sustainability indicators with relevant SDG goals.
8. Demonstrate how a web application can combine data visualization with citizen participation.

---

## Key Features

### 1. Dashboard

The main dashboard provides an overview of city sustainability performance.

Features include:

- Overall sustainability score
- Best-performing zone
- Seven-day trend
- Sustainability indicator scores
- Zone-level performance
- Key insights
- Priority areas
- City selection

---

### 2. Analytics

The Analytics page provides tools for comparing sustainability performance between different zones.

Features include:

- Zone comparison
- Indicator comparison
- Historical trend visualization
- Sustainability performance analysis
- CSV data export

---

### 3. City Map

The City Map provides a schematic visualization of sustainability conditions across different zones.

Features include:

- Zone-level map visualization
- Switchable indicator layers
- Sustainability colour key
- Zone details
- Indicator-based exploration

---

### 4. Recommendations

The Recommendations page provides sustainability actions based on identified priority areas.

Features include:

- Ranked recommendations
- Priority-based actions
- Planned-action impact simulation
- Demonstration CO₂ calculator
- Sustainability improvement suggestions

---

### 5. Alerts & Warnings

The Alerts page identifies areas where sustainability indicators cross predefined thresholds.

The prototype uses:

- **Critical:** indicator score below 65
- **Warning:** indicator score below 70

Features include:

- Critical alerts
- Warning alerts
- Information notifications
- Alert filtering
- City-based alert views
- Saved notifications

---

### 6. Citizen Reports

The Citizen Reports module allows users to report local environmental issues.

Users can:

- Select a city
- Select an environmental issue type
- Select an affected area
- Enter a report title
- Provide a description
- Submit a report
- View submitted reports
- Filter reports by status
- Update report status
- Delete reports

Unlike the dashboard's simulated environmental indicators, citizen reports are processed through the Flask backend and stored in the SQLite database.

---

### 7. SDG Goals

The SDG Goals page connects selected sustainability indicators with relevant United Nations Sustainable Development Goals.

The prototype currently maps dashboard performance to:

- SDG 6 — Clean Water and Sanitation
- SDG 7 — Affordable and Clean Energy
- SDG 11 — Sustainable Cities and Communities
- SDG 12 — Responsible Consumption and Production
- SDG 13 — Climate Action

> SDG mapping is presented as a simplified academic model for demonstration purposes.

---

### 8. Settings

The Settings page provides basic dashboard preferences.

Features include:

- Dark mode
- Notification settings
- City selection
- Zone-score CSV export
- Reset local preferences

Browser `localStorage` is used for dashboard preferences and notifications.

---

## System Architecture

The project uses a lightweight full-stack architecture:

```text
                    ┌───────────────────────┐
                    │       User            │
                    └───────────┬───────────┘
                                │
                                ▼
                    ┌───────────────────────┐
                    │  HTML / CSS / JS      │
                    │      Frontend         │
                    └───────────┬───────────┘
                                │
                         REST API Requests
                                │
                                ▼
                    ┌───────────────────────┐
                    │    Flask Backend      │
                    │       app.py          │
                    └───────────┬───────────┘
                                │
                                ▼
                    ┌───────────────────────┐
                    │    SQLite Database    │
                    │ sustainable_city.db   │
                    └───────────────────────┘
