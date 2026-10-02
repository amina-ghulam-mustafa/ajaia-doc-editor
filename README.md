# Ajaia AI-Native Document Editor

A lightweight collaborative document editor built with Next.js, Tiptap, Prisma, and SQLite.

## Features
- **Rich-text Editing:** Bold, Italic, Underline, Headings (H1/H2), Bulleted/Numbered lists.
- **File Import:** Upload `.txt` or `.md` files directly into editable documents.
- **Sharing & Ownership:** Mark documents as shared and filter by owned vs shared items.
- **Persistence:** SQLite database via Prisma ORM.

## Setup & Run
```bash
npm install
npx prisma db push
npm run dev