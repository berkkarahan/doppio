// IP middleware for express
const getIpInfoMiddleware = async (req, res, next) => {
    let xForwardedFor = (req.headers['x-forwarded-for'] || '').replace(/:\d+$/, '')
    let ip = xForwardedFor || req.connection.remoteAddress
    req.IPAdress = ip
    next()
}

export default {
    getIpInfoMiddleware
}