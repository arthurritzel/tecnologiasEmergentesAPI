import httpStatus from 'http-status';

export default (schema) => (req, res, next) => {
    try {
        schema.validateSync(req.body, {
            abortEarly: false,
            recursive: true
        })
        next()
    } catch (error) {
        const {message, errors} = error
        res
            .status(httpStatus.PAYMENT_REQUIRED)
            .json({
                message,
                errors
            })
    }
}