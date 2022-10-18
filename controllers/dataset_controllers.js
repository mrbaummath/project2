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
    res.render('datasets/new', { username, loggedIn, userId })

})

// index ALL datasets
//will use async.parallel to get documents from both binom and normal collections 
router.get('/', (req, res) => {
    const { username, userId, loggedIn } = req.session
    // Nice use of `.parallel` here!
    async.parallel ({
        normalSets: (cb) => {Normal.find({}).exec(cb)},
        binomSets: (cb) => {Binom.find({}).exec(cb)}
    })
    .then((results) => {
        const { normalSets, binomSets } = results
        const allSets = []
        // Nit: best practice when having  one liners like this is to leave a comment above on what the intent of the line is. This way in the future someone else or yourself can comeback and know what is going on. Here it's an easy action but these can get super fancy and not human readable quick.
        normalSets.forEach(set => allSets.push(set))
        binomSets.forEach(set => allSets.push(set))
        
        res.render('datasets/index', { allSets, loggedIn, username, userId })
    })
    .catch(error => {
        res.redirect(`/error?error=${error}`)
    })
})

// index that shows only the user's datasets
//will use async.parallel to get documents from both binom and normal collections 

router.get('/mine', (req, res) => {
    const { username, userId, loggedIn } = req.session
    // Again love the use of `.parallel` here
    async.parallel ({
        normalSets: (cb) => {Normal.find({ owner: userId }).exec(cb)},
        binomSets: (cb) => {Binom.find({ owner: userId }).exec(cb)}
    })
    .then((results) => {
        const { normalSets, binomSets } = results
        const allSets = []
        // same as above
        normalSets.forEach(set => allSets.push(set))
        binomSets.forEach(set => allSets.push(set))
        res.render('datasets/index', { allSets, loggedIn, username, userId })
    })
    .catch(error => {
        res.redirect(`/error?error=${error}`)
    })
})

//delete either
router.delete('/:type/:id', (req,res) => {
    const docId = req.params.id
    const type = req.params.type
    const Collection = type === 'normal' ? Normal : Binom
    Collection.findByIdAndRemove(docId)
    // Nit: can remove `query` here since it's not used and just pass in nothing here  () => {}
    .then((query) => {
        res.redirect(`/datasets`)
    })
    .catch(error => {
        res.redirect(`/error?error=${error}`)
    })
})

//export router

module.exports = router