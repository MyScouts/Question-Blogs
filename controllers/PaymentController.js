const { responseSuccess } = require('../common/response');
const PaymentHistoryModel = require('../models/PaymentHistory');
const PaymentModel = require('../models/PaymentModel');
const UserModel = require('../models/UserModel');
const { createPaymentMethod } = require('./StripeController');

const newPaymentMethod = async (req, res, next) => {
    const { cardExpiration, cardNumber, firstName, lastName, method, securityCode } = req.value.body
    let userInfo = await UserModel.findOne({ _id: req.user._id })

    if (!userInfo) {
        return res.status(200).json({
            status: 404,
            success: false,
            message: "User not found",
            data: null
        })
    } else {
        const checkExist = await PaymentModel.findOne({ userId: req.user.userId, cardNumber: cardNumber })
        if (checkExist) {
            return responseSuccess(res, 301, "Card number is already exist");
        }
        const stripeId = await createPaymentMethod(userInfo.customerId, {
            number: cardNumber,
            expMonth: parseInt(cardExpiration.split('/')[0]),
            expYear: parseInt(`20${cardExpiration.split('/')[1]}`),
            cvc: securityCode,
            name: `${firstName} ${lastName}`
        })
        const payment = await new PaymentModel({
            userId: userInfo.userId,
            paymentMethod: method,
            firstName: firstName,
            lastName: lastName,
            expiryDate: cardExpiration,
            cardNumber: cardNumber,
            cvv: securityCode,
            stripeId: stripeId
        }).save()
        await new PaymentHistoryModel({
            userId: userInfo._id,
            paymentId: payment._id,
            content: "Tạo mới phương thức thanh toán",
            point: 0,
            coin: 0,
        }).save()
        return res.status(200).json({
            status: 200,
            success: true,
            message: "Create payment method success",
        })
        // }
    }
}

const paymentsMethod = async (req, res, next) => {
    const payments = await PaymentModel.find({ userId: req.user._id, logical_delete: null })

    return res.status(200).json({
        status: 200,
        success: true,
        message: "",
        data: payments
    })
}

const deletePaymentMethod = async (req, res, next) => {
    const paymentId = req.value.params.paymentId
    const payment = await PaymentModel.findOne({ _id: paymentId })
    payment.logical_delete = new Date()
    await payment.save()
    return res.status(200).json({
        status: 200,
        success: true,
        message: "",
    });
}

const updatePaymentMethod = async (req, res, next) => {
    const paymentId = req.value.params.paymentId
    const { cardExpiration, cardNumber, firstName, lastName, method, securityCode } = req.value.body
    const payment = await PaymentModel.findOne({ _id: paymentId })
    payment.paymentMethod = method
    payment.firstName = firstName
    payment.lastName = lastName
    payment.cardNumber = cardNumber
    payment.cvv = securityCode
    payment.expiryDate = cardExpiration
    await payment.save()
    return res.status(200).json({
        status: 200,
        success: true,
        message: "",
    });
}


const paymentHistory = async (req, res, next) => {
    const queryHistories = PaymentHistoryModel.aggregate([
        {
            $match: {
                userId: req.user._id
            }
        },
        {
            $lookup: {
                from: "payments",
                localField: "paymentId",
                foreignField: "_id",
                as: "payment"
            }
        },
        {
            $project: {
                content: 1,
                point: 1,
                coin: 1,
                status: 1,
                createdAt: { $dateToString: { format: "%Y-%m-%d %H:%M:%S", date: "$createdAt" } },
                payment: {
                    $arrayElemAt: ["$payment", 0]
                }
            }
        },
        {
            $sort: {
                createdAt: -1
            }
        },
    ])
    const paymentHistory = await PaymentHistoryModel.aggregatePaginate(queryHistories, PAGINATE_CONFIG(req.query.page, req.query.pageSize));
    return res.status(200).json({
        status: 200,
        success: true,
        message: "",
        data: paymentHistory
    })
}


module.exports = {
    newPaymentMethod,
    paymentsMethod,
    deletePaymentMethod,
    updatePaymentMethod,
    paymentHistory
}