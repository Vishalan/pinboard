const mongoose = require('mongoose')

const UserSchema = mongoose.Schema({
	username: {
		type: String
	},
	githubId: {
		type: String
	},
	pins: []
})

const User = module.exports = mongoose.model('User', UserSchema)