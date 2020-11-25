const express = require('express');
let router = new express.Router();
const validator = require('validator');
const async = require('async');
const jwt = require('jsonwebtoken')

const User = require('../models/user');
const Pin = require('../models/pin');

const verifyJWT = (request, callback) => {
	const jsonWebToken = request.headers.authorization.split(" ")[1];

	jwt.verify(jsonWebToken, process.env.JWT_KEY, (error, decodedToken) => {
		if (error) {
			callback(error, undefined);
		} else {
			callback(null, decodedToken);
		}
	})
}

router.post('/remove_pin', (request, response, next) => {
	verifyJWT(request, (error, decodedToken) => {
		if (error) { console.log('error verifying JWT for delete pin request: ' + error); }

		User.findOne({ _id: decodedToken.sub }, (error, user) => {
			if (error) { console.log('error finding user for remove pin request' + error); }

			user.pins = user.pins.filter((pin) => {
				return pin.pinCollectionId !== request.body.pinID;
			})
			user.markModified('pins');
			user.save()

			Pin.deleteOne({ _id: request.body.pinID }, (error) => {
				if (error) { console.log('error removing pin from pin database: ' + error); }
			})

			response.status(200).json({
				pins: user.pins,
				successMessage: 'Pin was deleted successfully.'
			})
		});
	});
})

router.post('/add_new_pin', (request, response, next) => {
	verifyJWT(request, (error, decodedToken) => {
		if (error) { console.log('error verifying JWT for add new pin request: ' + error); }

		User.findOne({ _id: decodedToken.sub }, (error, user) => {
			if (error) { console.log('error finding user for add new pin request: ' + error); }

			const dateCreated = Date.now();

			const newPinData = {
				imageURL: request.body.imageURL,
				description: request.body.description,
				userId: user._id,
				username: user.username,
				dateCreated: dateCreated
			}

			const newPin = new Pin(newPinData);

			newPin.save((error, pin) => {
				if (error) { console.log('error saving new pin in add new pin request: ' + error); }

				newUserPins = user.pins.concat([{
					imageURL: request.body.imageURL,
					description: request.body.description,
					dateCreated: dateCreated,
					pinCollectionId: pin._id.toString(),
					username: user.username
				}]);

				user.pins = newUserPins;
				user.markModified('pins');

				user.save((error, updatedUser) => {
					if (error) { console.log('error saving user\'s pins in add new pin request:' + error); }

					response.status(200).json({
						pins: newUserPins,
						message: 'Added new pin!'
					})
				});
			})
		})
	})
});

module.exports = router;