import createHttpError from "http-errors"

export const badRequest = (err, res) => {
    
    const error = createHttpError.BadRequest(err)
    
    res.status(error.status).json({
        err: 1,
        mes: error.message
    })
}

export const internalServerError = (req, res) => {
    const error = createHttpError.InternalServerError()
    res.status(error.status).json({
        err: 1,
        mes: error.message
    })
}

export const notFound = (req, res) => {
    const error  = createHttpError.NotFound('This route is not defined')
    res.status(error.status).json({
        err: 1,
        mes: error.message
    })
}

export const notAuth = (err, res) => {
    const error = createHttpError.Unauthorized(err)
    return res.status(error.status).json({
        err: 1,
        mes: error.message
    })
}


export const forbidden = (err, res) => {
    const error = createHttpError.Forbidden(err)
    return res.status(error.status).json({
        err: 2,
        mes: error.message
    })
}