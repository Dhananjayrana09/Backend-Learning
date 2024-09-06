const userModel = require('./userModel')
module.exports.createUser = async function (req, res) {
  try {
    const userObject = req.body
    const user = await userModel.create(userObject)
    res.status(201).json(user)
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: 'internal server error',
      error: err
    })
  }
}

module.exports.getAllUser = async (req, res) => {
  try {
    const user = await userModel.find()
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

module.exports.getUser = async (req, res) => {
  try {
    const id = req.params.id
    const user = await userModel.findById(id)
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

module.exports.deleteUser = async (req, res) => {
  try {
    let { id } = req.params
    const user = await userModel.findByIdAndDelete(id)
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
