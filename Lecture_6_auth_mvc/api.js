const mongoose = require('mongoose')
const express = require('express')
const app = express()
const dotenv = require('dotenv')
dotenv.config()
const userModel = require('./userModel')

const jwt = require('jsonwebtoken')
const util = require('util')
const promisify = util.promisify  // promisify is a function that converts a callback based function to a promise based function

const signToken = promisify(jwt.sign)
const verifyToken = promisify(jwt.verify)

const cookieParser = require('cookie-parser')
app.use(cookieParser())

const dbLink = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.8o5pg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

mongoose.connect(dbLink)
  .then(function (connection) {
    console.log('connected to db')
  })
  .catch((err) => console.log(err))


const  {createUser, getAllUser, deleteUser, getUser} = require('./userControler')


// ****************auth ke methods***************
 async function signupHandler(req, res) {
  try {
    const userObject = req.body
    // user => data get check email password

    if (!userObject.email || !userObject.password) {
      return res.status(400).json({ 
        message: 'Missing email or password',
        'status': '400'})
    }
    const user = await userModel.findOne({email: userObject.email})
    if (user) {
      return res.status(400).json({ message: 'User already exists' })
    }
    const newUser = await userModel.create(userObject);
    res.status(201).json({
      message: 'User created',
      user: newUser
    })
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: 'internal server error',
      error: err
    })
  } 
 }

 async function loginHandler(req, res) {
  try {
    // get email and password from request body
    const { email, password } = req.body;
  
    // check if email and password exist in db
    let user = await userModel.findOne({ email: email });
    if(!user) {
      return res.status(401).json({ 
        message: 'Invalid credentials' });
    }

    // check if password is correct
    let areEqual = password === user.password;
    if(!areEqual) {
      return res.status(401).json({ 
        message: 'Invalid credentials p' });
    }
    // GENERATE TOKEN
    const SECRET_KEY = 'your_secret_key'  // replace with your secret key. Use environment variable for better security.
    const token = await signToken({ id: user['_id'] }, SECRET_KEY, { expiresIn: '1h' })

    // SET COOKIES
    res.cookie('jwt', token, { 
      maxAge: 1000 * 60 * 60 * 24,  
      httpOnly: true
     });

     // SEND RESPONSE
     res.status(200).json({
      message: 'User logged in',
      status: '200',
      token: token,
      user: user
    });
   
  }catch{
    res.status(500).json({
      message: 'internal server error',
      status: '500',
    })
  }
 }

 async function protectRouteMiddleware(req, res, next) {
   try {
     // cookies token get
     const token = req.cookies.jwt;

     if (!token) {
       return res.status(401).json({
         message: 'unauthorized access',
         status: 'failure'
       })
     }

     //  token verify
     const SECRET_KEY = 'your_secret_key'  // replace with your secret key. Use environment variable for better security.
     const decryptedToken = await verifyToken(token, SECRET_KEY)

     // token identifier
     req.id = decryptedToken.id
     next()

   } catch (err) {
     console.log('err', err)
     res.status(500).json({
       message: 'internal server error',
       status: 'failure'
     })
   }
 }

 async function profileHandler(req, res) {
   try {
     const userId = req.id
     const user = await userModel.findById(userId)
     if (!user) {
       return res.status(404).json({
         message: 'user not found',
         status: 'failure'
       })
     }
     res.json({
       message: 'profile worked',
       status: 'success',
       user: user
     })
   } catch (err) {
     console.log('err', err)
     res.status(500).json({
       message: err.message,
       status: 'failure'
     })
   }
 }

 async function logoutHandler(req, res) {
   try {
     res.clearCookie('jwt')
     res.json({
       message: 'Logged out',
       status:'success'
     })
   } catch (err) {
     console.log('err', err)
     res.status(500).json({
       message: 'internal server error',
       status: 'failure'
     })
   }
 }

 async function isAdminMiddleware (req, res, next) {
  try {
     // check if user is admin
     const userId = req.id
     const user = await userModel.findById(userId)
     if (user.role !== 'admin') { 
       return res.status(403).json({
         message: 'You are not admin',
         status: 'failure'
       })
     }
     next()
  }catch{
    res.status(500).json({
      message: 'internal server error',
      status: '500',
    })
  }
 }

app.post('/signup', signupHandler)
app.post('/login',loginHandler)
// app.use(protectRouteMiddleware) incorrect sysntax to use middleware route
app.get('/profile', protectRouteMiddleware, profileHandler) // correct syntax to use middleware route
app.get('/logout', logoutHandler)
app.get('/admin', isAdminMiddleware)

// *******************routes***************
app.use(express.json())

app.post('/user', createUser)
app.get('/user', getAllUser)
app.get('/user/:id', getUser)
app.delete('/user/:id', deleteUser)



app.listen(3003, function () {
  console.log('Server started on port 3003')
})

// HomeWork
/***
 * Ques 
 * given a valid  of roles  -> verify that the current user is allowed to access a route or not 
 * ex : getAlluser -> [admin, moderator]
 * ex : deletUser -> [admin, moderator]
 * ex : allmovies -> [admin, moderator, fee curator]
 * 
 * **/ 

// const dbLink = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.8o5pg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
