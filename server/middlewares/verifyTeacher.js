const User = require('../models/User')

module.exports = async (req, res, next) => {
    try {
        const user = await User.findOne({_id: req._id})
        if (!user) return res.status(400).send('User does not exist!')
        if (user.permission === 'teacher') return next()
        else return res.status(400).send('Permission denied!')
    } catch(err) {
        return res.status(400).send(err)
    }
}