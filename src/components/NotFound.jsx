import React from 'react'

class NotFound extends React.Component {
	render() {
		return (
			<div className='col-lg-12'>
				<h3 className='page-header'>Oops!</h3>
				{"We can\'t find that page."}
			</div>
		);
	}
}

export default NotFound