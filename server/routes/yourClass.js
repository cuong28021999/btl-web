const router = require('express').Router()

//verify Token
const verifyToken = require('../middlewares/verifyToken')

// verify teacher 
const verifyTeacher = require('../middlewares/verifyTeacher')

// getPermission
const getPermission = require('../middlewares/getPermission')

// Class model
const Class = require('../models/Class')

router.post('/', verifyTeacher, async (req, res) => {
    const className = req.body.className
    const maxMember = req.body.maxMember
    const userId = req._id

    const newClass = new Class({
        className: className,
        userId: userId,
        maxMember: maxMember
    })

    try {
        const savedClass = await newClass.save()
        res.status(200).send(savedClass.classCode)
    } catch (err) {
        res.status(400).send(err)
    }
})

// get all class 
router.get('/', getPermission, async (req, res) => {
    const userId = req._id

    const permission = req.permission
    if (permission === 'teacher') {
        try {
            const classes = await Class.find({ userId: userId })
            if (classes) res.status(200).send(classes)
        } catch (err) {
            res.status(400).send(err)
        }
    }

    if (permission === 'student') {
        try {
            const classes = await Class.find({ members: userId })
            res.status(200).send(classes)
        } catch (err) {
            res.status(400).send(err)
        }
    }
})

// get class with class code 
router.get('/:classCode', async (req, res) => {
    const classCode = req.params.classCode

    try {
        const myClass = await Class.findOne({ classCode: classCode })
        if (!myClass) return res.status(400).send("Don't have class")
        res.status(200).send(myClass)
    } catch (err) {
        res.status(400).send(err)
    }
})

router.delete('/:classId', verifyTeacher, async (req, res) => {
    const classId = req.params.classId

    try {
        await Class.deleteOne({ _id: classId })
        res.status(200).send('Delete success')
    } catch (err) {
        res.status(400).send(err)
    }
})

router.delete('/:classId/deleteMember/:userId', verifyTeacher, async (req, res) => {
    const classId = req.params.classId
    const userId = req.params.userId

    try {
        await Class.findOneAndUpdate({_id: classId}, {"$pull": {members: userId}})
        res.status(200).send('Delete success')
    } catch (err) {
        res.status(400).send(err)
    }
})

router.patch('/:classId/changeInfo', verifyTeacher, async (req, res) => {
    const classId = req.params.classId
    const className = req.body.className
    const maxMember = req.body.maxMember

    try {
        await Class.findOneAndUpdate({ _id: classId }, { className: className, maxMember: maxMember })
        res.status(200).send('Update success')
    } catch (err) {
        res.status(400).send(err)
    }
})

router.patch('/:classId/join', async (req, res) => {
    const classId = req.params.classId
    const userId = req._id

    try {
        await Class.findOneAndUpdate({ _id: classId }, { "$push": { members: userId } })
        res.status(200).send('Update success')
    } catch (err) {
        res.status(400).send(err)
    }
})

module.exports = router