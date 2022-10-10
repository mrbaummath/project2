const mongoose = require('./connection')

const { Schema } = mongoose

const noteSchema = new Schema({
    note: {
        type: String,
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
    
}, {
    timestamps: true
})

module.exports = noteSchema