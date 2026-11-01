const apiUrlInput = document.querySelector("#api-url");
const usernameInput = document.querySelector("#username");
const passwordInput = document.querySelector("#password");
const connectionStatus = document.querySelector("#connection-status");
const booksStatus = document.querySelector("#books-status");
const userStatus = document.querySelector("#user-status");
const bookList = document.querySelector("#book-list");
const responseOutput = document.querySelector("#response-output");
let credentials = null;

apiUrlInput.value = window.location.origin;

function getApiBase() {
    const value = apiUrlInput.value.trim();
    if (!value) {
        throw new Error("Enter an API base URL.");
    }

    const url = new URL(value);
    return url.href.replace(/\/+$/, "");
}

function setStatus(element, message, isError = false) {
    element.textContent = message;
    element.classList.toggle("error", isError);
}

function writeResponse(method, path, status, body) {
    const response = {
        method,
        endpoint: path,
        status,
        body
    };
    responseOutput.textContent = JSON.stringify(response, null, 2);
}

function encodeBasicCredentials(username, password) {
    const bytes = new TextEncoder().encode(`${username}:${password}`);
    let binary = "";
    for (const byte of bytes) {
        binary += String.fromCharCode(byte);
    }
    return btoa(binary);
}

async function request(method, path, body, authenticated = true, redactPassword = false) {
    let response;
    try {
        const headers = {};
        if (body !== undefined) {
            headers["Content-Type"] = "application/json";
        }
        if (authenticated && credentials) {
            headers.Authorization = `Basic ${encodeBasicCredentials(credentials.username, credentials.password)}`;
        }

        response = await fetch(`${getApiBase()}${path}`, {
            method,
            headers,
            body: body === undefined ? undefined : JSON.stringify(body)
        });
    } catch (error) {
        writeResponse(method, path, "Network error", error.message);
        throw error;
    }

    const responseText = await response.text();
    let responseBody = null;
    if (responseText) {
        try {
            responseBody = JSON.parse(responseText);
        } catch {
            responseBody = responseText;
        }
    }
    const displayedBody = redactPassword && responseBody && typeof responseBody === "object"
        ? { id: responseBody.id, username: responseBody.username, role: responseBody.role }
        : responseBody;
    writeResponse(method, path, response.status, displayedBody);

    if (!response.ok) {
        const detail = typeof responseBody === "string"
            ? responseBody
            : JSON.stringify(responseBody);
        throw new Error(`${response.status} ${response.statusText}${detail ? `: ${detail}` : ""}`);
    }
    return responseBody;
}

function showBooks(books) {
    bookList.replaceChildren();
    if (!Array.isArray(books) || books.length === 0) {
        const row = document.createElement("tr");
        const cell = document.createElement("td");
        cell.colSpan = 5;
        cell.className = "empty";
        cell.textContent = "No books found.";
        row.append(cell);
        bookList.append(row);
        return;
    }

    for (const book of books) {
        const row = document.createElement("tr");
        for (const value of [book.id, book.title, book.author, book.yearPublished]) {
            const cell = document.createElement("td");
            cell.textContent = value == null ? "" : String(value);
            row.append(cell);
        }
        const actionCell = document.createElement("td");
        const selectButton = document.createElement("button");
        selectButton.type = "button";
        selectButton.className = "secondary";
        selectButton.textContent = "Select";
        selectButton.addEventListener("click", () => fillBookForm(book));
        actionCell.append(selectButton);
        row.append(actionCell);
        bookList.append(row);
    }
}

function fillBookForm(book) {
    document.querySelector("#book-id").value = book.id ?? "";
    document.querySelector("#book-title").value = book.title ?? "";
    document.querySelector("#book-author").value = book.author ?? "";
    document.querySelector("#book-year").value = book.yearPublished ?? "";
}

