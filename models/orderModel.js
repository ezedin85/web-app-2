const mongoose = require('mongoose')

const orderSchema = mongoose.Schema({
    customer_name: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    products: [
        {
            product: {
                type: mongoose.Types.ObjectId,
                ref: 'Product',
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            },
            sold_quantity: Number,
            price: Number
        }
    ],
    status: {
        type: String,
        required: true,
        default: 'ordered'
    },
    paid: Number
}, { timestamps: true })

module.exports = mongoose.model('Order', orderSchema)