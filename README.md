
📝 NestJS Notes API

A simple Notes API built with NestJS and Prisma.
This project was my first step into NestJS after working with Express, and I learned a lot about structured backend development, authentication, and clean architecture.

🚀 Features

🔑 Authentication & Authorization with JWT

📧 Email verification on signup

🔄 Change email & password with token-based security

📝 Notes CRUD (Create, Read, Update, Delete)

🛡️ Validation & Guards (DTOs + custom guards)

🗑️ Delete user & cascade delete notes

📖 Swagger API Docs (/api/docs)

🗄️ Prisma ORM with MongoDb


🛠️ Tech Stack

NestJS — backend framework

Prisma — database ORM

MongoDb — database

JWT — authentication

Swagger — API documentation


1. Install dependencies

npm install

2. Configure environment

Create a .env file:

DATABASE_URL="mongodb://user:password@localhost:5432/notesdb"
JWT_SECRET="your-secret"
JWT_EXPIRE="1d"
EMAIL_USER="your@email.com"
EMAIL_PASS="yourpassword"
BASE_URL="http://localhost:3000"

3. Run database migrations

npx prisma migrate dev
npx prisma db push

4. Start the server

npm run start:dev

API runs at 👉 http://localhost:3000

Swagger docs 👉 http://localhost:3000/api/docs

📂 API Endpoints
Auth

    POST /auth/register — register new user

    POST /auth/login — login & get token

    POST /auth/verify-email?token=... — verify email

    POST /auth/forget-password — request password reset

    POST /auth/reset-password?token=... — reset password

Users

    GET /users/get-me — get profile

    POST /users/change-email/request — request email change

    POST /users/change-email — confirm email change

    PUT /users/change-password — change password

    DELETE /users/delete-user — delete account

Notes

    GET /notes — list notes

    GET /notes/:id — get single note

    POST /notes — create note

    PUT /notes/update-note/:id — update note

    DELETE /notes/delete-note/:id — delete note

📖 Learning Notes

    First project using NestJS after Express

    Learned about Modules, Guards, and Pipes , Providers , Controllers 

    Swagger integration made testing easier

    Prisma made DB handling super clean

