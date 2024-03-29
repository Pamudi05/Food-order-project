const express = require('express');
var cors = require('cors');
const connection = require('./connection');
const userRoute = require('./routes/user')
const categoryRoute = require('./routes/category')
const productRoute = require('./routes/product')
const dashboardRoute = require('./routes/dashboard')
const orderRoute = require('./routes/orders')
const imagesRoute = require('./routes/product')
const app =express();

app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use('/user', userRoute);
app.use('/category', categoryRoute);
app.use('/product', productRoute);
app.use('/dashboard', dashboardRoute);
app.use('/orders', orderRoute);
app.use('/profile', imagesRoute , express.static('upload/images'));

module.exports = app;