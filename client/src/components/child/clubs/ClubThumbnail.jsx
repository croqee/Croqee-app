import React from 'react';
import { connect } from 'react-redux';

class ClubThumbnail extends React.Component {
	constructor(props) {
		super(props);
	}
	componentDidMount() {
	}
	render() {
		return (
			<div className={"clubthumbnail clubthumbnail--" + this.props.drawingField} onClick={()=>this.props.handleNavigationToCompetition(this.props.drawingField)}>
				<div className="clubthumbnail__overlay">
				</div>
				<span className="clubthumbnail__text">{this.props.text}</span>
			</div>
		)
	}
}
const mapStateToProps = state => {
	const { } = state;
	return {};
};
const mapDispatchToProps = dispatch => {
	return {
	};
}
export default connect(mapStateToProps, mapDispatchToProps)(ClubThumbnail);
