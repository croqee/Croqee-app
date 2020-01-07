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
				<table className = "leaderboard__table"> 
  <tr className = "leaderboard__table__head">
    <th>RANK</th>
    <th>USER</th>
    <th>SCORE</th>
  </tr>
				{this.props.usersScore && this.props.usersScore.data && this.props.usersScore.data.map((score, i) => {
					return (
						<tr  className={`leaderboard__table__tr   ${this.props.user.email === score.user.email ? "leaderboard__table__tr--self":""} `}>
							<th> {score.rank}</th>
							<th>{score.user && score.user.name}</th>
							<th>{score.total}</th>
						</tr>
					);
				})}
		</table>
				<div className="leaderboard__pagination">
				<span>Page </span>
				{[...Array(this.props.usersScore.totalPages)].map((_page,i)=>{
					let page = i + 1;
					return(
					<button className={`leaderboard__pagination__button  ${parseInt(this.props.usersScore.page) === page ? "leaderboard__pagination__button--active":""} `} onClick={()=>this.props.getUsersScore(page)}>{page} </button>
					)
				})}
				</div>
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
