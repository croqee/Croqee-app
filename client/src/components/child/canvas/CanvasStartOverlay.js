import React from 'react';
import CanvasTestStartOverlay from './CanvasTestStartOverlay';
import CanvasCompeteStartOverlay from './CanvasCompeteStartOverlay';
import { connect } from 'react-redux';
export const CANVAS_START_OVERLAY_CLASS = "canvas-start-overay";

class CanvasStartOverlay extends React.Component {

  render() {
    const {
      canvasWidth,
      canvasHeight,
      isCompeting,
      canStartDrawing,
      canJoinClub,
      fadeOut
    } = this.props;
    return (
      <div
        className={
          fadeOut
            ? `${CANVAS_START_OVERLAY_CLASS} ${CANVAS_START_OVERLAY_CLASS}--fadeout`
            : `${CANVAS_START_OVERLAY_CLASS} ${CANVAS_START_OVERLAY_CLASS}--fadein `
        }
        style={{
          width: `${canvasWidth}px`,
          height: `${canvasHeight}px`,
          marginBottom: `-${canvasHeight}px`,
        }}
      >

        {isCompeting ? (
          <CanvasCompeteStartOverlay
            canStartDrawing={canStartDrawing}
            canJoinClub={canJoinClub} />
        ) : (
            <CanvasTestStartOverlay />
          )}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const {
    canvasWidth,
    canvasHeight,
  } = state;
  return {
    canvasWidth,
    canvasHeight,
  };
};

export default connect(mapStateToProps, {})(CanvasStartOverlay);