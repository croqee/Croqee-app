import React, { Component } from 'react';
import './App.css';
import CanvasPage from './components/pages/canvas/CanvasPage';
import LoginPage from "./components/pages/login/LoginPage"
import SignUpPage from "./components/pages/signup/SignUpPage"
import LogoutFunction from "./components/child/LogoutFunction"
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
							<li>
							<Link to="/LogOut">LogOut</Link>
							</li>
						</ul>
						<h2>{this.state.greet}</h2>
						<h2>{this.state.messageFromPython}</h2>
						<p>{this.state.note}</p>
						<img src="./model.jpg" className="modelImg"/>

						<PrivateRoute exact path="/" component={CanvasPage} />
						<LoggedOutRoute path="/signup" component={SignUpPage} />
						<LoggedOutRoute path="/login" component={LoginPage} />
						<PrivateRoute path="/logout" component={LogoutFunction} />

					</div>
				</Router>
			</div>
		);
	}
}

export default App;
