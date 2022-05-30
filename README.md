# Introduction

BoardCamp is an application to board games' rental management, using SQL database. Within the routes of this application, you can add, get and manage the informations of customers, games, categories and rentals.

# Routes

## /categories

- <b>GET</b>:
  - Response example:
  ```
  [
  {
  id: 1,
  name: 'Estratégia',
  },
  {
  id: 2,
  name: 'Investigação',
  }
  ]
  ```
- <b>POST</b>:
  - Request body:
  ```
  {
  name: 'Investigação'
  }
  ```

## /games

- <b>GET</b>:
  - Response example:
  ```
  [
  {
    id: 1,
    name: "Banco Imobiliário",
    image: "",
    stockTotal: 3,
    categoryId: 7,
    pricePerDay: 1500,
    categoryName: "Estratégia",
    rentalsCount: 1
  },
  {
    id: 3,
    name: "Combate",
    image: "https://",
    stockTotal: 5,
    categoryId: 9,
    pricePerDay: 20,
    categoryName": "Sobrevivência",
    rentalsCount: 0
  },
  ]
  ```
- <b>POST</b>:

  - Request body:

  ```
  {
  name: 'Banco Imobiliário',
  image: 'http://',
  stockTotal: 3,
  categoryId: 1,
  pricePerDay: 1500,
  }
  ```

  ## /customers

- <b>GET</b>:
  - Response example:
  ```
  [
  {
    id: 6,
    name: "João Alfredo",
    phone: "21998899222",
    cpf: "01234567890",
    birthday: "1992-10-05",
    rentalsCount: 1
  },
  {
    id: 7,
    name: "José Ricardo",
    phone: "21998893222",
    cpf: "01236667890",
    birthday: "1993-11-30",
    rentalsCount: 0
  },
  ]
  ```
- <b>POST</b>:
  - Request body:
  ```
  {
  name: 'João Alfredo',
  phone: '21998899222',
  cpf: '01234567890',
  birthday: '1992-10-05'
  }
  ```
- <b>PUT</b> (/customers/:id):
  - Request body:
  ```
  {
  name: 'João Alfredo',
  phone: '21998899222',
  cpf: '01234567890',
  birthday: '1992-10-05'
  }
  ```

## /rentals

- <b>GET</b>:
  - Response example:
  ```
  [
  {
    id: 1,
    customerId: 6,
    gameId: 1,
    rentDate: "2022-05-22",
    daysRented: 3,
    returnDate: "2022-05-28",
    originalPrice: 4500,
    delayFee: 4500,
    costumer: {
      id: 6,
      name: "João Alfredo"
    },
    game: {
      id: 1,
      name: "Banco Imobiliário",
      categoryId: 7,
      categoryName: "Estratégia"
    }
  },
  ]
  ```
- <b>POST</b>:
  - Request body:
  ```
  {
  customerId: 1,
  gameId: 1,
  daysRented: 3
  }
  ```
- <b>POST</b> (/rentals/:id/return):

  - End the rental period of the board game and complete the returnDate with any aditional fee for delay.

- <b>DELETE</b> (/rentals/:id):
  - Delete the rental information of an especific rental, if the rental was not returned yet.

# Usage

Clone the repository and inside its folder, execute the command `npm i` to install the libraries needed.

Then just execute `npm start` to run the application and make it online.

# Technologies

- NodeJs
- express.Js
- SQL
- postgreSQL

# Deploy

[BoardCamp](https://projeto15-boardcamp-icaro.herokuapp.com/)
