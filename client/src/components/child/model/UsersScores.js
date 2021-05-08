import React, { Component } from 'react';
const USERS_SCORES_CLASS = 'users-scores';

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
        usersScoreFadeClass: `${USERS_SCORES_CLASS}--fadein`,
      },
      () => {
        setTimeout(() => {
          this.setState({
            usersScoreFadeClass: `${USERS_SCORES_CLASS}--fadeout`,
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
      width,
      height,
      playingUsers,
      user,
    } = this.props;

    return (
      <div
        className={USERS_SCORES_CLASS + ' ' + usersScoreFadeClass}
        style={{
          width: `${width}px`,
          height: `${height}px`,
          position: 'absolute',
          top: 0,
          left: 0,
        }}
      >
        <div className={USERS_SCORES_CLASS + '__currently-playing'}>Currently playing</div>
        <div className={USERS_SCORES_CLASS + '__header-table'}>
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
          className={USERS_SCORES_CLASS + '__users-table'}
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
                      className={u._id === user._id ? `${USERS_SCORES_CLASS}__users-table-main-user` : ''}
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
