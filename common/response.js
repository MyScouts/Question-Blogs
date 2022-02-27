const responseSuccess = (res, resultCode, message, data = null) => {
    return res.status(200).json({
        success: true,
        status: resultCode,
        message: message,
        data: data
    });
}

const responseFail = (res, resultCode, message) => {
    return res.status(400).json({
        success: true,
        status: resultCode,
        message: message,
        data: null
    });
}

module.exports = {
    responseSuccess,
    responseFail
}