# Node.js REST API From Scratch (Modularized)

A complete CRUD REST API for a To-Do application, built from the ground up using **only** Node.js's native modules. This project demonstrates a deep understanding of backend principles by implementing a professional, modular MVC-like architecture without relying on any external frameworks.

---
## Key Features 🚀

- **Full CRUD Functionality:** Implements `GET`, `POST`, `PUT`, and `DELETE` endpoints for managing tasks.
- **Professional MVC Architecture:** Code is cleanly organized into `routes`, `controllers`, `middleware`, and `utils` folders, showcasing a strong understanding of separation of concerns.
- **Custom Router:** A hand-built routing engine in `routes/router.js` directs requests to the appropriate controller logic based on URL and HTTP method.
- **Handmade Middleware:** Includes a custom logger (`middleware/logger.js`) to demonstrate the middleware pattern and request lifecycle.
- **Centralized Error Handling:** A dedicated error handler in `utils/errorHandler.js` provides a robust, single point for managing all server errors.
- **File-Based Persistence:** Data is saved to a `db.json` file, with all file operations handled asynchronously using `async/await` and the native `fs` module.
- **Secure Configuration:** Uses a `.env` file to manage environment variables like the server port.

---
## Project Structure

The application follows a clean, multi-file structure to separate responsibilities:

- **`server.js`:** The main entry point. Initializes the server, loads data, and orchestrates the middleware and routing.
- **`routes/`:** Contains the routing logic that maps URLs to controller functions.
- **`controllers/`:** Holds the core business logic for each API endpoint.
- **`middleware/`:** Contains custom middleware functions that process requests.
- **`utils/`:** Holds reusable helper functions like the error handler.

---
## Tech Stack 🛠️

- **Core:** Node.js
- **Native Modules:**
    - `http` (for creating the server and handling requests)
    - `fs` (for file system persistence)
    - `url` (conceptually, for parsing `req.url` to handle routing)

---
## API Endpoints 🗺️

| Method | Endpoint          | Description               |
| :----- | :---------------- | :------------------------ |
| `GET`  | `/todos`          | Get all to-do items       |
| `POST` | `/todos`          | Create a new to-do item   |
| `PUT`  | `/todos/:id`      | Update an existing to-do  |
| `DELETE`| `/todos/:id`      | Delete a to-do item       |