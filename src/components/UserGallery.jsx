import React from 'react'
import { Redirect } from 'react-router-dom'

import PinsList from './PinsList.jsx';
import HTTP from '../modules/HTTP.js';

class UserGallery extends React.Component {
	constructor(props) {
		super(props);

		const username = this.props.match.params.username;

		this.state = {
			isLoaded: false,
			pins: [],
			username,
			cantFindUser: false
		}
	}

	componentDidMount() {
		const username = encodeURIComponent(this.state.username);
		const formData = `username=${username}`

		HTTP.makeRequest(null, 'get', '/public/get_user_pins?' + formData, false, (xhr) => {
			if (xhr.status === 200) {
				this.setState({
					pins: xhr.response.pins,
					isLoaded: true
				})
			} else {
				this.setState({
					cantFindUser: true,
					isLoaded: true
				})
			}
		});
	}

	render() {

		if (this.state.cantFindUser) {
			return (
				<Redirect to='/404' />
			)
		}

		return(
			<div className='col-lg-12'>
				{this.state.isLoaded ? 
					this.state.pins && this.state.pins.length > 0 ? 
						<div><h3 className='page-header'>{this.state.username + '\'s Pins'}</h3><PinsList pins={this.state.pins} /></div> : 
						this.state.username + ' doesn\'t have any pins.' 
						: 'Loading...'}
			</div>
		)		
	}
}

export default UserGallery