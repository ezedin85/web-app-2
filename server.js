require("dotenv").config()
const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const usersRoute = require("./routers/usersRoute")
const app = express()

//middlewares
app.use(cors({
    origin: ['https://ennovohub.ennovocreatives.com', 'http://localhost:3000'],
    credentials: true
}));

app.use(express.json())

mongoose.connect(process.env.URL)
    .then(()=>app.listen(8585, ()=>{console.log("listening on port 8585");}))
    .catch(err=>console.log(err))

app.use('/api/users', usersRoute)
app.post('try', (req, res)=>res.json({a: "aa"}))
