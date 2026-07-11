# AI Knowledge Assistant

A production-ready AI Knowledge Assistant built using **Spring Boot** and **React**.

The application enables authenticated users to create AI conversations, upload documents, and interact with an AI service through a production-ready architecture.

The project follows modern software engineering practices including:

- Clean Architecture
- Package-by-Feature organization
- Feature-based frontend architecture
- JWT Authentication
- RESTful API design
- Flyway database migrations
- Cloud deployment
- Environment-based configuration

---

# Project Overview

The AI Knowledge Assistant is a full-stack web application built using Spring Boot and React.

It allows users to:

- Register and log in securely
- Create and manage conversations
- Chat with an AI assistant
- Upload documents
- Ask questions about uploaded documents
- View dashboard statistics
- Manage conversations and documents

The application is deployed using Railway and Vercel.

---

# Features

## Authentication

- User Registration
- User Login
- JWT Authentication
- BCrypt Password Encryption
- Protected Routes

## Conversation Management

- Create Conversation
- Rename Conversation
- Delete Conversation
- Persistent Conversation History

## AI Chat

- Chat Interface
- Context-aware Conversations
- Persistent Message History
- AI Response Pipeline

## Document Management

- Upload Documents
- View Documents
- Delete Documents
- Document Question Answering

## Dashboard

- Total Conversations
- Total Messages
- Total Uploaded Documents

## Deployment

- Backend hosted on Railway
- Frontend hosted on Vercel
- PostgreSQL hosted on Railway

---

# Technology Stack

## Backend

- Java 21
- Spring Boot 3.5
- Spring Security
- JWT Authentication
- Spring Data JPA
- Hibernate
- Flyway
- PostgreSQL
- MapStruct

## Frontend

- React 19
- Vite
- Material UI
- React Router
- Axios
- TanStack Query (React Query)
- React Hook Form
- Zod
- Zustand

## AI

- OpenAI API (Architecture Ready)
- Mock AI Responses

## Deployment

- Railway
- Vercel

---

# Architecture

The application follows a layered architecture.

```
                React + Material UI
                        │
          React Query + Axios
                        │
                  REST API
                        │
                 Spring Boot
                        │
                 Service Layer
                        │
               Repository Layer
                        │
                  PostgreSQL
```

Authentication is implemented using JWT and Spring Security.

The frontend communicates with the backend exclusively through REST APIs.

---

# Project Structure

```
ai-knowledge-assistant
│
├── frontend
│   ├── src
│   │   ├── app
│   │   ├── components
│   │   ├── features
│   │   ├── hooks
│   │   ├── layouts
│   │   ├── routes
│   │   ├── services
│   │   ├── store
│   │   └── utils
│   └── package.json
│
├── src/main/java
│   └── com/vinojinip/ai_knowledge_assistant
│       ├── auth
│       ├── chat
│       ├── dashboard
│       ├── document
│       ├── common
│       └── security
│
├── src/main/resources
│
└── README.md
```

The backend follows a package-by-feature architecture while the frontend follows a feature-based architecture for improved maintainability and scalability.

---

# Deployment

## Frontend

- https://ai-knowledge-assistance.vercel.app

## Backend

- https://ai-knowledge-assistance-production.up.railway.app

## Database

- PostgreSQL hosted on Railway

---

# API Documentation

Swagger UI

- https://ai-knowledge-assistance-production.up.railway.app/swagger-ui/index.html

---

# Security

The application implements several production-grade security practices.

- JWT Authentication
- BCrypt Password Hashing
- Spring Security
- Protected REST APIs
- CORS Configuration
- Environment-based Secrets
- Jakarta Bean Validation

---

# AI Integration

The application is designed with a production-ready AI integration layer.

## Current Implementation

- Dedicated AI service layer
- AI conversation workflow
- Document AI workflow
- REST-based AI integration architecture

## Current Limitation

During development, AI responses are generated using mocked responses because an active OpenAI billing account was not available.

The application architecture allows mocked responses to be replaced with live OpenAI responses simply by configuring a valid OpenAI API key and enabling billing.

No frontend or architectural changes are required.

---

# Environment Variables

## Backend

```properties
JWT_SECRET=your-secret

OPENAI_API_KEY=your-openai-api-key

OPENAI_MODEL=gpt-4.1-mini

FRONTEND_URL=http://localhost:5173
```

## Frontend

```properties
VITE_API_BASE_URL=http://localhost:8081/api/v1
```

---

# Running Locally

## Backend

```bash
git clone <repository-url>

cd ai-knowledge-assistant

./mvnw spring-boot:run
```

## Frontend

```bash
cd frontend

npm install

npm run dev
```

Backend

```
http://localhost:8081
```

Frontend

```
http://localhost:5173
```

---

# Known Limitations

- AI responses are currently mocked because OpenAI billing has not been enabled.
- Client-side route refresh on Vercel is currently under investigation.

---

# Future Improvements

- Live OpenAI Integration
- Streaming AI Responses
- Retrieval-Augmented Generation (RAG)
- Vector Database Integration
- Semantic Search
- Docker Compose
- Kubernetes Deployment
- CI/CD Pipeline
- Unit Tests
- Integration Tests
- End-to-End Tests

---

# Author

**Vinojini Paramasivam**

Software Engineer

- Java
- Spring Boot
- React
- PostgreSQL
- AI Integration

---

# License

This project was developed as part of a Full Stack AI Software Engineer technical assignment and is available for learning and portfolio purposes.