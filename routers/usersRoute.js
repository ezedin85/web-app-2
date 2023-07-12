const {addUser, getUsers, confirmToken, confirmPayment} = require('../controllers/usersController')
const express = require("express")
const userAuth = require('../middlewares/userAuth')
const router = express.Router()

// PUBLIC --- localhost:8585/api/users
router.post('/', addUser)

// PUBLIC --- localhost:8585/api/users
router.get('/', getUsers)

// PUBLIC --- localhost:8585/api/users/confirm-token/8iejk213eiu983
router.get('/confirm-token/:token', confirmToken)

//PUBLIC --- --- localhost:8585/api/users/confirm-payment
router.patch('/confirm-payment', userAuth ,confirmPayment)

module.exports = router