const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    permission: {
        type: String,
        required: true
    },
    createDate: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('User', userSchema, 'users')