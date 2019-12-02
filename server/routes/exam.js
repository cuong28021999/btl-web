const router = require('express').Router()

//verify Token
const verifyToken = require('../middlewares/verifyToken')

// verify teacher 
const verifyTeacher = require('../middlewares/verifyTeacher')

// getPermission
const getPermission = require('../middlewares/getPermission')

// get all subject
const getAllSubject = require('../middlewares/getAllSubject')

// Exam model
const Exam = require('../models/Exam')

// create exam
router.post('/', verifyTeacher, async (req, res) => {
    const examName = req.body.examName
    const classId = req.body.classId
    const timeStart = req.body.timeStart
    const timeLimit = req.body.timeLimit
    const subjectName = req.body.subjectName

    const newExam = new Exam({
        examName: examName,
        classId: classId,
        timeStart: timeStart,
        timeLimit: timeLimit,
        subjectName: subjectName
    })

    try {
        const savedExam = await newExam.save()
        if (savedExam) res.status(200).send('Create success')
    } catch(err) {
        res.status(400).send(err)
    }
})

// get all exam
router.get('/:classId/all', async (req, res) => {
    const classId = req.params.classId

    try {
        const exams = await Exam.find({ classId: classId })
        if (exams) res.status(200).send(exams)
    } catch (err) {
        res.status(400).send(err)
    }
})

// get exam by Id
router.get('/:examId', async (req, res) => {
    const examId = req.params.examId

    try {
        const exam = await Exam.findOne({ _id: examId })
        if (exam) res.status(200).send(exam)
    } catch (err) {
        res.status(400).send(err)
    }
})


//delete exam

router.delete('/:examId', async (req, res) => {
    const examId = req.params.examId

    try {
        const exam = await Exam.deleteOne({ _id: examId })
        if (exam) res.status(200).send(exam)
    } catch (err) {
        res.status(400).send(err)
    }
})


router.patch('/:examId/changeInfo', verifyTeacher, async (req, res) => {
    const examId = req.params.examId
    const examName = req.body.examName
    const timeStart = req.body.timeStart
    const timeLimit  = req.body.timeLimit
    const subjectName = req.body.subjectName

    try {
        await Exam.findOneAndUpdate(
            { _id: examId }, 
            { 
                examName: examName, 
                timeStart: timeStart, 
                timeLimit: timeLimit, 
                subjectName: subjectName
            })
        res.status(200).send('Update success')
    } catch (err) {
        res.status(400).send(err)
    }
})

router.patch('/:examId/deleteQuestion', verifyTeacher, async (req, res) => {
    const examId = req.params.examId
    const questionId = req.body.questionId

    try {
        await Exam.findOneAndUpdate(
            { _id: examId }, 
            { 
                "$pull": {questions: questionId}
            })
        res.status(200).send('Update success')
    } catch (err) {
        res.status(400).send(err)
    }
})

router.patch('/:examId/addQuestion', verifyTeacher, async (req, res) => {
    const examId = req.params.examId
    const questionId = req.body.questionId

    try {
        await Exam.findOneAndUpdate(
            { _id: examId }, 
            { 
                "$push": {questions: questionId}
            })
        res.status(200).send('Update success')
    } catch (err) {
        res.status(400).send(err)
    }
})

module.exports = router