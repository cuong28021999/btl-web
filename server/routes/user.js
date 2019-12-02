const router = require('express').Router()

// import User models
const User = require('../models/User')

// import bcrypt
const bcrypt = require('bcryptjs')

// import jwt
const jwt = require('jsonwebtoken')

//verify Token
const verifyToken = require('../middlewares/verifyToken')

router.get('/:userId', async (req, res) => {
    const userId = req.params.userId

    const user = await User.findOne({ _id: userId })
    if (!user) return res.status(400).send("Account does not exist!")

    res.status(200).send(user)
})

router.post('/login', async (req, res) => {
    const email = req.body.email
    const password = req.body.password
    // validate in client

    // check email correct
    const user = await User.findOne({ email: email })

    if (!user) return res.status(400).send('Email not correct!')

    // if email correct
    const isPasswordCorrect = bcrypt.compareSync(password, user.password)

    // if password not correct
    if (!isPasswordCorrect) return res.status(400).send('Password not correct!')

    // if password correct
    var token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET)
    return res.status(200).send({
        token: token, 
        username: user.username,
        userId: user._id,
        permission: user.permission
    })
})

router.post('/register', async (req, res) => {
    const username = req.body.username
    const email = req.body.email
    const password = req.body.password
    const permission = req.body.permission
    // validate in client

    // check email exist
    const emailExist = await User.findOne({ email: email })

    if (emailExist) return res.status(400).send('Email has exist!')

    // if email does not exist
    // hash password
    const salt = bcrypt.genSaltSync(10)
    const hashedPassword = bcrypt.hashSync(password, salt)

    // create new user
    const newUser = new User({
        username: username,
        email: email,
        password: hashedPassword,
        permission: permission
    })

    try {
        const savedUser = await newUser.save()
        return res.status(200).send(savedUser)
    } catch (err) {
        return res.status(400).send(err)
    }
})


module.exports = router