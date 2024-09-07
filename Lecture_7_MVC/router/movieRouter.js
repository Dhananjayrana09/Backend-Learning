const express = require('express')
const movieRouter = express.Router()
const {
  createMovie,
  deleteMovie,
  getAllMovie,
  getMovie
} = require('../controller/movieController.js')
const { protectRouteMiddleware, isAdminMiddleWare } = require('../controller/authController.js')

movieRouter
  .post('/', createMovie)
  .get('/', protectRouteMiddleware, isAdminMiddleWare, getAllMovie)
  .get('/:id', getMovie)
  .delete('/:id', protectRouteMiddleware, deleteMovie)

module.exports = movieRouter
