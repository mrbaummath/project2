// Nit: since you are using the `utils` folder this should be moved there. Always have all of your helper functions in a single folder
const auth = (req, res, next) => {
	if (req.session.loggedIn) {
		next()
	} else {
		res.redirect('/auth/login')
	}
}

module.exports = { auth }
