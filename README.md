# Booking App

## Booking App
A simple booking hotel website. You can view all hotel by Type or City and Rating. Login and place order for your vacation. When you come to Admin page, you can manage hotel and room and view all transactions. The demo apps was deployed on Render and Firebase.

## Technologies
Technologies used: MongoDB, Express, ReactJS, NodeJS, React Router, Redux toolkit.

## Launch demo

\*Note: Please open link back-end first.

- ClientApp (Firebase) : [Link](https://booking-client-7b598.web.app/)
- AdminApp (Firebase) : [Link](https://booking-admin-9eed8.web.app/)
- Back-end (Render) : [Link](https://booking-server-m3vf.onrender.com/)
- Client Account: account: user , password: 123456
- Admin Account: account: admin , password: 123456
## Project Breakdown

### Server

- Directory: Server
- Features:
  - [x] Building api server (MVC model) - CRUD operations
  - [x] Generating schema models
  - [x] JWT Authentication

### Client App

- Directory: Client
- Features:
  - [x] Home page, Login/sign up page
  - [x] Hotel page by type, Hotel page by city
  - [x] Booking page, Transaction page,Checkout page
  - [x] Show / hide room booked
  - [x] View all transactions history

### Admin App

- Directory: Admin
- Features:
  - [x] Login page - authenticate for role admin
  - [x] Dashboard to summarize data
  - [x] Show all transactions 
  - [x] Create/Update/Delete hotel/room
  - [x] Cancel delete hotel/room if it booked
  - [x] Update transaction status every time 

### Node version

- Node -v 18.17.1
- Npm -v 9.6.7

## Source code
- ClientApp: https://github.com/vutran221097/booking-client
- AdminApp: https://github.com/vutran221097/booking-admin
- ServerApp: https://github.com/vutran221097/booking-server

### Clone or download the `Booking App` from source code
#### Client-side usage(PORT: 3000)
- Url: http://localhost:3000
- Change backend url to http://localhost:5000 in config.server.js if you want to run local

```
$ yarn # or npm i    // npm install packages
$ npm start       // run it locally
```

#### Admin usage(PORT: 3001)
- Url: http://localhost:3001
- Change backend url to http://localhost:5000 in config.server.js if you want to run local

```
$ yarn # or npm i    // npm install packages
$ npm start       // run it locally
```

#### Server-side usage(PORT: 5000)
- Url: http://localhost:5000

```
$ npm i       // npm install packages
$ npm start // run it locally
```
