const mongoose = require('mongoose')
const Schema = mongoose.Schema

const sequenceSchema = new Schema({
    key: {
        type: String,
        uppercase: true,
    },
    prefix: {
        type: String,
        uppercase: true,
    },
    number: {
        type: Number,
        default: 1
    }
})

const SequenceModel = mongoose.model('sequence', sequenceSchema)
module.exports = SequenceModel
