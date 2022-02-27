const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const aggregatePaginate = require('mongoose-aggregate-paginate-v2');

const commentSchema = new Schema({
    commentId: {
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
    isDeleted: {
        type: Boolean,
        default: false,
    }
}, {
    timestamps: true,
});

commentSchema.plugin(aggregatePaginate);
const CommentModel = mongoose.model('comments', commentSchema);

// module.exports = CommentModel;
module.exports = CommentModel;
