import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { library } from '@fortawesome/fontawesome-svg-core'
import { faSearchPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
library.add(faSearchPlus)

import brokenImage from '../../dist/images/image_unavailable.jpg'

class Pin extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			imageIsBroken: false
		}

		this.handleBrokenImage = this.handleBrokenImage.bind(this);
	}

	handleBrokenImage(event) {
		event.target.onerror = null;

		this.setState({
			imageIsBroken: true
		})
	}

	render() {
		let image = <img src={this.props.imageURL} onError={this.handleBrokenImage} />

		if (this.state.imageIsBroken) {
			image = <img src={brokenImage} />;
		}

		return (
			<div className="image-element-class">
				{this.props.userGalleryPin === true ? <div className='image-header'>pind by <Link className='pind-user-link' to={{ pathname: "/users/" + this.props.username, state: { imageURL: this.props.imageURL, description: this.props.description, pinID: this.props.pinID } }}>{this.props.username}</Link></div> : ''}

				{image}<br />
				<div className="image-footer">
					<Link className='footer-link' to={{ pathname: "/pins/" + this.props.pinID, state: { imageURL: this.props.imageURL, description: this.props.description, pinID: this.props.pinID } }}><FontAwesomeIcon size='lg' className='footer-icon' icon={['fas', 'search-plus']} /></Link>
				</div>
			</div>
		);
	}
}

Pin.propTypes = {
	imageURL: PropTypes.string.isRequired,
	pinID: PropTypes.string.isRequired,
	description: PropTypes.string.isRequired,
	username: PropTypes.string.isRequired
}

export default Pin;