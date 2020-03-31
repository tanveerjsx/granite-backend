const express = require('express');
const path = require('path');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const authenticate = require('./api/middleware/authenticate');
require('dotenv').config();

app.use(morgan('dev'));

mongoose
  .connect(
    'mongodb+srv://usman:usman321@cluster0-iqnxj.mongodb.net/granite_staging?retryWrites=true&w=majority',
    { useNewUrlParser: true, useUnifiedTopology: true, authSource: 'admin' },
  )
  .then(() => console.log('DB Connected'))
  .catch(error => {
    console.log('connection error', error.message);
  });
// .connect(
//   `mongodb://localhost/Granite`,
//   { useNewUrlParser: true, useUnifiedTopology: true, authSource: 'admin' },
// )

const categoryRoutes = require('./api/routes/categories');
const userRoutes = require('./api/routes/users');
const productRoutes = require('./api/routes/products');
const cartItemRoutes = require('./api/routes/cartItems');
const orderRoutes = require('./api/routes/orders');
const roleRoutes = require('./api/routes/roles');
const couponRoutes = require('./api/routes/coupon');
const articleRoutes = require('./api/routes/article');
const feedbackRoutes=require('./api/routes/feedback')

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/category', categoryRoutes);
app.use('/users', userRoutes);
app.use('/roles', roleRoutes);
app.use('/products', productRoutes);
app.use('/article', articleRoutes);
app.use('/coupon', couponRoutes);
app.use('/cart', authenticate, cartItemRoutes);
app.use('/order', orderRoutes);
app.use('/feedback',feedbackRoutes)
app.use('/', (req, res, next) => {
  res.status(304).send('Application Server is running');
});
app.use((req, res, next) => {
  res.status(404).json({
    message: 'Route Not Found',
  });
});
const port = process.env.PORT || 3003;
app.listen(port, () => {
  console.log(`server running on port ${port}...`);
});
