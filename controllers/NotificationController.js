const AppConfig = require("../common/config")
const { responseSuccess } = require("../common/response")
const NotificationModel = require("../models/NotificationModel")

const getMyNotificationsMethod = async (req, res) => {
    const userId = req.user.userId
    const { page, pageSize } = req.query

    const notificationQuery = NotificationModel.aggregate([
        {
            $match: { to_userId: userId }
        }, {
            $lookup: {
                from: "users",
                localField: "form_userId",
                foreignField: "userId",
                as: "form_user"
            }
        }, {
            $project: {
                notificationId: 1,
                to_userId: 1,
                form_userId: 1,
                form_user: { $arrayElemAt: ["$form_user", 0] },
                type: 1,
                isRead: 1,
                data: 1
            }
        }, {
            $sort: { createdAt: -1 }
        }
    ])

    const paginateQuery = await NotificationModel.aggregatePaginate(notificationQuery, AppConfig.PAGINATE_CONFIG(page, pageSize))
    return responseSuccess(res, 200, "Get my notifications successfully!", paginateQuery)
}

const makeReadNotificationMethod = async (req, res) => {
    const notificationId = req.params.notificationId
    const userId = req.user.userId
    const notification = await NotificationModel.findOneAndUpdate({ _id: notificationId, to_userId: userId }, { isRead: true }, { new: true })
    return responseSuccess(res, 200, "Make read notification successfully!", notification)
}

const deleteNotificationMethod = async (req, res) => {
    const notificationId = req.params.notificationId
    const userId = req.user.userId
    await NotificationModel.findOneAndDelete({ _id: notificationId, to_userId: userId })
    return responseSuccess(res, 200, "Delete notification successfully!")
}

module.exports = {
    getMyNotificationsMethod,
    makeReadNotificationMethod,
    deleteNotificationMethod

}