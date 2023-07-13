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
3. Blogs
4. Cart
5. Orders (At the moment the only way to process payments is through cash)

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

#### PUT /update

User logs in to update his/her account information.
Takes info through req.body and returns user's details

#### GET /logout

User log out route. Uses token obtained from req.cookies to search for userId to log out. Upon completion a 204 HTTP Response is sent to user.

#### PUT /updatepassword

User needs to login in order to change password. To test functionality, login and copy token which should be included in Authorization header in order for successful execution of request.

#### POST /forgotpassword

User enters email inside req.body and a message is generated and sent to user's mail with the `/resetpassword/token` link. The same token is returned as a response to this request.

```
"21476b4c7b4af74aa1b09bf090513be203582cc259d10bd6bc179d5cbc11790d"
```

#### PUT /resetpassword/token

This link is contained inside the mail sent to the email address keyed in by the user. When the user clicks the link it bring him/her to this route. The user can type a new password accepted in req.body which will update the users password. The token has a 10min expiry limit.

Other routes limited to only admins include

- PUT `block/:userId`
- PUT `unblock/:userId`
- DELETE `delete/:userId`
- GET `get-users`
- GET `get-users/:userId`

---

2. ### Products
   Not all the routes are available for users:

- POST `create`
- DELETE `delete/:id`
- PUT `update/:id`
- PUT `upload/:id`
  With the exception of the above, all other routes are available to the users
  #### GET /products

Retrieves a list of products.
Query Parameters:

- category (optional): Filters products by category.
- price_min (optional): Filters products with a price greater than or equal to the specified value.
- price_max (optional): Filters products with a price less than or equal to the specified value.
- sort (optional): Sorts products by a specified field (e.g., name, price).
- fields (optional): Fields to include with search (e.g., name, price).
- page, limit (optional): pagination is automatically implemented thus including page and/or limit will skip some products based on these queries

#### GET /products/:id

Retrieves a specific product by its ID.

#### POST /products

Creates a new product.
Request Body:

```json
{
  "title": "Lenovo S2 Smart Fridge",
  "description": "Lenovo S2 Smart Watch Fitness Tracker with Heart Rate Monitor, Blood Oxygen Tracking, Sport Modes, 1.4 Inch Touch Screen Smartwatch Fitness Watch for Women Men Compatible with Android iOS",
  "price": "29.99",
  "quantity": 9,
  "brand": "Lenovo",
  "color": "Black",
  "category": "Accessories"
}
```

#### PUT /wishlist

Add a product to user's wishlist. Req.body takes in product id.

#### PUT /rating

Give a rating to a product

3. ### Blogs

#### GET /get-blogs/:id

Retrieves a specific blog by their ID.

#### GET /get-blogs

Retreives all blogs

#### POST /create (Reserved for Admin)

Creates a new blog.
Request Body:

```json
{
  "title": "Create a Blog Post 4",
  "description": "Tesing the Blog creation route 4",
  "category": "Psychology"
}
```

#### PUT /update/:id (Reserved for Admin)

Updates an existing blog post.

#### DELETE /delete/:id (Reserved for Admin)

Deletes a user.

#### PUT /likes

Like a blog post

#### PUT /dislikes

Dislike a post

#### PUT /upload/:id (Reserved for Admin)

4. ### Cart /cart

#### POST /cart/add-to-cart

User adds item to cart.

```json
{
  "products": [
    {
      "product": "64a5e399ee2e61a3479c6bd7",
      "count": 3,
      "color": "Grey",
      "price": 1299,
      "_id": "64b023e02934248f77cffa07"
    },
    {
      "product": "64a5e12dee2e61a3479c6bc6",
      "count": 3,
      "color": "Grey",
      "price": 329,
      "_id": "64b023e02934248f77cffa08"
    }
  ],
  "cartTotal": 4884,
  "orderBy": "64b005d7bcb99c9d8ae8943a",
  "_id": "64b023e02934248f77cffa06",
  "createdAt": "2023-07-13T16:18:40.302Z",
  "updatedAt": "2023-07-13T16:18:40.302Z",
  "__v": 0
}
```

#### GET /get

Get user's cart

```json
{
  "_id": "64b023e02934248f77cffa06",
  "products": [
    {
      "product": {
        "_id": "64a5e399ee2e61a3479c6bd7",
        "title": "M2 chip MacBook Pro 13",
        "slug": "M2-chip-MacBook-Pro-13",
        "description": "The new M2 chip makes the 13‑inch MacBook Pro more capable than ever. The same compact design supports up to 20 hours of battery life1 and an active cooling system to sustain enhanced performance. Featuring a brilliant Retina display, a FaceTime HD camera, and studio‑quality mics, it’s our most portable pro laptop.",
        "price": 1299,
        "category": "Laptop",
        "brand": "Apple",
        "sold": 0,
        "quantity": 19,
        "images": [
          {
            "url": "https://res.cloudinary.com/daffqurhi/image/upload/v1688944695/tvgkdcr21gec6m85ik6r.jpg"
          }
        ],
        "color": ["Grey"],
        "ratings": [
          {
            "star": 4,
            "postedby": "64a2b9e8f90a5cfde8807f9e",
            "_id": "64aacbf877265e62b609debe"
          },
          {
            "star": 3,
            "postedby": "64a7010e591244ab320de8e0",
            "_id": "64aacf0c77265e62b609decb",
            "comment": "This product sucks"
          }
        ],
        "createdAt": "2023-07-05T21:41:45.651Z",
        "updatedAt": "2023-07-09T23:18:15.765Z",
        "__v": 0,
        "totalrating": "4"
      },
      "count": 3,
      "color": "Grey",
      "price": 1299,
      "_id": "64b023e02934248f77cffa07"
    },
    {
      "product": {
        "totalrating": "0",
        "_id": "64a5e12dee2e61a3479c6bc6",
        "title": "iPad (9th generation)",
        "slug": "iPad-(9th-generation)",
        "description": "With incredible detail and vivid colors, the 10.2‑inch Retina display is perfect for watching movies, working on a project, or drawing your next masterpiece.",
        "price": 329,
        "category": "Accessories",
        "brand": "Apple",
        "sold": 0,
        "quantity": 25,
        "images": [],
        "color": ["Grey"],
        "ratings": [],
        "createdAt": "2023-07-05T21:31:25.088Z",
        "updatedAt": "2023-07-05T21:31:25.088Z",
        "__v": 0
      },
      "count": 3,
      "color": "Grey",
      "price": 329,
      "_id": "64b023e02934248f77cffa08"
    }
  ],
  "cartTotal": 4884,
  "orderBy": "64b005d7bcb99c9d8ae8943a",
  "createdAt": "2023-07-13T16:18:40.302Z",
  "updatedAt": "2023-07-13T16:18:40.302Z",
  "__v": 0
}
```

#### DELETE /cart

Empty user cart.

#### POST /apply-coupon

User applies coupon accepted through req.body

5. ### Orders /users

#### GET orders/get

Retrieves a list of orders for the user.

#### POST orders/create

Creates a new order. Req.body accepts COD(Cash on Delivery) and couponApplied.

```json
{
  "COD": true,
  "couponApplied": false
}
```

#### PUT orders/update/:id (Reserved for Admin)

Update the status of orders made by the user

Conclusion

This documentation provides an overview of the E-commerce Backend API and its available endpoints. It covers authentication, error handling, and the details of each endpoint along with their request/response structures.

Remember to include the necessary authentication headers and handle errors appropriately when using the API.

If you have any questions or need further assistance, please refer to the additional resources section or contact me support team.

## Additional Resources

- API Authentication Guide
- API Reference
