//Controllers for routes which need to call to both types of dataset models

//import dependencies
const express = require('express')
const Normal = require('../models/normal')
const Binom = require('../models/binom')
const async = require('async')

//create router
const router = express.Router()

//GET request to get form to create a new dataset, whether normal or binom
router.get('/new', (req,res) => {
    const { username, loggedIn, userId } = req.session
    Normal.find()
    res.render('datasets/new', { username, loggedIn })

})

// index ALL datasets
//will use async.parallel to get documents from both binom and normal collections 
router.get('/', (req, res) => {
    async.parallel({
        one(() => {
            Normal.find({})
        }),
        two(() => {
            Binom.find({})
        })
    })
    .then(results () => {
        console.log(results)
    })
    .catch(error => {
        console.log(error)
    })
})

// index that shows only the user's datasets
//will use async.parallel to get documents from both binom and normal collections 
router.get('/mine', (req, res) => {
    // destructure user info from req.session
    const { username, userId, loggedIn } = req.session
	Example.find({ owner: userId })
		.then(examples => {
			res.render('examples/index', { examples, username, loggedIn })
		})
		.catch(error => {
			res.redirect(`/error?error=${error}`)
		})
})

//export router

module.exports = router