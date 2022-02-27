const AppConfig = require("../common/config")
const { responseSuccess } = require("../common/response")
const NotificationModel = require("../models/NotificationModel")

const getMyNotificationsMethod = async (req, res) => {

    const userId = req.user.userId
    console.log("🚀 ~ file: NotificationController.js ~ line 7 ~ getMyNotificationsMethod ~ userId", userId)
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
            $sort: { createdAt: -1 }
        }
    ])

    const paginateQuery = await NotificationModel.aggregatePaginate(notificationQuery, AppConfig.PAGINATE_CONFIG(page, pageSize))
    return responseSuccess(res, 200, "Get my notifications successfully!", paginateQuery)

}


module.exports = {  
    getMyNotificationsMethod

}