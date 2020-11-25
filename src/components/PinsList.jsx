import React from 'react';
import PropTypes from 'prop-types'
import ImageMasonry from 'react-image-masonry';

import Pin from './Pin.jsx'

class PinsList extends React.Component {
	
	render() {
		let pins = [];

		pins = this.props.pins.map((pin, index) => {
			let userGalleryPin = false

			if (pin.hasOwnProperty('_id')) {
				userGalleryPin = true
			}

			return (
				<Pin key={pin._id || pin.pinCollectionId} imageURL={pin.imageURL} description={pin.description} pinID={pin._id || pin.pinCollectionId} username={pin.username} userGalleryPin={userGalleryPin} />
			);
		});	

		return (
			<ImageMasonry numCols={3}>
				{pins}
			</ImageMasonry>
		);
	}
}

PinsList.propTypes = {
	pins: PropTypes.array.isRequired,
}

export default PinsList;