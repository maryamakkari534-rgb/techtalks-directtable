# DirectTable — La Rose Sucre

DirectTable is a web-based restaurant ordering MVP developed during the TechTalks internship. It allows customers to browse a restaurant menu, place pickup or delivery orders, view their order history, and reorder previous meals. Restaurant administrators can manage menu items, monitor incoming orders, update order statuses, and search customer order history.

## Live Demo

- **Customer Website:** https://techtalks-directtable.vercel.app/
- **Admin Login:** https://techtalks-directtable.vercel.app/admin/login
- **Orders Dashboard:** https://techtalks-directtable.vercel.app/dashboard/orders
- **Menu Management:** https://techtalks-directtable.vercel.app/dashboard/menu
- **Customer History:** https://techtalks-directtable.vercel.app/customer-history
- **Admin Customer History:** https://techtalks-directtable.vercel.app/dashboard/customer-history
- **Backend API:** https://techtalks-directtable.onrender.com
- **GitHub Repository:** https://github.com/maryamakkari534-rgb/techtalks-directtable

The application is deployed using free-tier hosting services. The backend may take some time to respond after a period of inactivity.

## 1. Problem Statement

Traditional restaurant ordering often relies on phone calls or manual order management. This can make it difficult for customers to review available items and for restaurant staff to track incoming orders and maintain accurate menu availability.

DirectTable provides a centralized web application for browsing a restaurant menu, placing orders, and managing restaurant operations.

## 2. Target Users

### Customers
Customers who want to browse available meals, place pickup or delivery orders, review previous orders, and reorder meals.

### Restaurant Administrators
Restaurant staff who need to manage menu items, update item availability, monitor orders, change order statuses, and search customer order history.

## 3. Project Goals and Proposed Solution

The goal of DirectTable is to provide a simple and accessible restaurant ordering experience through a web application.

The proposed solution consists of:
- A customer-facing website for browsing the menu and placing orders.
- A secure backend API for authentication, order processing, and menu management.
- An administrator dashboard for managing orders and menu items.
- A PostgreSQL database for storing restaurant, menu, customer, and order information.

## 4. Final MVP Scope

The MVP focuses on the essential restaurant ordering workflow:

1. Browse the restaurant and its menu.
2. Filter menu items by category.
3. Add items to a shopping cart.
4. Change item quantities or remove items.
5. Submit pickup or delivery orders.
6. View customer order history and order details.
7. Reorder previous meals when items are available.
8. Manage menu items and availability as an administrator.
9. Review orders and update their statuses.
10. Archive completed orders from the active administrator dashboard.

## 5. Main Features

### Customer Features

- Browse restaurant information and menu items.
- Filter menu items by category.
- View prices and item availability.
- Add menu items to the cart.
- Increase or decrease item quantities.
- Remove items from the cart.
- Place pickup or delivery orders.
- Enter a delivery address when delivery is selected.
- Register with a phone number and password.
- Log in and maintain an authenticated session.
- View personal order history.
- View order details.
- Reorder previous meals, subject to item availability.

### Administrator Features

- Log in through the administrator login page.
- Access protected administrator routes.
- View orders and customer/order information.
- View order items.
- Update order statuses.
- Archive completed orders from the active dashboard.
- Add new menu items.
- Edit existing menu items.
- Delete or remove menu items.
- Mark menu items as available or unavailable.
- Search customer order history by phone number.

## 6. Authentication and Customer History

DirectTable uses session-based authentication with Spring Security.

### Customer Authentication

Customers register using a phone number and password. Passwords are hashed using BCrypt before storage.

After a successful login, customers can access their own order history without entering their password again while their authenticated session remains valid.

Customers should only be able to:
- View their own order history.
- View details of their own orders.
- Reorder their own previous orders.

The backend must enforce these ownership restrictions. Frontend navigation or hidden buttons alone are not sufficient security controls.

### Administrator Authentication

Administrators use the administrator login page and an administrator account configured for the deployment.

After login, the administrator can access protected dashboard pages, manage menu items, review orders, and search customer history by phone number without entering a second password.

The administrator must have a valid authenticated session.

### Session Behavior

Administrator and customer authentication use browser sessions and cookies. Switching between administrator and customer accounts in the same browser may require logging out first or using a separate browser session.

### Customer History and Archived Orders

Customer history is intended to remain available even when an order is archived from the active administrator dashboard.

Archiving is different from deleting an order: an archived order should remain stored in the database and available for historical reference.

## 7. Technologies Used

### Frontend

- React
- Vite
- React Router
- CSS
- Responsive styling and the Baby Blue theme

### Backend

- Java 17
- Spring Boot
- Spring Security
- Spring Data JPA
- Hibernate
- Jakarta Bean Validation
- Maven

### Database and Deployment

- PostgreSQL
- Neon — hosted database
- Render — backend hosting
- Vercel — frontend hosting
- Docker — backend build and deployment

### Development Tools

- Visual Studio Code
- Git
- GitHub
- Terminal
- Postman or browser-based API testing tools, where applicable

## 8. System Architecture

The application follows a client-server architecture.

```text
Customer / Administrator
          |
          v
React + Vite Frontend
        Vercel
          |
          | API Requests
          v
Spring Boot REST API
        Render
          |
          | JPA / Hibernate
          v
PostgreSQL Database
         Neon
```

The frontend sends API requests to the Spring Boot backend. The backend validates incoming requests, applies authentication and authorization rules, and reads or writes data in PostgreSQL.

Vercel rewrites API requests to the deployed backend on Render.

## 9. Local Setup Instructions

### Prerequisites

Install the following:
- Java 17
- Node.js and npm
- PostgreSQL
- Git

The project includes a Maven wrapper for running the backend.

### Clone the Repository

