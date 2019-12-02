const mongoose = require('mongoose')

const questionSchema = new mongoose.Schema({
    category: {
        type: String
    },
    subjectName: {
        type: String
    },
    question: {
        type: String,
        required: true,
        min: 0,
        max: 1024
    },
    choices: {
        type: Array,
        min: 1,
        max: 100
    },
    answers: {
        type: Array,
        min: 0,
        max: 100
    },
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Question', questionSchema, 'questions')