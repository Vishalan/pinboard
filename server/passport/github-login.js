const User = require('../models/user')
const PassportGithubStrategy = require('passport-github').Strategy
const jwt = require('jsonwebtoken')

function makeJSONWebToken(userId) {
	return jwt.sign({ sub: userId }, process.env.JWT_KEY)
}

module.exports = new PassportGithubStrategy({
	clientID: process.env.GITHUB_ID,
	clientSecret: process.env.GITHUB_SECRET,
	callbackURL: process.env.APP_URL+ '/auth/github/callback'
}, function(accessToken, refreshToken, profile, callback) {

	User.findOne({ githubId: profile.id }, function(error, user) {
		if (error) {
			console.log('error trying to find user with github ID: ' + error)
			return callback(error)
		}

		if (!user) {
			const newUserData = {
				username: profile.username,
				githubId: profile.id,
				pins: []
			}

			const newUser = new User(newUserData)

			newUser.save(function(error, newUser) {
				if (error) {
					console.log('error saving new user: ' + error)
					return callback(error)
				}

				return callback(null, {
					token: makeJSONWebToken(newUser._id),
					username: profile.username,
					successMessage: 'You made a new account!'
				})
			})
		} else {
			const successMessage = 'You logged in!'

			return callback(error, {
				token: makeJSONWebToken(user._id),
				username: user.username,
				successMessage: 'You successfully logged in!'
			})
		}
	})
})