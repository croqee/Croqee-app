import React, { Component } from 'react';

class CompetePageUsers extends Component {
  render() {
    const playingUsers = this.props.playingUsers;
    return (
      <div className='compete-page-users'>
        <h3> Players</h3>
        {playingUsers.length !== 0 &&
          playingUsers.map((user, i) => {
            return (
              <React.Fragment>
                {i > 0 && <div className='compete-page-users__user-splitter' />}
                <div className='compete-page-users__user' key={user._id}>
                  <div className='compete-page-users__user-name'>
                    {user.name}{' '}
                  </div>
                  <div className='compete-page-users__user-score'></div>
                </div>
              </React.Fragment>
            );
          })}
      </div>
    );
  }
}
export default CompetePageUsers;
