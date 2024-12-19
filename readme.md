# FED2 Project: Auction Site

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Setup Instructions](#setup-instructions)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [License](#license)

---

## Project Overview

This project is an auction site created as part of the FED2 module. It allows users to browse, bid, and manage auctions seamlessly. The application is designed to provide an intuitive and visually appealing user experience.

Note: This is a work-in-progress version of the project. Some features may not be fully functional yet.

### Live Demo
You can access the deployed version of the project [here](https://synthiab1997-fed2-auction-site.netlify.app).

---

## Features

1. **User Authentication**:
   - Registration and login functionality.
   - Secure password handling with validations.

2. **Dynamic Listings**:
   - Add, edit, delete, and view auction listings.
   - Upload images for better representation.

3. **Bidding System**:
   - Place and manage bids on items.
   - Real-time updates for bid history.

4. **Search and Sort**:
   - Search for listings by keywords.
   - Sort items by criteria such as recent or highest bids.

5. **Responsive Design**:
   - Mobile-friendly interface.
   - Fully functional across various screen sizes.

6. **Related Listings**:
   - Display similar auctions based on item categories.

---

## Technologies Used

- **Frontend**:
  - HTML5
  - CSS3 (TailwindCSS for styling)
  - JavaScript (ES6+)

- **Backend**:
  - API provided for handling data requests

- **Deployment**:
  - Hosted on [Netlify](https://www.netlify.com)

---

## Setup Instructions

To run the project locally, follow these steps:

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/synthiab1997/fed2-project-auction-site.git
   cd fed2-project-auction-site
   ```

2. **Install Dependencies**:
   - Ensure you have Node.js installed.
   - Run the following command to install project dependencies:
     ```bash
     npm install
     ```

3. **Start the Development Server**:
   - Use the following command to start the local development server:
     ```bash
     npm run dev
     ```

4. **Open the Application**:
   - Visit `http://localhost:3000` in your browser.

---

## Project Structure

```
project-directory/
|-- src/
|   |-- css/
|   |   |-- style.css
|   |   |-- styles.css
|   |-- js/
|   |   |-- api/
|   |   |   |-- listing/
|   |   |   |   |-- create.js
|   |   |   |   |-- view.js
|   |   |   |-- auth/
|   |   |-- ui/
|-- assets/
|   |-- images/
|-- index.html
|-- listing.html
|-- package.json
```

---

## API Endpoints

### Authentication
- **Register**: `POST /api/auth/register`
- **Login**: `POST /api/auth/login`

### Listings
- **Get All Listings**: `GET /api/listings`
- **Get Single Listing**: `GET /api/listings/{id}`
- **Create Listing**: `POST /api/listings`
- **Update Listing**: `PUT /api/listings/{id}`
- **Delete Listing**: `DELETE /api/listings/{id}`

---

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

