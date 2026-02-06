# EquineLead – Data-Driven Growth Engine for the Equestrian Industry

EquineLead is an MVP platform designed to help businesses in the equestrian industry identify, qualify, and convert high-value leads using data-driven growth strategies.

The platform focuses on transforming casual visitors into qualified B2C and B2B leads through sentiment analysis, lead scoring, automation, and backend APIs.

---

## 🚨 Problem

Businesses in the equestrian niche struggle to identify and capture high-value leads.  
The industry is highly fragmented, making it expensive and inefficient to reach:

- Individual owners (B2C)
- Stable managers, wholesalers, and service providers (B2B)

---

## 🎯 Objective

Build a **Growth Engine MVP** that converts anonymous traffic into qualified leads for high-ticket products such as:

- $50,000 horses
- $2,000 saddles
- Equestrian services and events

---

## 🧠 Core MVP Features

- Lead capture system (forms, tracking)
- Sentiment analysis and intent detection
- Lead scoring engine
- Automated funnel logic
- Backend APIs
- Data scraping (optional)
- Basic analytics dashboard
- CI/CD automation

---

## 🏗 Architecture Overview

Frontend (Web / Mobile)
→ Backend API (C#)
→ ML Services (Python)
→ Rust Workers (Scraping & Processing)
→ Database
→ Jenkins CI/CD

---

## 🛠 Tech Stack

### Backend
- C# (.NET Core)

### Data Science / Machine Learning
- Python
- Sentiment Analysis
- Lead Scoring Models

### Systems
- Rust (scraping & high-performance services)

### Mobile
- Swift (iOS)
- Kotlin (Android)

### DevOps
- Jenkins
- Docker

---

## 📁 Project Structure

```bash
equine-lead/
├── ci-cd/                  # Automatización y Despliegue Continuo
│   └── jenkins/            # Configuraciones y scripts para el servidor Jenkins
├── docs/                   # Documentación técnica y de negocio
│   └── data-dictionary/    # Definiciones de variables de Scoring y negocio ecuestre
├── infrastructure/         # Configuración de la Nube (Oracle Cloud)
│   ├── docker/             # Archivos para empaquetar las APIs en contenedores
│   ├── oci-setup/          # Configuración de red (VCN) y seguridad de Oracle
│   └── terraform/          # Infraestructura como código para la instancia de OCI
├── src/                    # Código fuente del sistema (por responsabilidad)
│   ├── backend-csharp/     # Orquestador: API central, limpieza y gestión de base de datos
│   ├── data-science/       # Cerebro: Inteligencia con FastAPI, Lead Scoring y Segmentación
│   ├── mobile-apps/        # Interfaces: Aplicaciones para el equipo de ventas (Swift/Kotlin)
│   └── scrapper-rust/      # Captación: Extracción masiva de datos a alta velocidad
├── Jenkinsfile             # Archivo maestro de orquestación de la automatización
├── .gitignore              # Filtro global (Sistemas operativos, IDEs, Secretos)
└── README.md               # Guía principal del proyecto
```

---

## 👥 Team Roles

- Product Owner
- Data Science / ML Engineer
- Backend Engineer
- Systems Engineer (Rust)
- Frontend Developer
- iOS Developer
- Android Developer
- DevOps Engineer
- Growth / Marketing Specialist

---

## 🚀 Getting Started

### Backend
```bash
cd backend
dotnet restore
dotnet run
```

### ML Service
```bash
cd ml
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python app.py
```

---

## 📦 Deliverables

- Functional MVP
- GitHub Repository
- Demo
- Technical Documentation

---

## 📄 License

MIT
