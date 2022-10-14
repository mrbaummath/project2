////////////////////////////////////////
// Import Dependencies
////////////////////////////////////////
const express = require('express')
const Normal = require('../models/normal')
const Binom = require('../models/binom')

/////////////////////////////////////////
// Create Router
/////////////////////////////////////////
const router = express.Router()

/////////////////////////////////////////////
// Routes
////////////////////////////////////////////
// POST
router.post('/:type/:modelId', (req, res) => {
    if(!req.session.loggedIn) {
        res.sendStatus(401)
    }
    const type = req.params.type
    const modelId = req.params.modelId
    const Collection = req.params.type == 'normal' ? Normal : Binom
    req.body.author = req.session.userId
    Collection.findById(modelId)
        .then(set => {
            set.notes.push(req.body)
            return set.save()
        })
        .then(set => {
            res.redirect(`/${type}sets/${set.id}`)
        })
        .catch(error => res.redirect(`/error?error=${error}`))
})


// DELETE
// only the author of the comment can delete it
router.delete('/delete/:type/:modelId/:noteId', (req,res) => {
    const type = req.params.type
    const modelId = req.params.modelId
    const noteId = req.params.noteId
    const userId = req.session.userId
    const Collection = req.params.type == 'normal' ? Normal : Binom
    Collection.findById(modelId)
        .then(set => {
            const note = set.notes.id(noteId)
            if (!req.session.loggedIn || note.author != userId) {
                const error = 'you%20are%20not%authorized'
                res.redirect(`/error?error=${error}`)
            } else {
                note.remove()
                set.save()
                res.redirect(`/${type}sets/${set.id}`)
                return
            }
        })
        .catch(error => res.redirect(`/error?error=${error}`))
})

//////////////////////////////////////////
// Export the Router
//////////////////////////////////////////
module.exports = router