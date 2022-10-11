//import dependencies 
const mongoose = require('./connection')
const Normal = require('./normal')
const Binom = require('./binom')

const db = mongoose.connection

db.on('open', ()=> {
    const startNormalSets = [
        {title:'height', mean: 60, stDev: 5, min: 50, max: 70, n: 5, values: [50, 70, 66, 67, 62]},
        {title:'hrs', mean: 8, stDev: 2, min: 3, max: 10, n: 4, values: [8, 3, 10, 9]}
    ]
    Normal.deleteMany({})
        .then(deletedSets => {
            console.log(deletedSets)
            Normal.create(startNormalSets)
                .then(newSets => {
                    console.log(newSets)
                    db.close()
                })
                .catch(error => {
                    console.log(error)
                    db.close()
                })
        })
        .catch(error => {
            console.log(error)
            db.close()
        })
})

db.on('open', ()=> {
    const BinomNormalSets = [
        {title: 'coins', p: 'heads', q: 'tails', n: 4, percentP: .25, values:[true,false,false,false]},
        {title: 'votes', p: 'yay', q: 'nay', n: 4, percentP: .5, values: [true, true, false, false] }
    ]
    Binom.deleteMany({})
        .then(deletedSets => {
            console.log(deletedSets)
            Binom.create(startBinomSets)
                .then(newSets => {
                    console.log(newSets)
                    db.close()
                })
                .catch(error => {
                    console.log(error)
                    db.close()
                })
        })
        .catch(error => {
            console.log(error)
            db.close()
        })
})