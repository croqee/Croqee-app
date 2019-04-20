import React, { Component } from 'react' 
import { connect } from 'react-redux';
import { setHandSide } from '../../../js/actions';

class HandSide extends Component {

componentDidMount(){

}

    render() {
        let leftHand = this.props.leftHand
        let setHandSide = this.props.setHandSide
        return (
            <div id="handside">
                <input onClick={() => setHandSide(true)} id="toggle-off" value={ leftHand} className="toggle toggle-left" name="toggle"  type="radio" checked={ leftHand } />
                <label for="toggle-off" className="btn">Left hand</label>
                <input onClick={() => setHandSide(false)} id="toggle-on" value={!leftHand} className="toggle toggle-right" name="toggle" type="radio" checked={ !leftHand } />
                <label for="toggle-on" className="btn">Right hand</label>
            </div>
        )
    }
}
const mapStateToProps = state => {
    const { leftHand} = state;
    return {leftHand };
};
const mapDispatchToProps = dispatch => {
    return {
        setHandSide: (payload) => dispatch(setHandSide(payload)),

    };
}

export default connect(mapStateToProps,mapDispatchToProps)(HandSide)