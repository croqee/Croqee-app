import React from 'react';
import { connect } from 'react-redux';
import { getUsersScore, getScoredModels } from '../../../js/actions';

class LeaderboardPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
		this.props.getUsersScore();
		this.props.getScoredModels();
	}
	componentDidMount() {}
	render() {
		return (
			<React.Fragment>
				{this.props.usersScore.map((score, i) => {
					return (
						<div>
							<span> {i + 1}</span>
							<span>{score.user.name}</span>
							<span>{score.total}</span>
						</div>
					);
				})}
			</React.Fragment>
		);
	}
}
const mapStateToProps = (state) => {
	const { usersScore } = state;
	return { usersScore };
};
const mapDispatchToProps = (dispatch) => {
	return {
		getUsersScore: () => dispatch(getUsersScore()),
		getScoredModels: () => dispatch(getScoredModels())
	};
};
export default connect(mapStateToProps, mapDispatchToProps)(LeaderboardPage);
