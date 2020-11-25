const express = require('express');
let router = new express.Router();

const User = require('../models/user');
const Pin = require('../models/pin');

router.get('/get_all_pins', (request, response, next) => {
	Pin.find({}, (error, pins) => {
		if (error) { console.log('error retrieving all pins: ' + error); }

		response.status(200).json({
			pins: pins
		});
	})
});

router.get('/get_individual_pin', (request, response, next) => {
	Pin.findOne({ _id: request.query.pinID }, (error, pin) => {
		if (error) { console.log('error finding pin for get individual pin request: ' + error); }

		if (pin) {
			response.status(200).json({
				pin: pin
			})
		} else {
			response.status(400).json({
				message: "Can't find pin."
			})
		}
	})
});

router.get('/get_user_pins', (request, response, next) => {
	User.findOne({ username: request.query.username }, (error, user) => {
		if (error) { console.log('error finding user for get user pins request: ' + error); }

		if (user) {
			response.status(200).json({
				pins: user.pins
			});
		} else {
			response.status(400).json({
				message: "Can't find user."
			});
		}
	});
});

module.exports = router;