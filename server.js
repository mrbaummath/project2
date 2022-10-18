////////////////////
//  Dependencies  //
////////////////////
// Nit: choose either double or single quotes
require("dotenv").config() // make env variables available
const express = require("express")
const middleware = require('./utils/middleware')
const NormalRouter = require('./controllers/normal_controllers')
const BinomRouter = require('./controllers/binom_controllers')
const DataRouter = require('./controllers/dataset_controllers')
const UserRouter = require('./controllers/user')
const NoteRouter = require('./controllers/note_controllers')
// Nit: remove unneeded User model
const User = require("./models/user")
// SEE MORE DEPENDENCIES IN ./utils/middleware.js
// user and resource routes linked in ./utils/middleware.js

//////////////////////////////
// Middleware + App Object  //
//////////////////////////////
const app = require("liquid-express-views")(express())

middleware(app)

////////////////////
//    Routes      //
////////////////////

app.use('/auth', UserRouter)
app.use('/normalsets', NormalRouter)
app.use('/binomsets', BinomRouter)
app.use('/datasets', DataRouter)
app.use('/notes', NoteRouter )

app.get('/', (req, res) => {
    const { username, userId, loggedIn } = req.session
	res.render('index.liquid', { loggedIn, username, userId })
})

app.get('/error', (req, res) => {
	const error = req.query.error || 'This Page Does Not Exist'
    const { username, loggedIn, userId } = req.session
	res.render('error.liquid', { error, username, loggedIn, userId })
})

// if page is not found, send to error page
app.all('*', (req, res) => {
	res.redirect('/error')
})



//////////////////////////////
//      App Listener        //
//////////////////////////////
app.listen(process.env.PORT, () => {
    console.log(`listening on port ${process.env.PORT}`)
})