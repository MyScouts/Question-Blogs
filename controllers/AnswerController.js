const { responseSuccess } = require("../common/response")
const AnswerModel = require("../models/AnswerModel")
const NotificationModel = require("../models/NotificationModel")

const newAnswer = (req, res) => {
    const userId = req.user.userId
    const { content, postId } = req.value.body

    const answerId = generateSequence("ANSWER", userId)
    const answer = await AnswerModel.create({ content, userId, postId, answerId })

    await NotificationModel.create({
        title: "New answer",
        content: `${req.user.firstName} ${req.user.lastName} has answered your question`,
        to_userId: post.userId,
        form_userId: userId,
        type: "answer",
        isRead: false,
        data: answerId
    })

    return responseSuccess(res, 200, "Create answer successfully!", answer)
}

const setBestAnswer = async (req, res) => {
    const userId = req.user.userId
    const { answerId } = req.value.body

    const answer = await AnswerModel.findOne({ answerId })
    if (!answer) return responseSuccess(res, 400, "Answer not found")
    if (answer.userId === userId) return responseSuccess(res, 400, "You are not allowed to set best answer")
    if (answer.isBest) return responseSuccess(res, 400, "This answer is already best answer")

    await AnswerModel.updateOne({ answerId }, { isBest: true })
    await NotificationModel.create({
        title: "Best answer",
        content: `${req.user.firstName} ${req.user.lastName} has set best answer for your question`,
        to_userId: answer.userId,
        form_userId: userId,
        type: "answer",
        isRead: false,
        data: answerId
    })

    return responseSuccess(res, 200, "Set best answer successfully!")
}


module.exports = {
    newAnswer,
    setBestAnswer
}