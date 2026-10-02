# Architecture Note & System Design

## 1. Executive Summary
This document outlines the architectural decisions, trade-offs, and design patterns implemented for the **Ajaia AI-Native Document Editor**. The application is designed as a lightweight, full-stack productivity tool focusing on rapid iteration, reliable persistence, and an intuitive editing experience.

---

## 2. Tech Stack & Infrastructure

| Layer | Technology | Justification |
| :--- | :--- | :--- |
| **Frontend Framework** | Next.js 14+ (App Router) | Server-side rendering (SSR), integrated REST API routes, and optimized client navigation. |
| **Rich Text Editor** | Tiptap (Headless ProseMirror) | Modular extension system, clean HTML output, and full styling control via Tailwind CSS. |
| **UI & Icons** | Tailwind CSS + Lucide React | Utility-first, responsive styling with clean UI iconography. |
| **Database** | SQLite | Zero-configuration file-based relational database ideal for local development and rapid evaluation. |
| **ORM** | Prisma | Type-safe database queries, declarative schema migrations, and seamless TypeScript integration. |

---

## 3. System Data Architecture

### Entity Relationship Model

The system utilizes a single relational `Document` entity optimized for document storage, dynamic sharing, and user visibility separation.

```prisma
model Document {
  id        String   @id @default(uuid())
  title     String
  content   String
  owner     String   @default("User (You)")
  isShared  Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}