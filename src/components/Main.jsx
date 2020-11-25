import React from 'react'
import { Route, Link, Switch } from 'react-router-dom'
import { Button, Alert } from 'react-bootstrap'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
library.add(faGithub)

import io from 'socket.io-client'
const socket = io(process.env.APP_URL)

import Auth from '../modules/Auth.js'
import AllPinsContainer from './AllPinsContainer.jsx'
import FullViewPin from './FullViewPin.jsx'
import UserGallery from './UserGallery.jsx'
import UserPinsContainer from './UserPinsContainer.jsx'
import NotFound from './NotFound.jsx'
import Logout from './Logout.jsx'

class Main extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			isLoggedIn: false,
			pins: [],
			loginButtonDisabled: false,
			successMessage: ''
		}

		this.handleAuthentication = this.handleAuthentication.bind(this)
		this.handleLogout = this.handleLogout.bind(this)
		this.clearMessage = this.clearMessage.bind(this)
	}

	checkPopup() {
		const check = setInterval(() => {
			const { popup } = this

			if (!popup || popup.closed || popup.closed === undefined) {
				clearInterval(check)
				this.setState({ loginButtonDisabled: false })
			}
		}, 1000)
	}

	componentDidMount() {
		if (Auth.isUserAuthenticated()) {
			this.setState({
				isLoggedIn: true
			})
		}

		socket.on('github', (response) => {
			this.popup.close()

			this.handleAuthentication(response)
		})
	}

	componentWillUnmount() {
		socket.disconnect()
	}

	startAuth(e) {
		if (!this.state.loginButtonDisabled) {
			e.preventDefault()
			this.popup = this.openPopup()
			this.checkPopup()
			this.setState({ loginButtonDisabled: true })
		}
	}

	closeCard() {
		this.setState({ isLoggedIn: false })
	}

	openPopup() {
		const width = 600, height = 600
		const left = (window.innerWidth / 2) - (width / 2)
		const top = (window.innerHeight / 2) - (height / 2)
		const url = `/auth/login?socketId=${socket.id}`

		return window.open(url, '',
			`toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=${width}, height=${height}, top=${top}, left=${left}`
		)
	}

	handleAuthentication(response) {
		if (response.error) {
			console.log(response.error)
		} else {
			Auth.authenticateUser(response.token, response.username)

			this.setState({
				isLoggedIn: true,
				successMessage: response.message
			})
		}
	}

	clearMessage() {
		this.setState({
			successMessage: ''
		})
	}

	handleLogout() {
		this.setState({
			successMessage: 'You have been logged out.'
		})
	}

	render() {
		let navigationItems = ''

		if (this.state.isLoggedIn === true && Auth.isUserAuthenticated()) {
			navigationItems = 
				<ul className='nav nav-pills pull-right'>
					<li className='dropdown'>
						<a href="#" className='dropdown-toggle' data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">{Auth.getUsername()}<span className="caret"></span></a>
						<ul className='dropdown-menu'>
							<li><Link to="/my_pins">My Pins</Link></li>
							<li role="separator" className="divider"></li>
							<li><Link to='/logout'>Logout</Link></li>
						</ul>
					</li>
				</ul>
		} else {
			// pass socket and methods to GithubButton

			navigationItems = 
						<ul className='nav nav-pills pull-right'>
							<li role='presentation'>
								<Button className='github-login-button' disabled={this.state.loginButtonDisabled} onClick={this.startAuth.bind(this)}>
									<FontAwesomeIcon icon={['fab', 'github']} size='lg' className='github-logo' /> Login with Github
								</Button>
							</li>
						</ul>

		}

		return (
			<div className='container'>
				<div className='header clearfix'>
					<nav>
						{navigationItems}
					</nav>
					<h3 className='text-muted'><Link id='home-link' to='/'>Pinboard</Link></h3>
				</div>

				<div className='row'>
					<Switch>
						<Route exact path="/" render={(props) => <AllPinsContainer {...props} successMessage={this.state.successMessage} clearMessage={this.clearMessage} />} />
						<Route path="/my_pins" component={UserPinsContainer} />
						<Route path="/logout" render={(props) => <Logout {...props} handleLogout={this.handleLogout} />} />
						<Route exact path="/pins/:pinID" component={FullViewPin} />
						<Route exact path="/users/:username" component={UserGallery} />
						<Route path="/404" component={NotFound} />
						<Route component={NotFound} />
					</Switch>
				</div>
			</div>
		)
	}
}

export default Main