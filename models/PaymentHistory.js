const mongoose = require('mongoose')
const Schema = mongoose.Schema
const aggregatePaginate = require('mongoose-aggregate-paginate-v2')

const paymentHistorySchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true,
    },
    
    paymentId: {
        type: Schema.Types.ObjectId,
        ref: 'payments',
    },
    content: {
        type: String,
        required: true,
    },
    point: {
        type: Number,
        required: true,
    },
    coin: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        default: "success",
        enum: ["success", "failed"]
    }
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

paymentHistorySchema.plugin(aggregatePaginate);
const PaymentHistoryModel = mongoose.model('payment_histories', paymentHistorySchema)
module.exports = PaymentHistoryModel