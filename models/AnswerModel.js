const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const aggregatePaginate = require('mongoose-aggregate-paginate-v2');

const answerSchema = new Schema({
    answerId: {
        type: String,
        required: true,
        unique: true
    },
    content: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
    postId: {
        type: String,
        required: true,
    },
    isBest: {
        type: Boolean,
        default: false,
    },
    isAccepted: {
        type: Boolean,
        default: false,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    }
}, {
    timestamps: true,
});

answerSchema.plugin(aggregatePaginate);
const AnswerModel = mongoose.model('answers', answerSchema);

// module.exports = AnswerModel;
module.exports = AnswerModel;