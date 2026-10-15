# API Documentation: JSONPlaceholder Users

## 1. API Overview

JSONPlaceholder is a free, fake online REST API used for testing and learning how to make API requests.

**API URL:** https://jsonplaceholder.typicode.com/users

## 2. HTTP Method

The project uses the `GET` method to retrieve a list of users from the API.

## 3. Data Retrieved

The API returns an array of user objects containing information such as:

- ID
- Name
- Username
- Email
- Address
- Phone number
- Website
- Company

This project displays each user's name, email address, and city.

## 4. How the API Is Used

The JavaScript `fetch()` function sends a request to the API. The response is checked for errors, then converted into JSON using `response.json()`.

The `renderUsers()` function displays the retrieved users on the webpage.

## 5. Error Handling

The project uses `try/catch/finally` to handle request errors and log when the loading process finishes.

If the request fails, an error message is displayed to the user.

## 6. Search Functionality

Users can search the retrieved data by name, email address, or city. The results update as the user types.

## 7. Limitations

JSONPlaceholder provides simulated data for learning and testing. The user records are not a real directory of people, and this project does not save changes to a database.
