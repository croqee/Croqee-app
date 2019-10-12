import React from 'react';
import Auth from '../../../modules/Auth';
import { BrowserRouter as Router, Route, Switch, Link, Redirect, withRouter } from 'react-router-dom';
import logo from "../../../img/logo.png"
import { connect } from 'react-redux';
import { getUser } from '../../../js/actions';

class NavBar extends React.Component {
	componentDidMount() {
		this.props.getUser();
	}

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
						<Link className="nav-link" to="/">
							Hello {this.props.user.name}
						</Link>
						<span className="nav-links_seperator"/>
						<Link className="nav-link" to="/LogOut">
							Log out
						</Link>
					</div>
					:
					<div class="nav-links">
					<Link className="nav-link" to="/">
						Home
					</Link>
					<span className="nav-links_seperator"/>

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
	const {isAuthenticated,user} = state;
	return {isAuthenticated,user};
  };
	const mapDispatchToProps = dispatch => {
		return {
			getUser: () => dispatch(getUser()),
		};
	}

export default connect(mapStateToProps , mapDispatchToProps)(NavBar);
