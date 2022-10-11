//Routes for Normal Distribution sets only 

// Import Dependencies
const express = require('express')
const Normal = require('../models/normal')
const { stdev } = require('mathjs')
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
	Normal.create(req.body)
		.then(example => {
			console.log('this was returned from create', example)
			res.redirect('/sets')
		})
		.catch(error => {
			res.redirect(`/error?error=${error}`)
		})
})

// edit route -> GET that takes us to the edit form view
router.get('/:normalId/edit', (req, res) => {
	// we need to get the id
	const normalId = req.params.id
	Normal.findById(normalId)
		.then(normalDist => {
			res.render('normalsets/edit', { nomralDist })
		})
		.catch((error) => {
			res.redirect(`/error?error=${error}`)
		})
})

// update route
router.put('/:normalId', (req, res) => {
	const normalId = req.params.id
	//*grab raw data
	//*compute new mean,sd, min, max
	//*add to req.body
	
	Normal.findByIdAndUpdate(normalId, req.body, { new: true })
		.then(normalSet => {
			res.redirect(`/normalsets/${example.id}`)
		})
		.catch((error) => {
			res.redirect(`/error?error=${error}`)
		})
})

// show route
router.get('/:normalId', (req, res) => {
	const normalId = req.params.id
	Normal.findById(normalId)
		.then(normalSet => {
            const {username, loggedIn, userId} = req.session
			res.render('normalsets/show', { normalSet, username, loggedIn, userId })
		})
		.catch((error) => {
			res.redirect(`/error?error=${error}`)
		})
})

// delete route
router.delete('/:normalId', (req, res) => {
	const normalId = req.params.id
	Normal.findByIdAndRemove(normalId)
		.then(normalSet => {
			res.redirect('/sets')
		})
		.catch(error => {
			res.redirect(`/error?error=${error}`)
		})
})

// Export the Router
module.exports = router
