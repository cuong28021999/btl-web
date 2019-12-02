const Subject = require('../models/Subject')

module.exports = async (req, res, next) => {
    try {
        const subjects = await Subject.find({})
        if (!subjects) res.status(400).send('Subject does not exist!')
        req.subjects = subjects
        next()
    } catch(err) {
        return res.status(400).send(err)
    }
}