const mongoose = require('mongoose')

const subjectSchema = new mongoose.Schema({
    subjectName: {
        type: String,
        required: true,
    },
    createDate: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Subject', subjectSchema, 'subjects')