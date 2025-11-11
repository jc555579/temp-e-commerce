require('dotenv').config(); // processing .env

// express
const express = require('express');
const app = express();

// for logger (if request is successfull or not)
const morgan = require('morgan');
// security
const helmet = require('helmet');
const cors = require('cors');

// database
const connectDB = require('./db/connect');

// routers
const authRouter = require('./routes/authRoutes');

// middleware folder
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.use(morgan('tiny'));
app.use(express.json());
app.use(helmet());
app.use(cors());

app.get('/', (req, res) => {
  res.send('e-commerce api');
});

app.use('/api/v1/auth', authRouter);


// middleware for routes
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);


const PORT = process.env.PORT || 5000;

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
