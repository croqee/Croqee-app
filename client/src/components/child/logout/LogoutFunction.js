import React from 'react';
import Auth from '../../../modules/Auth';
import {connect} from "react-redux"
import { authenticate,setUser } from '../../../js/actions';

class LogoutFunction extends React.Component {
  constructor(props) {
    super(props);

  }
  componentDidMount() {
    // deauthenticate user
    Auth.deauthenticateUser();
    // change the current URL to / after logout
    this.props.authenticate(false);
    this.props.setUser({});

    this.props.history.push('/');
  }

  render() {
    return (
      <div>
        <p>Logging out...</p>
      </div>
    )
  }
}
const mapDispatchToProps = dispatch => {
	return {
    authenticate: (payload) => dispatch(authenticate(payload)),
    setUser: (payload) => dispatch(setUser(payload))
	  };
  }


export default connect(null, mapDispatchToProps)(LogoutFunction);