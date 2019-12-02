const mongoose = require('mongoose')

const shortId = require('short-id')

const classSchema = new mongoose.Schema({
    className: {
        type: String,
        required: true,
    },
    classCode: {
        type: String,
        default: shortId.generate()
    },
    userId: {
        type: String,
        required: true
    },
    members: {
        type: Array,
        default: []
    },
    maxMember: {
        type: Number,
        required: true
    },
    createDate: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Class', classSchema, 'classes')