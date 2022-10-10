// import dependencies
const mongoose = require('./connection')
const noteSchema = require('./note')

// import user model for populate
const User = require('./user')

// destructure the schema and model constructors from mongoose
const { Schema, model } = mongoose

const binomSchema = new Schema(
	{
		title: { type: String, required: true },
		p: { type: String, required: true },
        q: { type: String, required: true },
		min: { type: Number, required: true },
		max: { type: Number, required: true},
		n: {type: Number, required: true},
        percentP: {type: Number, required: true},
		values: {type: [Boolean], required: true},
		owner: {
			type: Schema.Types.ObjectID,
			ref: 'User',
		},
        notes: [noteSchema]
	},
	{ timestamps: true }
)

const Binom = model('Binom', binomSchema)

/////////////////////////////////
// Export our Model
/////////////////////////////////
module.exports = Binom