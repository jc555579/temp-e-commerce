require('dotenv').config(); // processing .env

// express
const express = require('express');
const app = express();

// for logger (if request is successfull or not)
const morgan = require('morgan');

// cookie parser
const cookieParser = require('cookie-parser'); 

// file upload
const fileUpload = require('express-fileupload');

// security
const helmet = require('helmet');
const cors = require('cors');

// database
const connectDB = require('./db/connect');

// routers
const authRouter = require('./routes/authRoutes');
const userRouter = require('./routes/userRoutes');
const productRouter = require('./routes/productRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const orderRouter = require('./routes/orderRoutes');

// middleware folder
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

// logger (for development)
app.use(morgan('tiny'));

// security
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));
app.use(helmet());
app.use(cors());

app.use(express.static('./public'));
app.use(fileUpload());

app.get('/', (req, res) => {
  res.send('e-commerce api');
});

// test route
app.get('/api/v1', (req, res) => {
  console.log(req.signedCookies); // signed cookies
  res.send('e-commerce api');
});

// api endpoints
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/products', productRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use ('/api/v1/orders', orderRouter);


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
