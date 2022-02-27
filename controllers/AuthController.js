const AppConfig = require("../common/config")
const { responseSuccess } = require("../common/response")
const UserModel = require("../models/UserModel")
const { addDateWithNow, getTimeNow } = require("../utils/DateTime")
const bcrypt = require('bcryptjs')
const JWT = require("jsonwebtoken")
const generateSequence = require("../utils/Sequence")
const { createCustomer } = require("./StripeController")

const encodedToken = (userID) => {
    return JWT.sign({
        iss: "QUESTION BLOG APP",
        sub: userID,
        iat: getTimeNow(),
        exp: addDateWithNow(6)
    }, AppConfig.PASSPORT_SECRET)
}

const registerMethod = async (req, res, next) => {
    const { firstName, lastName, email, password, phoneNumber, roles } = req.value.body
    // check user is exsit
    if (email) {
        const foundUser = await UserModel.findOne({ email })
        if (foundUser) return responseSuccess(res, 301, "Email is already exist")
    }

    if (roles && ['teacher', 'student'].includes(roles) < 0) {
        return responseSuccess(res, 302, "roles invalid!")
    }

    let prefix = "T";
    if (roles === "student") {
        prefix = "S"
    }
    const userId = await generateSequence("USER", prefix)
    const salt = await bcrypt.genSalt(10)
    const passwordHashed = await bcrypt.hash(password, salt)
    const customerId = await createCustomer(email)
    const newUser = await new UserModel({ firstName, lastName, email, password: passwordHashed, phoneNumber, roles, userId, customerId }).save()
    const token = encodedToken(newUser._id)
    return responseSuccess(res, 200, "Register successfully!", {
        successToken: token,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        roles: newUser.roles
    })

}

const loginMethod = async (req, res, next) => {
    const { email, password } = req.value.body
    const foundUser = await UserModel.findOne({ email })
    if (!foundUser) return responseSuccess(res, 301, "Email is not exist")

    const isMatch = await foundUser.comparePassword(password);
    if (!isMatch) return responseSuccess(res, 302, "Password is not match")
    const token = encodedToken(foundUser._id)
    return responseSuccess(res, 200, "Login successfully!", {
        successToken: token,
        firstName: foundUser.firstName,
        lastName: foundUser.lastName,
        roles: foundUser.roles
    })
}

const AuthController = {
    registerMethod,
    loginMethod
}

module.exports = AuthController