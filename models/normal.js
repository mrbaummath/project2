// import dependencies
const mongoose = require('./connection')
const noteSchema = require('./note')

// import user model for populate
const User = require('./user')

// destructure the schema and model constructors from mongoose
const { Schema, model } = mongoose

const normalSchema = new Schema(
	{
		title: { type: String, required: true },
		mean: { type: Number, required: true },
        stDev: { type: Number, required: true },
		min: { type: Number, required: true },
		max: { type: Number, required: true},
		n: {type: Number, required: true},
		values: {type: [Number], required: true},
		owner: {
			type: Schema.Types.ObjectID,
			ref: 'User',
		},
		notes: [noteSchema]
	},
	{ timestamps: true }
)

const Normal = model('Normal', normalSchema)

/////////////////////////////////
// Export our Model
/////////////////////////////////
module.exports = Normal
