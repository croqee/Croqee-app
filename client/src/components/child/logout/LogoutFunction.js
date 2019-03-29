import React from 'react';
import Auth from '../../../modules/Auth';


class LogoutFunction extends React.Component {
  constructor(props) {
    super(props);

  }
  componentDidMount() {
    // deauthenticate user
    Auth.deauthenticateUser();
    // change the current URL to / after logout
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

export default LogoutFunction;