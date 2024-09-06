const express = require('express')
const app = express()
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken') // Correct module name
const util = require('util')
const promisify = util.promisify
const promisifiedJWTsign = promisify(jwt.sign)
const promisifiedJWTverify = promisify(jwt.verify)

app.use(cookieParser())
const SECRET_KEY = 'secretkey'

app.get('/sign', async function (req, res) {
  try {
    const authToken = await promisifiedJWTsign({ payload: 'abcdefgh' }, SECRET_KEY)
    res.cookie('jwt', authToken, {})
    res.status(200).json({
      message: 'Token signed successfully'
    })
  } catch (error) {
    res.status(500).json({
      message: 'Error signing token',
      error: error.message
    })
  }
})

app.get('/verify', async function (req, res) {
  if (req.cookies && req.cookies.jwt) {
    try {
      const authToken = req.cookies.jwt
      const unlockedToken = await promisifiedJWTverify(authToken, SECRET_KEY)
      res.status(200).json({
        message: 'Token verified successfully',
        unlockedToken: unlockedToken
      })
    } catch (error) {
      res.status(500).json({
        message: 'Error verifying token',
        error: error.message
      })
    }
  }
})

app.post('/signup', async (req, res) => {
  const { name, email, password } = req.body
  try {
    // check if user already exists
    let user = await User.findOne({ email })
    if (user) {
      return res.status(400).json({ message: 'User already exists' })
    }
    // create new user
    user = new User({
      name,
      email,
      password
    })
    // save user to db
    await user.save()

    // create and sign a JWT token
    const payload = { userId: user._id }
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1d' })

    // return the JWT token
    res.status(201).json({ token })
  } catch (err) {
    console.error(err.message)
    res.status(500).json({
      message: 'internal server error'
    })
  }
})

app.listen(3002, function () {
  console.log('Server is listening to port 3002')
})
