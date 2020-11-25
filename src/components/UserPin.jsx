import React from 'react';
import { Link } from 'react-router-dom';

import { library } from '@fortawesome/fontawesome-svg-core'
import { faSearchPlus, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
library.add(faTrashAlt)
library.add(faSearchPlus)

import brokenImage from '../../dist/images/image_unavailable.jpg'

class UserPin extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			imageIsBroken: false
		}

		this.handleBrokenImage = this.handleBrokenImage.bind(this)
	}

	handleBrokenImage(event) {
		event.target.onerror = null

		this.setState({
			imageIsBroken: true
		})
	}

	render() {
		let image = <img src={this.props.imageURL} onError={this.handleBrokenImage} style={{ paddingLeft: '5px', paddingRight: '5px', paddingTop: '5px', width: '376px' }} />

		if (this.state.imageIsBroken) {
			image = <img src={brokenImage} />;
		}
		return (
			<div>
				{image}<br />
				<div style={{ position: 'relative', top: '-30px', paddingRight: '10px', textAlign: 'right' }}>
					<Link className='footer-link' to={{ pathname: "/pins/" + this.props.pinID, state: { imageURL: this.props.imageURL, description: this.props.description, pinID: this.props.pinID } }}>
						<FontAwesomeIcon size='2x' className='footer-icon' icon={['fas', 'search-plus']} />
					</Link>
					<FontAwesomeIcon size='2x' onClick={(e) => this.props.handlePinDelete(e)} id={this.props.pinID} className='footer-icon' icon={['fas', 'trash-alt']} />
				</div>
			</div>
		);
	}
}

export default UserPin