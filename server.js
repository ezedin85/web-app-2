require("dotenv").config()
const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const adminRoutes = require("./routers/adminRoutes")
const productRoutes = require("./routers/productRoutes")
const orderRoutes = require("./routers/orderRoutes")

const app = express()

//middlewares
app.use(cors({
    origin: ['http://localhost:3000', 'https://delb4.ennovocreatives.com'],
    credentials: true
}));

app.use(express.json({limit: '50mb'}))

app.use('/api/admins', adminRoutes)
app.use('/api/products', productRoutes)
app.use('/api/orders', orderRoutes)

mongoose.connect(process.env.URL)
    .then(()=>app.listen(5000, ()=>{console.log("listening on port 5000");}))
    .catch(err=>console.log(err))
