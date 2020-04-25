import React from 'react';
import { connect } from 'react-redux';
import ClubThumbnail from '../../child/clubs/ClubThumbnail';

class ClubsPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	componentDidMount() { }
	handleNavigationToCompetition = (drawingField) => {
		return this.props.history.push(`/compete/${drawingField}`);
	}
	render() {
		return (
			<div className="clubpage">
				<div className="clubpage__wrapper">
					<h1 className="clubpage__wrapper__header">Select the subject to enter the competition</h1>
					<ClubThumbnail drawingField="still-life" text={"Still life objects"} handleNavigationToCompetition={this.handleNavigationToCompetition} />
					<ClubThumbnail drawingField="anatomy" text={"Human anatomy models"} handleNavigationToCompetition={this.handleNavigationToCompetition} />

				</div>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	const { } = state;
	return {};
};
const mapDispatchToProps = (dispatch) => {
	return {};
};
export default connect(mapStateToProps, mapDispatchToProps)(ClubsPage);
