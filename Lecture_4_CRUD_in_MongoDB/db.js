const mongoose = require('mongoose')
const express = require('express')
const app = express()
const dotenv = require('dotenv')
dotenv.config()

const dbLink = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.8o5pg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

mongoose
  .connect(dbLink)
  .then(function (connection) {
    console.log('connected to db')
  })
  .catch((err) => console.log(err))

const schemaRules = {
  name: {
    type: String,
    required: [true, 'name is required']
  },
  email: {
    type: String,
    required: [true, 'email is required'],
    unique: [true, 'email should be unique']
  },
  password: {
    type: String,
    required: [true, 'password is required'],
    minLength: [6, 'password should be at least of 6 length']
  },
  confirmPassword: {
    type: String,
    required: true,
    minLength: 6,
    validate: [
      function () {
        return this.password === this.confirmPassword
      },
      'password should be equal to confirm password'
    ]
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  isPremium: {
    type: Boolean,
    default: false
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'feed curator', 'moderator'],
    default: 'user'
  }
}

const userSchema = new mongoose.Schema(schemaRules)

userSchema.pre('save', function (next) {
  console.log('Pre save was called')
  this.confirmPassword = undefined
  next()
})

userSchema.post('save', function () {
  console.log('post save was called')
  this.__v = undefined
  this.password = undefined
})

const UserModel = mongoose.model('User', userSchema)

const createUser = async function (req, res) {
  try {
    const userObject = req.body
    const user = await UserModel.create(userObject)
    res.status(201).json(user)
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: 'internal server error',
      error: err
    })
  }
}

const getAllUser = async (req, res) => {
  try {
    const user = await UserModel.find()
    if (user.length !== 0) {
      res.status(200).json({
        message: user
      })
    } else {
      res.status(404).json({
        message: 'did not get any user'
      })
    }
  } catch (err) {
    res.status(500).json({
      status: 'Internal server error',
      message: err.message
    })
  }
}

const getUser = async (req, res) => {
  try {
    const id = req.params.id
    const user = await UserModel.findById(id)
    if (user) {
      res.status(200).json({
        message: user
      })
    } else {
      res.status(404).json({
        message: 'did not get the user'
      })
    }
  } catch (err) {
    res.status(500).json({
      status: 'Internal server error',
      message: err.message
    })
  }
}

const deleteUser = async (req, res) => {
  try {
    let { id } = req.params
    const user = await UserModel.findByIdAndDelete(id)
    if (user === null) {
      res.status(404).json({
        status: 'success',
        message: 'user does not exist'
      })
    } else {
      res.status(200).json({
        status: 'success',
        message: 'user is deleted',
        user: user
      })
    }
  } catch (err) {
    res.status(500).json({
      status: 'Internal server error',
      message: err.message
    })
  }
}

app.use(express.json())

app.post('/user', createUser)
app.get('/user', getAllUser)
app.get('/user/:id', getUser)
app.delete('/user/:id', deleteUser)

app.listen(3001, function () {
  console.log('Server started on port 3000')
})

// const dbLink = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.8o5pg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
