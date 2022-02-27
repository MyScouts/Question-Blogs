const CommentModel = require("../models/CommentModel");
const NotificationModel = require("../models/NotificationModel");
const generateSequence = require("../utils/Sequence")

const createComment = async (req, res) => {
    const userId = req.user.userId
    const { content, postId } = req.value.body

    const commentId = await generateSequence("COMMENT", userId);

    const comment = await CommentModel.create({ content, userId, postId, commentId });

    await NotificationModel.create({
        title: "New comment",
        content: `${req.user.firstName} ${req.user.lastName} has commented your post`,
        to_userId: post.userId,
        form_userId: userId,
        type: "comment",
        isRead: false,
        data: postId
    })

    return responseSuccess(res, 200, "Create comment successfully!", comment)
}

// module.exports
module.exports = {
    createComment
}
