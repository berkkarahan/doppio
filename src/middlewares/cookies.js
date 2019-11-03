const makeCookiesObject = async (req, res, next) => {
    let cookiesObject
    req.headers.cookies.split('; ').forEach((pair) => {
        let splittedPair = pair.split('=')
        cookiesObject[splittedPair[0]] = splittedPair[1]
    })
    // added json to req header, delete .cookies from request. no need to carry same information twice.
    req.cookiesObject = cookiesObject
    delete req.headers.cookies
    next()
}

export default {
    makeCookiesObject
}