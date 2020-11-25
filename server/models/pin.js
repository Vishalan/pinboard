const mongoose = require('mongoose');

const PinSchema = mongoose.Schema({
	imageURL: {
		type: String
	},
	description: {
		type: String
	},
	dateCreated: {
		type: Number
	},
	userId: {
		type: String
	},
	username: {
		type: String
	}
})

const Pin = module.exports = mongoose.model('Pin', PinSchema);