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
				{this.props.usersScore && this.props.usersScore.data && this.props.usersScore.data.map((score, i) => {
					return (
						<div>
							<span> {score.rank}</span>
							<span>{score.user && score.user.name}</span>
							<span>{score.total}</span>
						</div>
					);
				})}
				<div className="leaderboard__pagination">
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
	const { usersScore } = state;
	return { usersScore };
};
const mapDispatchToProps = (dispatch) => {
	return {
		getUsersScore: (page) => dispatch(getUsersScore(page)),
		getScoredModels: () => dispatch(getScoredModels())
	};
};
export default connect(mapStateToProps, mapDispatchToProps)(LeaderboardPage);
