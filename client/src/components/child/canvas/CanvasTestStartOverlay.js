import React from 'react';
const CANVAS_TEST_START_OVERLAY_CLASS = 'canvas-test-start-overlay';

class CanvasTestStartOverlay extends React.Component {
  
  render() {
    const {
      height,
    } = this.props;
    return (
        <span
        className={CANVAS_TEST_START_OVERLAY_CLASS}
        style={{
          top: `${height / 2 - 40}px`,
        }}
      >
        Draw the model here
      </span>
    );
  }
}

export default CanvasTestStartOverlay;