function readBookForm() {
    const title = document.querySelector("#book-title").value.trim();
    const author = document.querySelector("#book-author").value.trim();
    const yearValue = document.querySelector("#book-year").value;
    if (!title || !author) {
        throw new Error("Enter both a title and an author.");
    }
    if (yearValue !== "" && !Number.isInteger(Number(yearValue))) {
        throw new Error("Year published must be a whole number.");
    }
    return {
        title,
        author,
        yearPublished: yearValue === "" ? null : Number(yearValue)
    };
}

function readBookId() {
    const id = document.querySelector("#book-id").value.trim();
    if (!id || !Number.isInteger(Number(id)) || Number(id) < 1) {
        throw new Error("Enter a valid book ID.");
    }
    return encodeURIComponent(id);
}

async function loadBooks() {
    try {
        const books = await request("GET", "/api/books");
        showBooks(books);
        setStatus(booksStatus, `Loaded ${books.length} book${books.length === 1 ? "" : "s"}.`);
    } catch (error) {
        setStatus(booksStatus, error.message, true);
    }
}

document.querySelector("#connect-button").addEventListener("click", async () => {
    const username = usernameInput.value.trim();
    const password = passwordInput.value;
    if (!username || !password) {
        setStatus(connectionStatus, "Enter both a username and password.", true);
        return;
    }

    credentials = { username, password };
    setStatus(connectionStatus, "Checking credentials…");
    try {
        await loadBooks();
        if (booksStatus.classList.contains("error")) {
            setStatus(connectionStatus, "Request failed; check the response and credentials.", true);
        } else {
            setStatus(connectionStatus, `Using credentials for ${username}.`);
        }
    } catch (error) {
        setStatus(connectionStatus, error.message, true);
    }
});

document.querySelector("#clear-credentials").addEventListener("click", () => {
    credentials = null;
    passwordInput.value = "";
    setStatus(connectionStatus, "Credentials cleared.");
});

document.querySelector("#list-books").addEventListener("click", loadBooks);

document.querySelector("#user-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const submitButton = form.querySelector('button[type="submit"]');
    const username = document.querySelector("#new-username").value.trim();
    const password = document.querySelector("#new-password").value;
    const role = document.querySelector("#new-role").value;
    submitButton.disabled = true;
    setStatus(userStatus, "Creating user…");
    try {
        await request("POST", "/api/users", { username, password, role }, false, true);
        form.reset();
        usernameInput.value = username;
        passwordInput.value = password;
        credentials = { username, password };
        setStatus(connectionStatus, `Using credentials for ${username}.`);
        await loadBooks();
        if (booksStatus.classList.contains("error")) {
            setStatus(userStatus, `User "${username}" was created, but sign-in failed: ${booksStatus.textContent}`, true);
        } else {
            setStatus(userStatus, `User "${username}" created and signed in as ${role}. You can now use the book tools.`);
        }
    } catch (error) {
        setStatus(userStatus, error.message, true);
    } finally {
        submitButton.disabled = false;
    }
});

document.querySelector("#book-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    try {
        const book = await request("POST", "/api/books", readBookForm());
        fillBookForm(book);
        await loadBooks();
    } catch (error) {
        setStatus(booksStatus, error.message, true);
    }
});

document.querySelector("#update-book").addEventListener("click", async () => {
    try {
        const id = readBookId();
        const book = await request("PUT", `/api/books/${id}`, readBookForm());
        fillBookForm(book);
        await loadBooks();
    } catch (error) {
        setStatus(booksStatus, error.message, true);
    }
});

document.querySelector("#get-book").addEventListener("click", async () => {
    try {
        const id = readBookId();
        const book = await request("GET", `/api/books/${id}`);
        fillBookForm(book);
    } catch (error) {
        setStatus(booksStatus, error.message, true);
    }
});

document.querySelector("#delete-book").addEventListener("click", async () => {
    try {
        const id = readBookId();
        if (!window.confirm(`Delete book ${decodeURIComponent(id)}? This cannot be undone.`)) {
            return;
        }
        await request("DELETE", `/api/books/${id}`);
        document.querySelector("#book-id").value = "";
        await loadBooks();
    } catch (error) {
        setStatus(booksStatus, error.message, true);
    }
});
