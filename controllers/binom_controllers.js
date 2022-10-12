//Routes for Normal Distribution sets only 

// Import Dependencies
const express = require('express')
const Binom = require('../models/binom')
const axios = require('axios').default

// Create router
const router = express.Router()

// Router Middleware
// Authorization middleware
// If you have some resources that should be accessible to everyone regardless of loggedIn status, this middleware can be moved, commented out, or deleted. 
router.use((req, res, next) => {
	// checking the loggedIn boolean of our session
	if (req.session.loggedIn) {
		// if they're logged in, go to the next thing(thats the controller)
		next()
	} else {
		// if they're not logged in, send them to the login page
		res.redirect('/auth/login')
	}
})

// Routes

// create -> POST route that actually calls the db and makes a new document
router.post('/', (req, res) => {
	//*grab data from req.body needed to call to Random.org
	//*call to random.org API using axios
	//*process data 
	//*compute mean, sd 
	//*add to req.body 
	req.body.owner = req.session.userId
	Binom.create(req.body)
		.then(binomSet => {
			console.log('this was returned from create', binomSet)
			res.send(binomSet)
			// res.redirect('/sets')
		})
		.catch(error => {
			res.redirect(`/error?error=${error}`)
		})
})



module.exports = router