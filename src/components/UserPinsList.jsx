import React from 'react';
import PropTypes from 'prop-types';
import Masonry from 'react-masonry-component'

import UserPin from './UserPin.jsx';

class UserPinsList extends React.Component {

	render() {
		const pins = this.props.pins.map((pin, index) => {
			return (
				<UserPin key={pin.pinCollectionId} pinID={pin.pinCollectionId} handlePinDelete={(e) => this.props.handlePinDelete(e)} imageURL={pin.imageURL} description={pin.description} pinID={pin.pinCollectionId} username={pin.username} />
			);
		});	

		return (
			<Masonry
				elementType='div'
				// numCols={3}
			>
				{pins}
			</Masonry>
		);
	}
}

UserPinsList.propTypes = {
	pins: PropTypes.array.isRequired
}

export default UserPinsList