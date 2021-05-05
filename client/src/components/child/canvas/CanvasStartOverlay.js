import React from 'react';
import CanvasTestStartOverlay from './CanvasTestStartOverlay';
import CanvasCompeteStartOverlay from './CanvasCompeteStartOverlay';
export const CANVAS_START_OVERLAY_CLASS = "canvas-start-overay";

class CanvasStartOverlay extends React.Component {

  render() {
    const {
      width,
      height,
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
          width: `${width}px`,
          height: `${height}px`,
          marginBottom: `-${height}px`,
        }}
      >

        {isCompeting ? (
          <CanvasCompeteStartOverlay
            height={height}
            canStartDrawing={canStartDrawing}
            canJoinClub={canJoinClub} />
        ) : (
            <CanvasTestStartOverlay height={height} />
          )}
      </div>
    );
  }
}

export default CanvasStartOverlay;