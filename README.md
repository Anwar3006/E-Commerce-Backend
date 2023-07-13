# E-commerce Backend API Documentation

Welcome to the documentation for the E-commerce Backend API. This documentation provides detailed information on how to use and interact with the API endpoints for an e-commerce platform.

| Table of Contents |
| ----------------- |
| Introduction      |
| Authentication    |
| Error Handling    |
| Endpoints:        |

1. Users
2. Products
3. Users
4. Orders
5. Payments

|                      |
| -------------------- |
|                      |
| Conclusion           |
| Additional Resources |

## Introduction

The E-commerce Backend API allows developers to build and integrate e-commerce functionalities into their applications. It provides a set of endpoints to manage products, users, orders, and payments.

The API follows RESTful principles and uses JSON for data representation. It supports standard HTTP methods such as GET, POST, PUT, and DELETE. Responses are returned with appropriate HTTP status codes and include JSON payloads.

## Authentication

Authentication is required to access protected endpoints. The API uses JSON Web Tokens (JWT) for authentication. To authenticate, include the JWT token in the Authorization header of each request.

Example:

```javascript
Authorization: Bearer <JWT token>
```

To obtain a JWT token, make a POST request to the / auth/login endpoint with valid credentials;

## Error Handling

The API follows a consistent error handling approach. Errors are returned with HTTP status code 500 along with an error message describing the nature of the error along with the source.

Example error response for invalid credentials during user login:

```json
HTTP/1.1 500 Internal Server Error
Content-Type: application/json

{
  "message":"Invalid username and password"
  "stack": "Error: Invalid username and password\n at ECommerce-Back/controllers/userCtrl.js:75:15"
}
```

## Set-Up

- Open Terminal/Command Prompt inside the project directory and type `npm init` to install the neccesary packages
- Open `.env` file and paste your MongoDB URL.
- Type `npm run server` to start the server. If everything goes smoothly you should see:

```bash
npm run server

> ecommerce@1.0.0 server
> nodemon ./app.js

[nodemon] 2.0.22
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,mjs,json
[nodemon] starting `node ./app.js`
Server is running on port: 5050...
```

## Endpoints

1. ### Users: /users

#### POST /register

Creates an account for users.
Request.body includes:

```json
{
  "firstname": "User1",
  "lastname": "Test",
  "email": "user1@testing.com",
  "mobile": "0123456789",
  "password": "*****"
}
```

Response includes:

```json
{
  "firstname": "User1",
  "lastname": "Test",
  "email": "user1@testing.com",
  "mobile": "0123456789",
  "password": "$2b$10$J8R2wBdJHVIFCDdU/MBb5eaLbqwKM1wU.Mgege9.LFvjXuQosDUf2",
  "role": "user",
  "isBlocked": false,
  "cart": [],
  "wishlist": [],
  "_id": "64b005d7bcb99c9d8ae8943a",
  "createdAt": "2023-07-13T14:10:31.599Z",
  "updatedAt": "2023-07-13T14:10:31.599Z",
  "__v": 0
}
```

#### POST /login-user & /login-admin

Seperate route for users and admins to implement security
Request.body takes in email and password. After login a token is generated for the user/admin to signify successful login:

```json
{
  "id": "64a7010e591244ab320de8e0",
  "firstname": "User1",
  "lastname": "Trial",
  "email": "user1@testing.com",
  "mobile": "0123456789",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0YTcwMTBlNTkxMjQ0YWIzMjBkZThlMCIsImlhdCI6MTY4OTI1NzExMiwiZXhwIjoxNjg5MzQzNTEyfQ.Gt7opqsBZYXb2myc-QtIY305jd9ThoogkGgbORq-H4M"
}
```

#### GET /refresh

Refresh login token for users
Obtains cookies from req.cookies that represents the token generated when user first logs in. Response is a newly generated accessToken:

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0YTJiOWU4ZjkwYTVjZmRlODgwN2Y5ZSIsImlhdCI6MTY4OTI1ODAxNSwiZXhwIjoxNjg5MzQ0NDE1fQ.qCNJEjnJz9OViOn0ySjwKIcUCOECqgXj3G6nrrKagqo"
}
```

PUT /update
User logs in to update his/her account information.
Takes info through req.body and returns user's details

GET /logout
User log out route. Uses token obtained from req.cookies to search for userId to log out. Upon completion a 204 HTTP Response is sent to user.

PUT /updatepassword
User needs to login in order to change password. To test functionality, login and copy token which should be included in Authorization header in order for successful execution of request.

POST /forgotpassword
User enters email inside req.body and a message is generated and sent to user's mail with the `/resetpassword/token` link. The same token is returned as a response to this request.

```
"21476b4c7b4af74aa1b09bf090513be203582cc259d10bd6bc179d5cbc11790d"
```

PUT /resetpassword/token
This link is contained inside the mail sent to the email address keyed in by the user. When the user clicks the link it bring him/her to this route. The user can type a new password accepted in req.body which will update the users password. The token has a 10min expiry limit.

Other routes limited to only admins include

- PUT `block/:userId`
- PUT `unblock/:userId`
- DELETE `delete/:userId`
- GET `get-users`
- GET `get-users/:userId`

2. Products
   GET /products

Retrieves a list of products.

Query Parameters:

category (optional): Filters products by category.
price_min (optional): Filters products with a price greater than or equal to the specified value.
price_max (optional): Filters products with a price less than or equal to the specified value.
sort_by (optional): Sorts products by a specified field (e.g., name, price).
GET /products/{id}

Retrieves a specific product by its ID.

POST /products

Creates a new product.

Request Body:

name (required): The name of the product.
price (required): The price of the product.
category (required): The category of the product.
PUT /products/{id}

Updates an existing product.

Request Body:

name (optional): The updated name of the product.
price (optional): The updated price of the product.
category (optional): The updated category of the product.
DELETE /products/{id}

Deletes a product.

3. Users
   GET /users/{id}

Retrieves a specific user by their ID.

POST /users

Creates a new user.

Request Body:

name (required): The name of the user.
email (required): The email address of the user.
password (required): The password of the user.
PUT /users/{id}

Updates an existing user.

Request Body:

name (optional): The updated name of the user.
email (optional): The updated email address of the user.
password (optional): The updated password of the user.
DELETE /users/{id}

Deletes a user.

4. Orders
   GET /orders

Retrieves a list of orders.

Query Parameters:

user_id (optional): Filters orders by user ID.
status (optional): Filters orders by status (e.g., pending, shipped).
GET /orders/{id}

Retrieves a specific order by its ID.

POST /orders

Creates a new order.

Request Body:

user_id (required): The ID of the user placing the order.
product_ids (required): An array of product IDs included in the order.

5. Payments
   POST /payments

Processes a payment for an order.

Request Body:

order_id (required): The ID of the order to be paid.
amount (required): The total payment amount.
Conclusion

This documentation provides an overview of the E-commerce Backend API and its available endpoints. It covers authentication, error handling, and the details of each endpoint along with their request/response structures.

Remember to include the necessary authentication headers and handle errors appropriately when using the API.

If you have any questions or need further assistance, please refer to the additional resources section or contact me support team.

## Additional Resources

- API Authentication Guide
- API Reference
