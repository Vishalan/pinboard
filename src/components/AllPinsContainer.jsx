import React from "react"
import { Alert } from 'react-bootstrap'

import PinsList from './PinsList.jsx'

import HTTP from '../modules/HTTP.js'

class AllPinsContainer extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			pins: [],
			isLoaded: false,
		}
	}

	componentDidMount() {
		HTTP.makeRequest(null, 'get', '/public/get_all_pins', false, (xhr) => {
			if (xhr.status === 200) {
				this.setState({
					pins: xhr.response.pins,
					isLoaded: true
				})
			} else {
				console.log(xhr.response)
			}
		});
	}

	componentWillUnmount() {
		this.props.clearMessage()
	}

	render() {
		let successMessage = ''

		if (this.props.successMessage) {
			successMessage = <div className="col-lg-12"><Alert bsStyle='success'>{this.props.successMessage}</Alert></div>
		}

		return (
			<div className="col-lg-12">
				{successMessage}
				{this.state.isLoaded ? this.state.pins.length > 0 ? <PinsList pins={this.state.pins} /> : 'No one has uploaded a pin yet. Why not be the first?' : 'Loading...'}
			</div>
		)
	}
}

export default AllPinsContainer