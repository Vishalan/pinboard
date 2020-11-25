import React from 'react';
import PropTypes from 'prop-types';
import { Jumbotron, FormGroup, ControlLabel, FormControl, Button, InputGroup, Glyphicon, HelpBlock } from 'react-bootstrap';

class UserPinsForm extends React.Component{
	render() {
		return (
			<Jumbotron>
				<h2 className='page-header'>Add New Pin</h2>
				<form onSubmit={this.props.onSubmit}>
					<FormGroup controlId="imageURL">
						<ControlLabel>Image URL</ControlLabel>
						<FormControl type="text" value={this.props.pinForm.imageURL} onChange={this.props.onChange} />
						{this.props.imageURLError ? 'error' : '' }
					</FormGroup>
					<FormGroup controlId="description">
						<ControlLabel>Description</ControlLabel>
						<FormControl type="text" value={this.props.pinForm.description} onChange={this.props.onChange} />
						{this.props.descriptionError ? 'error' : '' }
					</FormGroup>

					<Button type="submit">Add New Pin</Button>
				</form>
			</Jumbotron>
		);
	}
}

UserPinsForm.propTypes = {
	onChange: PropTypes.func.isRequired,
	onSubmit: PropTypes.func.isRequired,
	pinForm: PropTypes.object.isRequired
}

export default UserPinsForm;