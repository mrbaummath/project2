//Routes for Normal Distribution sets only 

// Import Dependencies
const express = require('express')
const Normal = require('../models/normal')
const { stdev } = require('mathjs')
const { gaussPromise, processGauss } = require('../utils/random')


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
	req.body.owner = req.session.userId
	//*grab data from req.body needed to call to Random.org
	const { mean, stDev, n} = req.body
	//*call to random.org API using axios
	gaussPromise(mean, stDev, n)
	//*process data 
		.then ((response) => {
			const dataArray = processGauss(response.data.result.random.data)
			req.body.values = dataArray
			req.body.min = dataArray[0]
			req.body.max = dataArray[n-1]
			console.log(req.body)
			//create the model
			Normal.create(req.body)
				.then(normalSet => {
					console.log('this was returned from create', normalSet)
					res.send(normalSet)
					// res.redirect('/sets')
				})
				.catch(error => {
					res.redirect(`/error?error=${error}`)
				})
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
		.then(normalSet => {
			res.send(normalSet)
			// res.render('normalsets/edit', { normalSet })
		})
		.catch((error) => {
			res.redirect(`/error?error=${error}`)
		})
})

// update route
router.put('/:normalId', (req, res) => {
	const normalId = req.params.normalId
	//*grab raw data
	//*compute new mean,sd, min, max
	//*add to req.body
	console.log(req.body)
	Normal.findByIdAndUpdate(normalId, req.body, { new: true })
		.then(normalSet => {
			res.send(normalSet)
			// res.redirect(`/normalsets/${example.id}`)
		})
		.catch((error) => {
			res.redirect(`/error?error=${error}`)
		})
})

// show route
router.get('/:normalId', (req, res) => {
	const normalId = req.params.normalId
	Normal.findById(normalId)
		.then(normalSet => {
            const {username, loggedIn, userId} = req.session
			res.send(normalSet)
			// res.render('normalsets/show', { normalSet, username, loggedIn, userId })
		})
		.catch((error) => {
			res.redirect(`/error?error=${error}`)
		})
})

// Export the Router
module.exports = router
