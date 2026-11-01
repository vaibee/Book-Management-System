# Book Management System

A small Java REST API for managing books, with a browser-based page for trying the API. The project uses Spring Boot, Spring Security, Spring Data JPA, and MySQL. It is intended as a learning project and runs locally.

## What you need

- Java 17 or newer
- MySQL 8 (running locally)
- A web browser

Maven is included through the Maven Wrapper, so you do not need to install Maven separately.

## Set up the database

1. Start MySQL.
2. Open `Db_setup.sql` in MySQL Workbench or another MySQL client and run it. It creates the `bookdb` database and the two tables used by the app.
3. Open `BookManagementSystem/src/main/resources/application.properties`. Set `spring.datasource.username` and `spring.datasource.password` to a MySQL account that can access `bookdb`. Do not share or commit your database password.

The application is configured to run on port **8081**. If that port is in use, change `server.port` in `application.properties`.

## Run the application

From the repository folder in PowerShell, run:

```powershell
.\BookManagementSystem\mvnw.cmd -f BookManagementSystem\pom.xml spring-boot:run
```

When startup completes, open **http://localhost:8081/** for the API tester. The REST API documentation is available at **http://localhost:8081/swagger-ui/index.html**.

## Try it out

The tester page lets you create a user, connect with that user's credentials, and try all book operations. Create a user first:

1. In **Create a user**, enter a username and password.
2. Choose `USER` to read books, or `ADMIN` to read and change books.
3. Submit the form, then enter the same username and password in **Connection & credentials** and click **Use credentials & load books**.
4. Use the book form and table actions to create, list, look up, update, and delete books.

The API uses HTTP Basic authentication for book endpoints. `USER` and `ADMIN` can list or look up books; only `ADMIN` can create, update, or delete them. The user-creation endpoint is public and accepts a role, so this configuration is suitable only for local learning/testing—not for deployment on a public network.

## API endpoints

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| `POST` | `/api/users` | Public | Create a user (`username`, `password`, `role`) |
| `GET` | `/api/books` | `USER` or `ADMIN` | List all books |
| `GET` | `/api/books/{id}` | `USER` or `ADMIN` | Get a book by ID |
| `POST` | `/api/books` | `ADMIN` | Create a book (`title`, `author`, `yearPublished`) |
| `PUT` | `/api/books/{id}` | `ADMIN` | Update a book |
| `DELETE` | `/api/books/{id}` | `ADMIN` | Delete a book |

## Project layout

- `BookManagementSystem/src/main/java/.../controller` — REST endpoints
- `BookManagementSystem/src/main/java/.../service` — application logic
- `BookManagementSystem/src/main/java/.../repository` — database access
- `BookManagementSystem/src/main/java/.../model` — JPA entities
- `BookManagementSystem/src/main/java/.../dto` — request data objects
- `BookManagementSystem/src/main/java/.../security` — HTTP Basic authentication and role rules
- `BookManagementSystem/src/main/resources/static` — browser API tester
- `BookManagementSystem/src/main/resources/application.properties` — server and database settings
- `Db_setup.sql` — MySQL database and table setup

Passwords for application users are stored as BCrypt hashes. The database connection password is configured separately in `application.properties`.
