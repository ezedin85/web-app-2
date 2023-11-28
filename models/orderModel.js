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
            order_quantity: {
                type: Number,
                required: true,
            },
            sold_quantity: Number,
            unit_cost: Number
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