const express = require('express')
const admin = require('../middlewares/admin')
const permission = require('../middlewares/permission')

const router = express.Router()

router.get('/', admin, (req, res) => {
  res.redirect(req.baseUrl + '/welcome')
})

router.get('/welcome', admin, (req, res) => {
  res.render('welcome')
})

router.get('/places', admin, permission('places'), (req, res) => {
  res.render('places')
})

router.get('/categories', admin, permission('categories'), (req, res) => {
  res.render('categories')
})

router.get('/users', admin, permission('users'), (req, res) => {
  res.render('users', { type: 'admin' })
})

router.get('/customers', admin, permission('customers'), (req, res) => {
  res.render('users', { type: 'customer' })
})

router.get('/reviews', admin, permission('reviews'), (req, res) => {
  res.render('reviews')
})

router.get('/slider-images', admin, permission('slider_images'), (req, res) => {
  res.render('slider-images')
})

router.get('/notifications', admin, permission('notifications'), (req, res) => {
  res.render('notifications')
})

router.get('/posts', admin, permission('posts'), (req, res) => {
  res.render('posts')
})

router.get('/pages', admin, permission('pages'), (req, res) => {
  res.render('pages')
})

router.get('/slides', admin, permission('slides'), (req, res) => {
  res.render('slides')
})

module.exports = router