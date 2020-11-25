import React from 'react'
import { Redirect } from 'react-router-dom'

import HTTP from '../modules/HTTP.js'
import brokenImage from '../../dist/images/image_unavailable.jpg'

class FullViewPin extends React.Component {
	constructor(props) {
		super(props);

		let isLoaded = false;

		if (this.props.location.state) {
			this.state = {
				description: this.props.location.state.description,
				imageURL: this.props.location.state.imageURL,
				pinID: this.props.location.state.pinID,
				isLoaded: true,
				cantFindPin: false,
				newImageDimensions: {
					width: 0,
					height: 0
				},
				imageIsBroken: false
			}
		} else {
			this.state = {
				description: undefined,
				imageURL: undefined,
				pinID: undefined,
				isLoaded: false,
				cantFindPin: false,
				newImageDimensions: {
					width: 0,
					height: 0
				}
			}
		}

		this.handleBrokenImage = this.handleBrokenImage.bind(this)
		this.onImageLoad = this.onImageLoad.bind(this)
	}

	handleBrokenImage(event) {
		event.target.onerror = null;
		
		this.setState({
			imageIsBroken: true
		})
	}

	componentDidMount() {
		if (this.state.description && this.state.imageURL && this.state.pinID) {
			this.setState({
				isLoaded: true
			})
		} else {
			const pinID = encodeURIComponent(this.props.match.params.pinID);
			const formData = `pinID=${pinID}`

			HTTP.makeRequest(null, 'get', '/public/get_individual_pin?' + formData, false, (xhr) => {
				if (xhr.status === 200) {
					this.setState({
						description: xhr.response.pin.description,
						imageURL: xhr.response.pin.imageURL,
						pinID: xhr.response.pin._id,
						isLoaded: true
					})
				} else {
					console.log(xhr.response);

					this.setState({
						cantFindPin: true
					})
				}
			})
		}
	}

	onImageLoad(event) {
		const width = event.target.offsetWidth
		const height = event.target.offsetHeight

		if (width > 1168) {
			const newWidth = 1168
			const newHeight = 1168 * height / width

			this.setState({
				newImageDimensions: {
					width: newWidth,
					height: newHeight
				}
			})
		}
	}

	render() {
		if (this.state.cantFindPin) {
			return (
				<Redirect to='/404' />
			)
		}

		let imageSource = (this.state.imageIsBroken === true) ? brokenImage : this.state.imageURL;

		if (this.state.isLoaded) {
			return(
				<div className='col-lg-12'>
					{this.state.newImageDimensions.width ? 
						<img className='full-view-pin' src={imageSource} onLoad={this.onImageLoad} style={{ width: this.state.newImageDimensions.width, height: this.state.newImageDimensions.height }} /> : 
						<img className='full-view-pin' src={imageSource} onLoad={this.onImageLoad} onError={this.handleBrokenImage} />}<br />
					<div className='full-view-pin-description'>{this.state.description}</div>
				</div>
			);
		}

		return (
			<div className='col-lg-12'>
				Loading...
			</div>		
		)
	}
}

export default FullViewPin