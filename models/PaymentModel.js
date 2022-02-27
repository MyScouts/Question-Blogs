let mongoose = require('mongoose')
let Schema = mongoose.Schema

let paymentSchema = new Schema({
    userId: {
        type: String,
        required: true,
    },
    stripeId: {
        type: String,
        required: true,
    },
    paymentMethod: {
        type: String,
        required: true,
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    cardNumber: {
        type: String,
        required: true,
    },
    expiryDate: {
        type: String,
        required: true,
    },
    cvv: {
        type: String,
        required: true,
    },
    logical_delete: {
        type: Date,
        default: null
    },
}, {
    timestamps: true,
    toJSON: {
        transform: (doc, ret) => {
            delete ret.__v
            delete ret.logical_delete
            return ret;
        }
    }
})

paymentSchema.index({ userId: 1, method: 1, cardNumber: 1 }, { unique: true })
const PaymentModel = mongoose.model('payments', paymentSchema)
module.exports = PaymentModel