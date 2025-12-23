🏆 The Golden Market – Auction House (FED2 Project)

A fully functional auction website built as part of the Front-End Development 2 (FED2) course at Noroff.
The project allows users to register, log in, create auction listings, bid on items, and manage their profile, using the official Noroff Auction API.

🌍 Live Demo


📌 Project Goal

The goal of this project was to build a client-side auction platform that:

Uses a public REST API

Implements authentication

Allows CRUD operations on auction listings

Demonstrates solid JavaScript structure, state handling, and UI/UX

Follows modern front-end best practices

🚀 Live Features
🔐 Authentication

Register with a @stud.noroff.no email

Log in and store session using localStorage

Protected routes (create, edit, bid)

Automatic logout handling

🛍️ Auction Listings

View all active listings

Search by title or description

Responsive card layout

Fallback images for broken URLs

🔎 Filtering & Sorting

🔥 Hot listings (5+ bids)

⏰ Ending soon (within 24 hours)

Sort by:

Ending soon

Ending last

Highest number of bids

📄 Pagination

Client-side pagination

9 listings per page

Dynamic page controls

Preserves filters and sorting

⏳ Live Countdown

Real-time countdown to auction end

Visual indicators:

Normal

Ending soon

Ended

Shared countdown utility (utils/time.js)

💰 Bidding System

View all bids on a listing

Highest bid automatically calculated

Minimum bid validation

Live updates after bidding

🧑 Profile Page

View username and credits

Change avatar

View:

Created listings

Active bids

Edit & delete own listings

✏️ Create / Edit Listings

Create listings with:

Title

Description

Image URL

Deadline

Edit listings you own

Delete listings from profile

Input validation & API error handling

🧠 Technical Implementation
🧩 Tech Stack

HTML5

Tailwind CSS (via PostCSS + Vite)

Vanilla JavaScript (ES Modules)

Noroff Auction API v2

Vite (dev server & build tool)

📁 Project Structure
src/
├── css/
│   └── styles.css
│
├── js/
│   └── api/
│       ├── auth/
│       │   ├── login.js
│       │   └── register.js
│       │
│       ├── global/
│       │   └── logout.js
│       │
│       ├── listings/
│       │   ├── listings.js
│       │   ├── single.js
│       │   ├── create.js
│       │   └── edit.js
│       │
│       ├── profile/
│       │   ├── profile.js
│       │   └── avatar.js
│       │
│       ├── utils/
│       │   └── time.js
│       │
│       └── constants.js
│
├── listings/
│   ├── index.html
│   ├── single/
│   ├── create/
│   └── edit/
│
├── profile/
├── auth/
└── index.html

🔌 API Usage

This project uses the official Noroff Auction API:

Base URL:

https://v2.api.noroff.dev


Key endpoints used:

POST /auth/login

POST /auth/register

GET /auction/listings

POST /auction/listings

PUT /auction/listings/:id

DELETE /auction/listings/:id

POST /auction/listings/:id/bids

GET /auction/profiles/:name

All authenticated requests include:

Authorization: Bearer <token>

X-Noroff-API-Key

🧪 Error Handling & Validation

Graceful API error messages

Input validation (empty fields, min values)

Image URL fallback handling

Unauthorized access protection

Network error handling

🎨 UI / UX Decisions

Luxury-inspired color palette (blue, gold, burgundy)

Clear visual hierarchy

Responsive layout (mobile → desktop)

Consistent buttons and cards

Accessible form labels and feedback

🏁 How to Run the Project
1️⃣ Install dependencies
npm install

2️⃣ Start development server
npm run dev

3️⃣ Open in browser
http://localhost:3000

📈 Possible Improvements (Future Work)

Server-side pagination

Bid history charts

Notifications system

Admin dashboard

Dark mode toggle

👤 Author

Synthia A. Bassole
Front-End Development student at Noroff

## ✅ Course Requirements Checklist

✔️ User registration with @stud.noroff.no email  
✔️ User login & authentication  
✔️ View active auction listings  
✔️ Create, edit and delete own listings  
✔️ Place bids on other users’ listings  
✔️ View bids on a listing  
✔️ User profile with avatar and credits  
✔️ Responsive design  
✔️ Clean API integration with error handling  
