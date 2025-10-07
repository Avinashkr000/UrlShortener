# 🚀 AI-Powered URL Shortener (Spring Boot + MySQL + Redis + Docker)

A **production-grade URL Shortener App** built using **Spring Boot 3, Java 17, MySQL 8, Redis, Docker**, and **Swagger UI** for API documentation.

This project is part of my backend portfolio — designed with **clean architecture, caching, and containerized microservices setup**.

---

## 🧠 Features

- 🔗 Generate short URLs instantly
- ♻️ Redirect original URLs efficiently
- ⏱️ Expiration support for links
- 💾 Redis caching for high performance
- 🐳 Full Docker Compose setup (MySQL + Redis + App)
- 🧩 Flyway-ready database versioning
- 📜 Swagger API documentation (auto generated)
- 🧰 Built with Maven, Java 17, and Spring Boot 3.3.x

---

## 🏗️ Project Architecture

      ┌────────────────────────┐
      │      User / Client      │
      └────────────┬────────────┘
                   │
                   ▼
          ┌────────────────┐
          │  Spring Boot   │
          │  URL Shortener │
          └────────────────┘
           │       │
     ┌─────┘       └──────┐
     ▼                    ▼

┌──────────────┐ ┌────────────┐
│ MySQL 8.0 │ │     Redis │
│ (Persistent) │ │ (In-memory)│
└──────────────┘ └────────────┘

---

## ⚙️ Tech Stack

| Layer | Technology |
|-------|-------------|
| Backend | Java 17, Spring Boot 3.3.x |
| Database | MySQL 8.0 |
| Cache | Redis |
| Build Tool | Maven |
| Containerization | Docker, Docker Compose |
| Documentation | Swagger / OpenAPI |
| ORM | Spring Data JPA (Hibernate) |

---

## 🚀 How to Run

### 🧩 Option 1 — Run with Docker (recommended)

```bash
docker-compose down -v        # Clean previous containers
docker-compose up --build     # Build and start services



# The app will be available at http://localhost:8080
```         

## Then open:

Swagger UI: http://localhost:8080/swagger-ui.html

App Health Check: http://localhost:8080/actuator/health

MySQL: localhost:3307 (user: root / pass: yourpassword)

Redis: localhost:6379



🧰 Option 2 — Run locally (without Docker)

Make sure MySQL and Redis are running locally.

Update src/main/resources/application.properties:

spring.datasource.url=jdbc:mysql://localhost:3306/url_shortener?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=yourpassword
spring.redis.host=localhost
spring.redis.port=6379
spring.jpa.hibernate.ddl-auto=update
spring.flyway.enabled=false


Run with Maven:

mvn clean package
mvn spring-boot:run

The app will be available at http://localhost:8080

Then open:
Swagger UI: http://localhost:8080/swagger-ui.html
App Health Check: http://localhost:8080/actuator/health
MySQL: localhost
Redis: localhost
---
## 🛠️ API Endpoints
🧪 Test API Endpoints
Method	Endpoint	Description
POST	/api/shorten	Create a short URL
GET	/{shortCode}	Redirect to original URL
GET	/api/all	List all shortened URLs
DELETE	/api/{shortCode}	Delete a URL entry
📦 Docker Services Overview
Service	Description	Port
urlshortener-app	Spring Boot REST API	8080
urlshortener-mysql	MySQL Database	3307
urlshortener-redis	Redis Cache	6379
🧑‍💻 Developer Notes

✅ Health checks ensure MySQL is ready before the app starts.

✅ Hibernate dialect is fixed to MySQL8Dialect.

✅ Flyway migration is disabled by default (can be enabled later).

✅ Application logs are printed at DEBUG level for com.avinash.

🏁 Resume Description
🔹 Short Version (for LinkedIn / Resume)

Java Backend Developer Project: Designed and implemented a full-stack URL Shortener system using Spring Boot, MySQL, Redis, and Docker. Integrated caching and health checks for optimized performance.

🔹 Long Version (for Portfolio / Interview)

Developed a production-ready URL Shortener service using Spring Boot 3 and Java 17. Implemented REST APIs for URL generation, caching with Redis, and persistent storage with MySQL. Configured Docker Compose for containerized deployment (App + MySQL + Redis). Added Swagger documentation, health checks, and Hibernate ORM optimizations for high reliability.

📸 Example API Response
{
"originalUrl": "https://www.github.com",
"shortUrl": "http://localhost:8080/xyz123",
"expiryDate": "2025-11-07T00:00:00"
}

🧰 Tools Used

IDE: Spring Tool Suite (STS)

Database Client: DBeaver / MySQL Workbench

API Testing: Postman

Version Control: Bitbucket + SourceTree

Project Management: Jira (Scrum)

Terminal: MobaXterm (for Linux practice)

## ✨ Author

👨## ‍💻 Avinash Kumar
## Backend Developer | Java | Spring Boot | REST APIs
## 📧 ak749299.ak@gmail.com

## 🌐 https://github.com/Avinashkr000/UrlShortener