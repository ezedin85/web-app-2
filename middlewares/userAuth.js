const jwt = require('jsonwebtoken')
const usersModel = require('../models/usersModel')
require('dotenv').config()


const userAuth = async (req, res, next)=>{
    const {authorization} = req.headers
    if(!authorization){
        return res.status(401).json({error: "Authorization required!"})
    }

    try {
        const token = authorization.split(' ')[1]
        const {id} = jwt.verify(token, process.env.SECRET)
        req.userId = await usersModel.findOne({_id: id}).select('_id')
        next()
    } catch (error) {
        res.status(400).json({error: "Request not authorized"})
    }
}

module.exports = userAuth