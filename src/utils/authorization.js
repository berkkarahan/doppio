// route authorization
export const authorizeRoute = (req) => {
    try {
        if (req.decodedPayload.role === 'admin' || ((req.decodedPayload.username === req.body.username) || (req.decodedPayload.email === req.body.email))) {
            return true
        } else {
            false
        }
    } catch (err) {
        throw new Error(err)
    }
} 