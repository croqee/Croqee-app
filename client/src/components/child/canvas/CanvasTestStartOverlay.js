import React from 'react';
import { connect } from 'react-redux';
const CANVAS_TEST_START_OVERLAY_CLASS = 'canvas-test-start-overlay';

class CanvasTestStartOverlay extends React.Component {
  
  render() {
    const {
      canvasHeight,
    } = this.props;
    return (
        <span
        className={CANVAS_TEST_START_OVERLAY_CLASS}
        style={{
          top: `${canvasHeight / 2 - 40}px`,
        }}
      >
        Draw the model here
      </span>
    );
  }
}
const mapStateToProps = (state) => {
  const {
    canvasHeight,
  } = state;
  return {
    canvasHeight,
  };
};

const mapDispatchToProps = () => {}

export default connect(mapStateToProps, mapDispatchToProps)(CanvasTestStartOverlay);

