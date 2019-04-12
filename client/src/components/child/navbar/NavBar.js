import React from 'react';
import Auth from '../../../modules/Auth';
import { BrowserRouter as Router, Route, Switch, Link, Redirect, withRouter } from 'react-router-dom';

class NavBar extends React.Component {
	componentDidMount() {}

	render() {
		return (
			<div>
				<div class="nav">
					<input type="checkbox" id="nav-check" />
					<div class="nav-header">
						<div class="nav-title">Croqee</div>
					</div>
					<div class="nav-btn">
						<label for="nav-check">
							<span />
							<span />
							<span />
						</label>
					</div>

					<div class="nav-links">
						<Link className="nav-link" to="/">
							Home
						</Link>
						<Link className="nav-link" to="/signup">
							Sign up
						</Link>
						<Link className="nav-link" to="/login">
							Login
						</Link>
						<Link className="nav-link" to="/LogOut">
							LogOut
						</Link>
					</div>
				</div>
			</div>
		);
	}
}

export default NavBar;
