const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const aggregatePaginate = require('mongoose-aggregate-paginate-v2');

const userLikePostSchema = new Schema({
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

userLikePostSchema.plugin(aggregatePaginate);
const UserLikePostModel = mongoose.model('user_like_post', userLikePostSchema);

// module.exports = UserLikePostModel;
module.exports = UserLikePostModel;