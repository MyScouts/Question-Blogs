const mongoose = require('mongoose')
const Schema = mongoose.Schema
const aggregatePaginate = require('mongoose-aggregate-paginate-v2')

const notificationSchema = new Schema({
    content: {
        type: String,
        required: true,
    },
    to_userId: {
        type: String,
        required: true,
    },
    form_userId: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ["question", "answer", "comment"],
        required: true,
    },
    isRead: {
        type: Boolean,
        default: false,
    },
    data: {
        type: String,
    }
}, {
    timestamps: true,
})

notificationSchema.plugin(aggregatePaginate)
const NotificationModel = mongoose.model('notifications', notificationSchema)
module.exports = NotificationModel