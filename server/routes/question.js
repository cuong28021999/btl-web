const router = require('express').Router()

//verify Token
const verifyToken = require('../middlewares/verifyToken')

// verify teacher 
const verifyTeacher = require('../middlewares/verifyTeacher')

// getPermission
const getPermission = require('../middlewares/getPermission')

// get all subject
const getAllSubject = require('../middlewares/getAllSubject')

// questions model
const Question = require('../models/Question')
const Exam = require('../models/Exam')

// create question
router.post('/', async (req, res) => {
    const category = req.body.category
    const question = req.body.question
    const choices = req.body.choices
    const answers = req.body.answers
    const examId = req.body.examId
    const subjectName = req.body.subjectName

    if (category === 'sentence') {
        const newQuestion = new Question({
            category: category,
            subjectName: subjectName,
            question: question
        })

        try {
            const savedQuestion = await newQuestion.save()
            if (savedQuestion) {
                await Exam.findOneAndUpdate({_id: examId}, { "$push": {questions: savedQuestion._id.toString()}})
            }
            return res.status(200).send(savedQuestion)
        } catch (err) {
            return res.status(400).send(err)
        }
    } else {
        const newQuestion = new Question({
            category: category,
            subjectName: subjectName,
            question: question,
            choices: choices,
            answers: answers,
        })

        try {
            const savedQuestion = await newQuestion.save()
            if (savedQuestion) {
                await Exam.findOneAndUpdate({_id: examId}, { "$push": {questions: savedQuestion._id.toString()}})
            }
            return res.status(200).send(savedQuestion)
        } catch (err) {
            return res.status(400).send(err)
        }
    }
})

// get all by subject name
router.post('/getBySubject', async (req, res) => {
    const subjectName = req.body.subjectName

    try {
        const questions = await Question.find({subjectName: subjectName})
        res.status(200).send(questions)
    } catch (err) {
        res.status(400).send(err)
    }
})

// get question by Id
router.get('/:questionId', async (req, res) => {
    const questionId = req.params.questionId

    try {
        const question = await Question.findOne({ _id: questionId })
        if (question) res.status(200).send(question)
    } catch (err) {
        res.status(400).send(err)
    }
})

// delete question by Id
router.delete('/:questionId', async (req, res) => {
    const questionId = req.params.questionId

    try {
        await Exam.deleteOne({ _id: questionId })
        res.status(200).send('Delete done')
    } catch (err) {
        res.status(400).send(err)
    }
})


module.exports = router