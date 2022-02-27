const authRouters = require('./AuthRouter')
const notificationRouters = require('./NotificationRouter')
const postRouters = require('./PostRouter')
const paymentRouters = require('./PaymentRouter')

// 
const AppRouters = (app) => {
    app.use('/api/auth', authRouters)
    app.use('/api/notification', notificationRouters)
    app.use('/api/post', postRouters)
    app.use('/api/payment', paymentRouters)
}

module.exports = AppRouters