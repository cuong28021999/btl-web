// import jwt
const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    const token = req.header('token')

    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET)
        req._id = verified._id
        next()
    } catch(err) {
        return res.status(400).send(err)
    }
}