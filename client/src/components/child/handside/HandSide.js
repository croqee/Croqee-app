import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setHandSide } from '../../../js/actions';

class HandSide extends Component {
  constructor(props) {
    super(props);
    this.state = {
      handSideStatusClass: '',
    };
  }
  componentDidUpdate(prevProps) {
    if (prevProps.timerDone != this.props.timerDone) {
      if (this.props.timerDone) {
        this.setState({
          handSideStatusClass: 'hand-side--fade-in',
        });
      } else {
        this.setState({
          handSideStatusClass: 'hand-side--fade-out',
        });
      }
    }
  }

  render() {
    const { setHandSide, leftHand } = this.props;
    const { handSideStatusClass } = this.state;
    return (
      <div id='handside' className={'hand-side ' + handSideStatusClass}>
        <input
          onClick={() => setHandSide(true)}
          id='toggle-off'
          value={leftHand}
          className='toggle toggle-left'
          name='toggle'
          type='radio'
          defaultChecked={leftHand}
        />
        <label for='toggle-off' className='btn'>
          Left hand
        </label>
        <input
          onClick={() => setHandSide(false)}
          id='toggle-on'
          value={!leftHand}
          className='toggle toggle-right'
          name='toggle'
          type='radio'
          defaultChecked={!leftHand}
        />
        <label for='toggle-on' className='btn'>
          Right hand
        </label>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  const { leftHand, timerDone } = state;
  return { leftHand, timerDone };
};
const mapDispatchToProps = (dispatch) => {
  return {
    setHandSide: (payload) => dispatch(setHandSide(payload)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(HandSide);
