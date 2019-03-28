import React, { Component } from 'react';
import './App.css';
import CanvasPage from './components/canvas/CanvasPage';
import LoginPage from "./components/login/LoginPage"
import SignUpPage from "./components/signup/SignUpPage"
import axios from 'axios';
import { BrowserRouter as Router, Route, Switch, Link, Redirect, withRouter } from 'react-router-dom';
import Auth from './modules/Auth';

const PrivateRoute = ({ component: Component, ...rest }) => (
	<Route
		{...rest}
		render={(props) =>
			Auth.isUserAuthenticated() ? (
				<Component {...props} {...rest} />
			) : (
				<React.Fragment>
					<Redirect
						to={{
							pathname: '/login',
							state: { from: props.location }
						}}
					/>
				</React.Fragment>
			)}
	/>
);

const LoggedOutRoute = ({ component: Component, ...rest }) => (
	<Route
		{...rest}
		render={(props) =>
			Auth.isUserAuthenticated() ? (
				<Redirect
					to={{
						pathname: '/',
						state: { from: props.location }
					}}
				/>
			) : (
				<Component {...props} {...rest} />
			)}
	/>
);
const GlobalRoute = ({ component: Component, ...rest }) => (
	<Route {...rest} render={(props) => <Component {...props} {...rest} />} />
);

class App extends Component {
	state = {
		greet: '',
		note: ''
	};

	componentDidMount() {
		axios.post('/').then((response) => {
			console.log(response);
			const { greet, note, messageFromPython } = response.data;
			this.setState({
				greet,
				note,
				messageFromPython
			});
		});
	}

	render() {
		return (
			<div className="App">
				<Router>
					<div>
						<ul>
							<li>
								<Link to="/">Home</Link>
							</li>
							<li>
								<Link to="/signup">Sign up</Link>
							</li>
							<li>
								<Link to="/login">Login</Link>
							</li>
						</ul>
						<h2>{this.state.greet}</h2>
						<h2>{this.state.messageFromPython}</h2>
						<p>{this.state.note}</p>
						<PrivateRoute exact path="/" component={CanvasPage} />
						<LoggedOutRoute path="/signup" component={SignUpPage} />
						<LoggedOutRoute path="/login" component={LoginPage} />
					</div>
				</Router>
			</div>
		);
	}
}

export default App;
