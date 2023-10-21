const CustomError = require('../utils/customError');

const handleErrors = (err, req, res, next) => {
    let error = { ...err };

    error.message = err.message;

    if (!error.isOperational) {
        console.error('Unhandled Error:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Something went wrong!'
        });
    }

    res.status(error.statusCode || 500).json({
        status: error.status,
        message: error.message
    });
};

module.exports = handleErrors;
