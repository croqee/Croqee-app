import React from 'react';
import { connect } from 'react-redux';
import {
  setActiveModel,
} from '../../../state-manager/actions';

export const CANVAS_RETRY_OVERLAY_CLASS = 'canvas-retry-overlay';

class CanvasRetryOverlay extends React.Component {

  retryDrawing() {
    this.props.setActiveModel({
      ...this.props.activeModel,
      isDrawn: false,
    });
  }

  render() {
    const {
      canvasWidth,
      canvasHeight,
    } = this.props;
    return (
      <div
        className={
          !this.props.activeModel.isDrawn
            ? `${CANVAS_RETRY_OVERLAY_CLASS} ${CANVAS_RETRY_OVERLAY_CLASS}'--fadeout'`
            : `${CANVAS_RETRY_OVERLAY_CLASS} ${CANVAS_RETRY_OVERLAY_CLASS}'--fadein'`
        }
        style={{
          width: `${canvasWidth}px`,
          height: `${canvasHeight}px`,
          marginBottom: `-${canvasHeight}px`,
          paddingTop: `${canvasHeight / 2 - 100}px`,
        }}
      >
        <button
          onClick={() => this.props.navigateToClubPage()}
          className={CANVAS_RETRY_OVERLAY_CLASS + '-compete-button'}
        >
          Draw more models and compete
                </button>

        <h3> OR </h3>

        <button
          onClick={() => this.retryDrawing()}
          className={CANVAS_RETRY_OVERLAY_CLASS + '-retry-button'}
        >
          Retry
                </button>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const {
    activeModel,
    canvasWidth,
    canvasHeight,
  } = state;
  return {
    activeModel,
    canvasWidth,
    canvasHeight,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setActiveModel: (payload) => dispatch(setActiveModel(payload)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CanvasRetryOverlay);