const express = require('express')
const router = new express.Router()
const fs = require('fs')
const path = require('path')
const passport = require('passport')
const url = require('url')

const addSocketIdToSession = function(request, response, next) {
	request.session.socketId = request.query.socketId
	next()
}

router.get('/login', addSocketIdToSession, passport.authenticate('github-login'))

router.get('/github/callback', function(request, response, next) {
	return passport.authenticate('github-login', { successRedirect: '/', failureRedirect: '/login' }, function(error, authResult) {
		const io = request.app.get('io')
		
		if (error) {
			io.in(request.session.socketId).emit('github', { error })
		}

		const authData = {
			username: authResult.username,
			token: authResult.token,
			message: authResult.successMessage
		}

		io.in(request.session.socketId).emit('github', authData)
	}) (request, response, next)
})

module.exports = router