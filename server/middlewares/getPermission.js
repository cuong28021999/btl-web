const User = require('../models/User')

module.exports = async (req, res, next) => {
    try {
        const user = await User.findOne({_id: req._id})
        if (!user) res.status(400).send('User does not exist!')
        req.permission = user.permission
        next()
    } catch(err) {
        return res.status(400).send(err)
    }
}