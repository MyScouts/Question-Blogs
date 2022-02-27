const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const aggregatePaginate = require('mongoose-aggregate-paginate-v2');

const postSchema = new Schema({
    postId: {
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
    subject: {
        type: String,
        required: true,
    },
    grade: {
        type: String,
        required: true,
    },
    level: {
        // 1: khó , 2: trung bình, 3: dễ
        type: Number,
        required: true,
    },
    status: {
        // 1: bình thường, 2: gấp 
        type: Number,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    couponId: {
        type: String,
        required: false,
    },
}, {
    timestamps: true,
});

postSchema.plugin(aggregatePaginate);
const PostModel = mongoose.model('posts', postSchema);
module.exports = PostModel;