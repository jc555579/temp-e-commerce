require('dotenv').config(); // processing .env

// express
const express = require('express');
const app = express();

// db
const connectDB = require('./db/connect');

// security
const helmet = require('helmet');
const cors = require('cors');

// middleware folder
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.use(express.json());
app.use(helmet());
app.use(cors());

// for testing
app.get('/', (req, res) => {
  res.send('E-Commerce API!');
});

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

// middleware for routes


const PORT = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
     
    app.listen(PORT, () => {
      console.log(`server is listening at port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
