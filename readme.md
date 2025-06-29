# 🏆 The Golden Market - FED2 Auction Site

## 📦 Project Overview

This is a front-end auction website created for Noroff's FED2 semester project. It allows users to browse, search, bid, and manage auction listings using the official Noroff Auction API.

---

## ✅ Features

- 🔐 **Authentication**: Register with `stud.noroff.no`, login, and logout
- 📦 **Listings**: Create, view, bid on, and manage auctions
- 💰 **Bidding**: Real-time bidding system with credit deduction
- 🧑 **Profiles**: View total credits, update avatar
- 🔍 **Search**: Filter listings by title or description (unauthenticated access allowed)
- 🎨 **UI**: Fully responsive, accessible, and WCAG-compliant design

---

## 🚀 Live Demo

[🔗 View on Netlify](https://synthiab1997-fed2-auction-site.netlify.app)

---

## 📂 Project Links

| Resource         | Link                                                               |
|------------------|--------------------------------------------------------------------|
| GitHub Repo      | [GitHub Project](https://github.com/synthiab1997/fed2-project-auction-site) |
| Design Prototype | [Figma Wireframe](https://www.figma.com/file/YOUR-LINK-HERE)       |
| Kanban Board     | [Trello](https://trello.com/b/YOUR-LINK-HERE)                      |
| Gantt Timeline   | [Gantt.io](https://gantt.io/project/YOUR-LINK-HERE)                |

---

## 🛠 Technologies Used

- HTML5
- Tailwind CSS
- JavaScript (ES6+)
- Vite
- Netlify (Hosting)

---

## 🧪 Setup Instructions

1. **Clone the Repo**
```bash
git clone https://github.com/synthiab1997/fed2-project-auction-site.git
cd fed2-project-auction-site

2. **Install Dependencies**
 npm install

3. **Start Development Server**
npm run dev 


## 🗂 Project Structure

src/
  ├── css/
  ├── js/
  │   ├── api/
  │   │   ├── auth/
  │   │   ├── listing/
  │   │   ├── profile/
  │   │   ├── global/
  │   └── utils/
  └── images/
index.html
listing/index.html
profile/index.html

## API Endpoints

| Type           | Endpoint                               |
| -------------- | -------------------------------------- |
| Register       | POST /auction/auth/register            |
| Login          | POST /auction/auth/login               |
| Get Listings   | GET /auction/listings                  |
| Single Listing | GET /auction/listings/{id}?\_bids=true |
| Create Listing | POST /auction/listings                 |
| Place Bid      | POST /auction/listings/{id}/bids       |
| Profile Info   | GET /auction/profiles/{name}           |
| Update Avatar  | PUT /auction/profiles/{name}           |
| Search         | GET /auction/listings/search?q={query} |

##License

This project is licensed under the MIT License. See the LICENSE file for details.