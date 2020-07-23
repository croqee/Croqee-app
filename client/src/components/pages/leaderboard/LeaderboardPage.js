import React from 'react';
import { connect } from 'react-redux';
import { getUsersScore, getScoredModels } from '../../../js/actions';
import { Avatar } from "@material-ui/core";
import default_image from '../../../img/default-image.png'; 

class LeaderboardPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      overAllPercentage: 0,
    };
    this.props.getUsersScore(1);
    this.props.getScoredModels();
  }
  componentDidMount() {}
  componentDidUpdate(prevProps) {
    if (prevProps.usersScore !== this.props.usersScore) {
      let overAllPercentage = Math.round(
        ((this.props.usersScore.totalScores - this.props.usersScore.userRank) /
          this.props.usersScore.totalScores) *
          100
      );
      this.setState({
        overAllPercentage: overAllPercentage + '%',
      });
    }
  }
  render() {
    return (
      <div className='leaderboard'>
        <br />
        <h2 className='leaderboard__title'>Community Leaderboards</h2>
        <div className='leaderboard__left'>
          <div className='leaderboard__overall-percentage'>
            <div className='leaderboard__overall-percentage__circle'>
              <span className='leaderboard__overall-percentage__circle__text'>
                {this.state.overAllPercentage}
              </span>
            </div>
            <div className='leaderboard__overall-percentage__desc'>
              You have more overall scores than{' '}
              <b>{this.state.overAllPercentage}</b> of other participants
            </div>
          </div>
        </div>
        <div className='leaderboard__right'>
          <div className='leaderboard__topic-percentage'>
            <div className='leaderboard__topic-percentage__circle'>
              <span className='leaderboard__topic-percentage__circle__text'>
                50%
              </span>
            </div>
            <div className='leaderboard__topic-percentage__desc'>
              Still life
            </div>
          </div>
          <div className='leaderboard__topic-percentage'>
            <div className='leaderboard__topic-percentage__circle'>
              <span className='leaderboard__topic-percentage__circle__text'>
                21%
              </span>
            </div>
            <div className='leaderboard__topic-percentage__desc'>Anatomy</div>
          </div>
        </div>
        <div className='leaderboard__scores'>
          {this.props.usersScore &&
            this.props.usersScore.data &&
            this.props.usersScore.data.map((score, i) => {
              return (
                <React.Fragment>
                  <div
                    className={`leaderboard__scores__row   ${
                      this.props.user.email === score.user.email &&
                      'leaderboard__scores__row--self'
                    } `}
                    onClick={() => {
                      this.props.history.push(`/userprofile/${score._id}`);
                    }}
                  >
                    <span className='leaderboard__scores__row__rank'>
                      {' '}
                      {score.rank}
                    </span>
                    <span className='leaderboard__scores__row__img'>
                      {score.user.img ? (<Avatar src={"/user-image/" + score.user.img.image_data} alt="profile image" />) : (<Avatar src={default_image}  alt="profile image" />)}
                    </span>
                    <span className='leaderboard__scores__row__user'>
                      {score.user && score.user.name}
                    </span>
                    <span className='leaderboard__scores__row__score'>
                      {score.total}
                    </span>
                  </div>
                  {score.rank === 10 &&
                    this.props.usersScore.data.length > 10 && (
                      <div className='leaderboard__scores__etc'>. . .</div>
                    )}
                </React.Fragment>
              );
            })}
        </div>
        {this.props.usersScore && this.props.usersScore.userRank && (
          <h2 className='leaderboard__rank-desc'>
            You're ranked <b>{this.props.usersScore.userRank}</b> out of{' '}
            <b>{this.props.usersScore.totalScores}</b> artists for scores
            earned!{' '}
          </h2>
        )}
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  const { usersScore, user } = state;
  return { usersScore, user };
};
const mapDispatchToProps = (dispatch) => {
  return {
    getUsersScore: (page) => dispatch(getUsersScore(page)),
    getScoredModels: () => dispatch(getScoredModels()),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(LeaderboardPage);
