import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route } from 'react-router-dom'

import createHistory from 'history/createBrowserHistory'

export const history = createHistory()

history.listen((location, action) => {
	window.scrollTo(0, 0)
})

import Main from './components/Main.jsx'

class App extends React.Component {
	render() {
		return (
			<Router history={history}>
				<Route path='/' component={Main} />
			</Router>
		)
	}
}

ReactDOM.render(
	<App />,
	document.getElementById('root')
)