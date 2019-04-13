import React from 'react';
import Auth from '../../../modules/Auth';
import { BrowserRouter as Router, Route, Switch, Link, Redirect, withRouter } from 'react-router-dom';
import logo from "../../../img/logo.png"
import { connect } from 'react-redux';

class NavBar extends React.Component {
	componentDidMount() {}

	render() {
		return (
		
				<div class="nav">
					<input type="checkbox" id="nav-check" />
					<div class="nav-header">
						<div class="nav-title"><img id ="logo" src={logo}/></div>
					</div>
					<div class="nav-btn">
						<label for="nav-check">
							<span />
							<span />
							<span />
						</label>
					</div>

                    {this.props.isAuthenticated ?
					<div class="nav-links">
						<Link className="nav-link" to="/">
							Home
						</Link>
						<Link className="nav-link" to="/LogOut">
							LogOut
						</Link>
					</div>
					:
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
				</div>
				}


				</div>
	
		);
	}
}
const mapStateToProps = state => {
	const {isAuthenticated} = state;
	return {isAuthenticated};
  };
  const mapDispatchToProps = dispatch => {

  }

export default connect(mapStateToProps , mapDispatchToProps)(NavBar);
