# Library Books REST API Specification

## 1. Overview

The Library Books API allows users to manage a collection of books in a library. It supports listing books, adding new books, retrieving a specific book, updating book information, deleting books, and filtering books by author.

**Base URL:** `/api/v1`

**Data format:** JSON

## 2. Book Resource

Each book contains the following fields:

| Field         | Type    | Description                    |
| ------------- | ------- | ------------------------------ |
| id            | Integer | Unique identifier for the book |
| title         | String  | Title of the book              |
| author        | String  | Name of the author             |
| genre         | String  | Book category or genre         |
| publishedYear | Integer | Year the book was published    |

Example book:

```json
{
  "id": 1,
  "title": "Things Fall Apart",
  "author": "Chinua Achebe",
  "genre": "Historical Fiction",
  "publishedYear": 1958
}
```

## 3. API Endpoints

### Endpoint 1: List All Books

**Method:** GET

**Path:** `/api/v1/books`

**Description:** Retrieves a list of all books in the library.

**Request body:** None.

**Success status code:** `200 OK`

**Example response:**

```json
[
  {
    "id": 1,
    "title": "Things Fall Apart",
    "author": "Chinua Achebe",
    "genre": "Historical Fiction",
    "publishedYear": 1958
  },
  {
    "id": 2,
    "title": "Born a Crime",
    "author": "Trevor Noah",
    "genre": "Memoir",
    "publishedYear": 2016
  }
]
```

### Endpoint 2: Create a New Book

**Method:** POST

**Path:** `/api/v1/books`

**Description:** Adds a new book to the library. The server generates the book ID.

**Request body:**

```json
{
  "title": "Born a Crime",
  "author": "Trevor Noah",
  "genre": "Memoir",
  "publishedYear": 2016
}
```

**Success status code:** `201 Created`

**Example response:**

```json
{
  "id": 3,
  "title": "Born a Crime",
  "author": "Trevor Noah",
  "genre": "Memoir",
  "publishedYear": 2016
}
```

### Endpoint 3: Retrieve a Book by ID

**Method:** GET

**Path:** `/api/v1/books/{id}`

**Description:** Retrieves details of a specific book using its unique ID.

**Request body:** None.

**Example request:** `GET /api/v1/books/1`

**Success status code:** `200 OK`

**Example response:**

```json
{
  "id": 1,
  "title": "Things Fall Apart",
  "author": "Chinua Achebe",
  "genre": "Historical Fiction",
  "publishedYear": 1958
}
```

### Endpoint 4: Update a Book

**Method:** PUT

**Path:** `/api/v1/books/{id}`

**Description:** Replaces the details of an existing book identified by its ID.

**Request body:**

```json
{
  "title": "Things Fall Apart",
  "author": "Chinua Achebe",
  "genre": "Classic Literature",
  "publishedYear": 1958
}
```

**Example request:** `PUT /api/v1/books/1`

**Success status code:** `200 OK`

**Example response:**

```json
{
  "id": 1,
  "title": "Things Fall Apart",
  "author": "Chinua Achebe",
  "genre": "Classic Literature",
  "publishedYear": 1958
}
```

### Endpoint 5: Delete a Book

**Method:** DELETE

**Path:** `/api/v1/books/{id}`

**Description:** Deletes a specific book from the library using its ID.

**Request body:** None.

**Example request:** `DELETE /api/v1/books/1`

**Success status code:** `204 No Content`

**Example response:** No response body is returned.

### Endpoint 6: Filter Books by Author

**Method:** GET

**Path:** `/api/v1/books?author={author}`

**Description:** Returns books written by the specified author.

**Request body:** None.

**Example request:** `GET /api/v1/books?author=Chinua%20Achebe`

**Success status code:** `200 OK`

**Example response:**

```json
[
  {
    "id": 1,
    "title": "Things Fall Apart",
    "author": "Chinua Achebe",
    "genre": "Historical Fiction",
    "publishedYear": 1958
  }
]
```

## 4. HTTP Status Codes

| Status Code               | Meaning                                  | When It Is Used                                              |
| ------------------------- | ---------------------------------------- | ------------------------------------------------------------ |
| 200 OK                    | Request successful                       | Listing, retrieving, updating, or filtering books            |
| 201 Created               | Resource created                         | Successfully adding a new book                               |
| 204 No Content            | Request successful with no response body | Successfully deleting a book                                 |
| 400 Bad Request           | Invalid request data                     | Missing or invalid required fields                           |
| 404 Not Found             | Resource not found                       | Requesting, updating, or deleting a book that does not exist |
| 500 Internal Server Error | Unexpected server error                  | An unhandled server-side failure                             |

## 5. Validation Rules

- The title and author fields are required and must contain non-empty strings.
- The genre field must contain a string.
- The publishedYear field must be a valid integer.
- The server generates a unique ID when a book is created.
- A book ID must identify an existing book before it can be retrieved, updated, or deleted.
- The author filter should return only books matching the requested author.
- Invalid input should return `400 Bad Request`.
- Requests for nonexistent books should return `404 Not Found`.

## 6. Summary

The Library Books REST API provides six endpoints for managing book resources. It uses standard HTTP methods, resource-based URL paths, JSON request and response formats, and appropriate HTTP status codes. These endpoints demonstrate the fundamental principles of REST API design and CRUD operations.
