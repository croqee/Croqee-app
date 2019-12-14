import React from 'react';
import { connect } from 'react-redux';
import ClubThumbnail from '../../child/clubs/ClubThumbnail';

class ClubsPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	componentDidMount() {}
	render() {
		return (
			<div className="clubpage"  onClick={()=>this.props.history.push("/compete")}>
				<div className="clubpage__wrapper">
				<h1 className="clubpage__wrapper__header">Select the subject to enter the competition</h1>

					<ClubThumbnail />
				</div>
			</div>
		);
	}
}
const mapStateToProps = (state) => {
	const {} = state;
	return {};
};
const mapDispatchToProps = (dispatch) => {
	return {};
};
export default connect(mapStateToProps, mapDispatchToProps)(ClubsPage);
