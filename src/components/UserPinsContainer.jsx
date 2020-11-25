import React from 'react'
import { Alert } from 'react-bootstrap'
import { Redirect } from 'react-router-dom'

import UserPinsForm from './UserPinsForm.jsx'
import UserPinsList from './UserPinsList.jsx'

import Auth from '../modules/Auth.js'
import HTTP from '../modules/HTTP.js'

class UserPinsContainer extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			successMessage: '',
			pins: [],
			isLoaded: false,
			pinForm: {
				imageURL: '',
				description: ''
			}
		}

		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handlePinDelete = this.handlePinDelete.bind(this);
	}

	componentDidMount() {
		const username = encodeURIComponent(Auth.getUsername())
		const formData = `username=${username}`

		HTTP.makeRequest(null, 'get', '/public/get_user_pins?' + formData, false, (xhr) => {
			if (xhr.status === 200) {
				this.setState({
					pins: xhr.response.pins,
					isLoaded: true
				})
			} else {
				console.log(xhr.response);
			}
		})
	}

	handleChange(event) {
		const field = event.target.id;
		const pinForm = this.state.pinForm;
		pinForm[field] = event.target.value;

		this.setState({
			pinForm: pinForm
		});
	}

	handlePinDelete(event) {
		event.preventDefault();
		
		const pinID = encodeURIComponent(event.target.id);
		const formData = `pinID=${pinID}`;
		window.scrollTo(0, 0)

		HTTP.makeRequest(formData, 'post', '/api/remove_pin', true, (xhr) => {
			if (xhr.status === 200) {
				this.setState({
					pins: xhr.response.pins,
					successMessage: xhr.response.successMessage
				});
			} else {
				console.log(xhr.response);
			}
		});
	}

	handleSubmit(event) {
		event.preventDefault();

		const imageURL = encodeURIComponent(this.state.pinForm.imageURL);
		const description = encodeURIComponent(this.state.pinForm.description);
		const formData = `imageURL=${imageURL}&description=${description}`;

		window.scrollTo(0, 0)

		HTTP.makeRequest(formData, 'post', '/api/add_new_pin', true, (xhr) => {
			if (xhr.status === 200) {
				this.setState({
					pins: xhr.response.pins,
					successMessage: xhr.response.message,
					pinForm: {
						imageURL: '',
						description: ''
					}
				})
			} else {
				console.log(xhr.response);
			}
		});
	}

	render() {
		if (!Auth.isUserAuthenticated()) {
			return (
				<Redirect to='/' />
			);
		}

		let pins = "";

		if (this.state.isLoaded) {
			if (this.state.pins.length > 0) {
				pins = <div><h3 className='page-header'>Your Pins</h3><UserPinsList pins={this.state.pins} handlePinDelete={(e) => this.handlePinDelete(e)} usersOwnPin={true} /></div>
			} else {
				pins = "You don\'t have any pins. Why not add one?"
			}
		} else {
			pins = "Loading profile...";
		}

		return (
			<div className='col-lg-12'>
				{this.state.successMessage && <Alert bsStyle="success">{this.state.successMessage}</Alert>}
				<UserPinsForm onChange={this.handleChange} onSubmit={this.handleSubmit} pinForm={this.state.pinForm} />
				{pins}
			</div>
		);
	}
}

export default UserPinsContainer