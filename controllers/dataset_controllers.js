//Controllers for routes which need to call to both types of dataset models


//GET request to get form to create a new dataset, whether normal or binom

// index ALL datasets
//will use async.parallel to get documents from both binom and normal collections 
router.get('/', (req, res) => {
	Example.find({})
		.then(examples => {
			const username = req.session.username
			const loggedIn = req.session.loggedIn
			
			res.render('examples/index', { examples, username, loggedIn })
		})
		.catch(error => {
			res.redirect(`/error?error=${error}`)
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