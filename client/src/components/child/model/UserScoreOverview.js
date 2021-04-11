import React, { Component } from 'react';

class UserScoreOverview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      usersScoreFadeClass: '',
    };
  }
  componentDidMount() {
        this.displayConcurrentUsersScores();
  }

    displayConcurrentUsersScores() {
      this.setState(
        {
          usersScoreFadeClass: 'users-scores--fadein',
        },
        () => {
          setTimeout(() => {
            this.setState({
              usersScoreFadeClass: 'users-scores--fadeout',
            });
          }, 8000);
        }
      );
    }

    render() {
      const {
        usersScoreFadeClass,
      } = this.state;
      const {
        styles,
        width,
        height,
        playingUsers,
        user,
      } = this.props;
  
      return (
        <div
          className={`users-scores ${usersScoreFadeClass}`}
          style={{
            ...styles.model,
            width: `${width}px`,
            height: `${height}px`,
            position: 'absolute',
            top: 0,
            left: 0,
          }}
        >
          <div className='users-scores__currently-playing'>Currently playing</div>
          <div className='tbl-header'>
            <table cellPadding='0' cellSpacing='0' border='0'>
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Name</th>
                  <th>Score</th>
                </tr>
              </thead>
            </table>
          </div>
          <div
            className='tbl-content'
            style={{
              height: `${height - 87}px`,
            }}
          >
            <table cellPadding='0' cellSpacing='0' border='0'>
              <tbody>
                {playingUsers &&
                  playingUsers.map((u, i) => {
                    return (
                      <tr
                        className={u._id === user._id ? 'tbl-content__orange' : ''}
                      >
                        <td>{i + 1}</td>
                        <td>{u.name}</td>
                        <td>{u.score}</td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

}

export default UserScoreOverview;
