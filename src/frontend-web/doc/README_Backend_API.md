
# 🐎 EquineLead - Backend API

Backend API for the EquineLead Growth Engine project.

This API is built using ASP.NET Core Web API (.NET 8) and is responsible for managing lead capture, scoring, and data storage.

---

# 📌 Project Context

## Problem

Businesses in the equestrian niche struggle to identify and capture high-value leads.  
The industry is fragmented, making it expensive to reach both individual owners (B2C) and stable managers or wholesalers (B2B).

## Solution

This backend API powers the Growth Engine system that:

- Captures leads
- Scores potential buyers
- Identifies high-value opportunities
- Prepares data for automated funnels and scraping systems

---

# 🏗 Tech Stack

- .NET 8
- ASP.NET Core Web API
- Entity Framework Core
- PostgreSQL
- Swagger (OpenAPI)

---

# 📂 Project Structure

EquineLead.API
│
├── Controllers  
├── Models  
├── DTOs  
├── Services  
├── Data  
├── Repositories  
└── Common  

---

# 🚀 Getting Started

## 1️⃣ Prerequisites

- .NET 8 SDK
- PostgreSQL
- Visual Studio 2022 (recommended)

Verify .NET installation:

dotnet --version

---

# 🗄 Database Configuration

Update appsettings.json:

"ConnectionStrings": {
  "DefaultConnection": "Host=localhost;Port=5432;Database=equinelead;Username=postgres;Password=yourpassword"
}

Make sure PostgreSQL is running.

---

# 🧱 Running Migrations

Using Package Manager Console:

Add-Migration InitialCreate  
Update-Database

Or using CLI:

dotnet ef migrations add InitialCreate  
dotnet ef database update

---

# ▶ Running the API

Run from Visual Studio or:

dotnet run

Swagger UI:

https://localhost:5001/swagger

---

# 📦 Lead Model

Fields:

- Id
- FullName
- Email
- Phone
- Vertical (Events, Services, Horses, Equipment)
- EstimatedBudget
- Score
- CreatedAt

---

# 🧠 Lead Scoring Logic

- +50 points → Budget ≥ 50,000
- +20 points → Budget ≥ 2,000
- +10 points → Phone provided
- +20 points → Vertical = Horses

This allows detection of high-value leads.

---

# 🔌 API Endpoints

## Create Lead
POST /api/leads

Example Body:

{
  "fullName": "John Doe",
  "email": "john@email.com",
  "phone": "123456789",
  "vertical": "Horses",
  "estimatedBudget": 60000
}

## Get All Leads
GET /api/leads

---

# 🌱 Growth Vision

This API is the foundation of the EquineLead Growth Engine:

Turning a casual browser into a qualified high-value lead.