```bash
git clone https://github.com/maryamakkari534-rgb/techtalks-directtable.git
cd techtalks-directtable
```

### Configure the Backend

Create a local PostgreSQL database named `directtable_db`.

Configure the database URL, username, and password using environment variables or a local configuration file that is not committed to Git.

The deployed backend uses the following environment variables:

| Variable | Purpose |
|---|---|
| `SPRING_DATASOURCE_URL` | PostgreSQL JDBC connection URL |
| `SPRING_DATASOURCE_USERNAME` | Database username |
| `SPRING_DATASOURCE_PASSWORD` | Database password |
| `ADMIN_PASSWORD` | Password used when initializing the administrator account |

For local development, check `backend/src/main/resources/application.properties` to confirm whether `DB_USERNAME` and `DB_PASSWORD` are also used.

Never commit database credentials or administrator passwords.

Run the backend:

```bash
cd backend
./mvnw spring-boot:run
```

The backend normally runs at:

`http://localhost:8080`

### Configure and Run the Frontend

Open a separate terminal:

```bash
cd frontend
npm install
npm run dev
```

The Vite development server normally runs at:

`http://localhost:5173`

The local Vite proxy forwards API requests to the backend.

### Build and Test

Build the frontend:

```bash
cd frontend
npm run build
```

Run backend tests:

```bash
cd backend
./mvnw test
```

Run these commands against the current project version before submitting changes. A successful frontend build does not automatically mean that all backend tests have passed.

## 10. Deployment

### Neon Database

Neon hosts the PostgreSQL database used by the deployed backend.

The restaurant and menu data were imported from the local database. Customer accounts and test orders were intentionally not migrated.

Database credentials must be configured through hosting environment variables.

### Render Backend

The Spring Boot backend is deployed on Render using Docker.

The deployed service uses:
- Java 17
- A Dockerfile in the backend directory
- Neon PostgreSQL connection settings
- An administrator password configured through Render environment variables

The backend URL is:

https://techtalks-directtable.onrender.com

### Vercel Frontend

The React frontend is deployed on Vercel.

Configuration:
- Root directory: `frontend`
- Framework: Vite
- Deployment branch: `main`
- API routing: configured in `frontend/vercel.json`

The frontend URL is:

https://techtalks-directtable.vercel.app/

The deployed application should be retested after any changes to environment variables, authentication, cookies, CSRF configuration, or API routing.

## 11. API Overview

The following table summarizes the main API endpoints. Authorization rules are defined in `SecurityConfig.java` and the relevant service-layer ownership checks.

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/restaurants` | Retrieve the public restaurant list |
| GET | `/api/restaurants/{id}/menu` | Retrieve a restaurant's menu |
| POST | `/api/customer/auth/signup` | Register a customer |
| GET | `/api/auth/csrf` | Obtain a CSRF token |
| POST | `/api/auth/login` | Log in an administrator or customer |
| GET | `/api/auth/me` | Check the authenticated identity |
| POST | `/api/auth/logout` | Log out and end the session |
| POST | `/api/orders` | Create an order as an authenticated customer |
| GET | `/api/orders` | Retrieve orders for the administrator dashboard |
| PUT | `/api/orders/{id}/status` | Update an order status |
| GET | `/api/orders/history/{phone}` | Retrieve customer order history, subject to authorization |
| GET | `/api/orders/{id}/details` | Retrieve order details, subject to authorization |
| GET | `/api/orders/{id}/reorder` | Retrieve reorder data, subject to ownership checks |
| PATCH | `/api/orders/{id}/archive` | Archive a completed order |
| POST | `/api/restaurants/{id}/menu` | Add a menu item |
| PUT | `/api/restaurants/{id}/menu/{itemId}` | Edit a menu item |
| DELETE | `/api/restaurants/{id}/menu/{itemId}` | Remove a menu item |
| PATCH | `/api/restaurants/{id}/menu/{itemId}/availability` | Update item availability |

State-changing requests are protected by CSRF. Authenticated requests use session cookies and must include the required credentials and CSRF token.

## 12. Team Contributions

The team should review this section and confirm the full names and responsibilities of every member before final submission.

- **Lama — DT-54:** Admin authentication and the Spring Security login flow.
- **Maryam Akkari — DT-55 / DT-58:** API authorization, customer authentication integration, order ownership checks, frontend/backend integration fixes, and deployment coordination.
- **Maryam Ayoubi — DT-57:** Administrator login interface and CSRF login flow.
- **Linda — DT-56:** Protected administrator routes and logout functionality.
- **Team integration:** Integration of feature branches, deployment configuration, Neon database setup, and manual testing of the deployed application.

The final contribution descriptions should reflect the actual work and GitHub history of each team member.

## 13. Testing and Validation

Manual testing during development and deployment included:

- Administrator login and access to the orders dashboard.
- Viewing order items.
- Updating order statuses.
- Customer signup and login.
- Placing a test order on the deployed website.
- Confirming that the test order appeared in the administrator dashboard and customer history.
- Menu management operations, including adding, editing, deleting, and changing item availability.
- Testing public restaurant and menu API responses.
- Confirming that the frontend production build completed successfully.

Backend automated test results should be verified and recorded before final submission.

The archive workflow should also be tested on the deployed application before claiming that every archive-related behavior has been fully validated.

## 14. Security, Privacy, and Data Handling

The project includes several security measures:

- BCrypt password hashing.
- Role-based access control for administrators and customers.
- Backend ownership checks for customer history, order details, and reorder operations.
- CSRF protection for state-changing requests.
- Environment variables for database credentials and the administrator password.
- Separation of administrator and customer capabilities.

Before making the repository public, review the source files and Git history for exposed credentials, tokens, connection strings, or other secrets.

Customer phone numbers are personal information. They should not be published in screenshots, reports, or examples without permission.

