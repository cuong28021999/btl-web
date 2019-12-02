const mongoose = require('mongoose')

const examSchema = new mongoose.Schema({
    examName: {
        type: String,
        required: true,
    },
    classId: {
        type: String,
        required: true
    },
    timeStart: {
        type: Date,
        required: true
    },
    timeLimit: {
        type: Number,
        required: true
    },
    subjectName: {
        type: String,
        required: true
    },
    questions: {
        type: Array,
        default: []
    },
    createDate: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Exam', examSchema, 'exams')