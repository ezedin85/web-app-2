require('dotenv').config()
const jwt = require('jsonwebtoken')
const userModel = require('../models/usersModel')
const nodemailer = require("nodemailer");


const transporter = nodemailer.createTransport({
    host: "mail.ennovocreatives.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.USER,
        pass: process.env.PASSWORD
    }
});

const html = "<b>Hello world?</b>"


const addUser = async (req, res) => {
    const { firstName, lastName, contact, email, bank, package } = req.body
    console.log("a");
    try {
        const user = await userModel.register(firstName, lastName, contact, email, bank, package) //registering to the database
        const token = jwt.sign({id: user._id}, process.env.SECRET, {}) //token doesn't expire
        const url = `localhost:3000/api/users/confirmation/${token}`

        const info = await transporter.sendMail({
            from: '"Ennovo Team 👻" <admin@ennovocreatives.com>', // sender address
            to: email, // list of receivers
            subject: "Confirm your payment", // Subject line
            // text: "Hello world?", // plain text body
            html: `<b>Hello, Hello, there, confirm your payment <a href="${url}"> ${url}</a> </b>`, // html body
        });
        console.log("Message sent: %s", info.messageId);
        res.json({token})
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

const confirmToken = async(req, res)=>{
    const {token} = req.params
    try {
        const {id} = jwt.verify(token, process.env.SECRET)
        const user = await userModel.findOne({_id: id}).select("validated trn bank package")
        res.json(user)
    } catch (error) {
        res.status(404).json({error: error.message})
    }
}

const confirmPayment = async(req, res)=>{
    const {depositor, trn} = req.body
    try {
        const updatedData = await userModel.findByIdAndUpdate(req.userId, {depositor, trn}, {new: true, runValidators: true})
        res.json({updated: true})
    } catch (error) {
        res.status(404).json("user not found")
    }
}

const getUsers = async (req, res) => {
    const users = await userModel.find()
    res.json(users)
}

module.exports = {
    addUser,
    getUsers,
    confirmToken,
    confirmPayment
}

