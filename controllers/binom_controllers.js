//Routes for Normal Distribution sets only 

// Import Dependencies
const express = require('express')
const Binom = require('../models/binom')
//include functions built to call to Random.org via axios and process the data as needed
const { binomPromise, processBinom } = require('../utils/random')


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
	//add user to req.body
	req.body.owner = req.session.userId
	//grab data from req.body needed to call to Random.org
	const n = req.body.n
	const percentP = req.body.percentP
	//call to random.org API using axios (see ../utils/random)
	binomPromise(n)
	//process data 
		.then(response => {
			const decimalArray = response.data.result.random.data
			req.body.values = processBinom(percentP, decimalArray)
			//create document
			Binom.create(req.body)
				.then(binomSet => {
					console.log('this was returned from create', binomSet)
					res.redirect('/datasets')
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

//show edit page 
router.get('/:binomId/edit', (req, res) => {
	const { username, userId, loggedIn } = req.session
	// we need to get the id
	const binomId = req.params.binomId
	Binom.findById(binomId)
		.then(binomSet => {
			res.render('binomsets/edit', { binomSet, loggedIn, username, userId })
		})
		.catch((error) => {
			res.redirect(`/error?error=${error}`)
		})
})

//update route
router.put('/:binomId', (req, res) => {
	const binomId = req.params.binomId
	Binom.findByIdAndUpdate(binomId, req.body, { new: true })
		.then(binomSet => {
			res.redirect(`/binomsets/${binomSet.id}`)
		})
		.catch((error) => {
			res.redirect(`/error?error=${error}`)
		})
})


//show
router.get('/:binomId', (req, res) => {
	const binomId = req.params.binomId
	Binom.findById(binomId)
		.populate("notes.author", "username")
		.then(binomSet => {
            const {username, loggedIn, userId} = req.session
			res.render('binomsets/show', { binomSet, username, loggedIn, userId })
		})
		.catch((error) => {
			res.redirect(`/error?error=${error}`)
		})
})


module.exports = router