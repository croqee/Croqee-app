import React from 'react';
import { connect } from 'react-redux';
import { getUsersScore, getScoredModels } from '../../../js/actions';

class LeaderboardPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
		this.props.getUsersScore(1);
		this.props.getScoredModels();
	}
	componentDidMount() {}
	render() {
		return (
			<div className = "leaderboard">
								<br/>
				<h2 className = "leaderboard__title">Community Leaderboards</h2>
				<div className = "leaderboard__scores">
				{this.props.usersScore && this.props.usersScore.data && this.props.usersScore.data.map((score, i) => {
					return (
						<React.Fragment>
						<div  className={`leaderboard__scores__row   ${this.props.user.email === score.user.email ? "leaderboard__scores__row--self":""} `}>
							<span className="leaderboard__scores__row__rank"> {score.rank}</span>
							<span  className="leaderboard__scores__row__img"> <img src="https://scontent-arn2-1.xx.fbcdn.net/v/t1.0-9/1378086_10151970342051354_1573893885_n.jpg?_nc_cat=111&_nc_oc=AQk34qTD8r1DjEzNVOKoLah9lVEuqltXHb0Y3a598xzxUVxW4HnUlmyD8Lw6uNpERj0&_nc_ht=scontent-arn2-1.xx&oh=20be8d2ed50c74027a84aa5abcc43b19&oe=5EA1A05E"/></span>
							<span className="leaderboard__scores__row__user"> {score.user && score.user.name}</span>
							<span className="leaderboard__scores__row__score">{score.total}</span>
						</div>
						{score.rank === 10 && this.props.usersScore.data.length > 10 &&
						<div className="leaderboard__scores__etc">
							. . .
						</div> }
						</React.Fragment>
					);
				})}
	    	</div>
			{this.props.usersScore && this.props.usersScore.userRank && 
			<h2 className = "leaderboard__title">You're ranked <b>{this.props.usersScore.userRank}</b> out of <b>{this.props.usersScore.totalScores}</b> artists for scores earned </h2>
		}

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
		getScoredModels: () => dispatch(getScoredModels())
	};
};
export default connect(mapStateToProps, mapDispatchToProps)(LeaderboardPage);
