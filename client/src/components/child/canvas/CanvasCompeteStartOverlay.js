import React from 'react';
import { connect } from 'react-redux';


export const CANVAS_COMPETE_START_OVERLAY_CLASS = 'canvas-compete-start-overlay';

class CanvasCompeteStartOverlay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      countDown: 7,
      competeTextHideClass: '',
      moveStartTextClass: '',
    };
  }


  componentDidUpdate(prevProps) {
    if (prevProps.canStartDrawing !== this.props.canStartDrawing) {
      this.setState({
        competeTextHideClass: `${CANVAS_COMPETE_START_OVERLAY_CLASS}-item--hide`,
        moveStartTextClass: `${CANVAS_COMPETE_START_OVERLAY_CLASS}-item--enlarge`,
      });
    }
    if (prevProps.canJoinClub !== this.props.canJoinClub) {
      this.startCountDown();
    }
  }

  startCountDown() {
    if (this.state.countDown > 1) {
      setTimeout(() => {
        this.setState({ countDown: --this.state.countDown });
        this.startCountDown();
      }, 1000);
    } else {
      return false;
    }
  }


  render() {
    const { canvasHeight } = this.props;
    const {
      countDown,
      competeTextHideClass,
      moveStartTextClass,
    } = this.state;

    return (
      <div
        className={CANVAS_COMPETE_START_OVERLAY_CLASS}
        style={{
          top: `${canvasHeight / 2 - 40}px`,
        }}
      >
        <div className={CANVAS_COMPETE_START_OVERLAY_CLASS + '__first-line'}>
          <span
            className={
              CANVAS_COMPETE_START_OVERLAY_CLASS + '__first-line-start ' +
              moveStartTextClass
            }
          >
            Start  drawing
            </span>
          <span
            className=
            {CANVAS_COMPETE_START_OVERLAY_CLASS + '__first-line-text ' +
              competeTextHideClass
            }
          >
            {' '}
           the model
          </span>
        </div>
        <div className={CANVAS_COMPETE_START_OVERLAY_CLASS + '__second-line'}>
          <span
            className={CANVAS_COMPETE_START_OVERLAY_CLASS + '__second-line-text ' +
              competeTextHideClass
            }
          >
            here in{' '}
          </span>
          <span
            className={CANVAS_COMPETE_START_OVERLAY_CLASS + '__second-line-text-counter ' +
              competeTextHideClass
            }
          >
            {countDown}
          </span>
          <span
            className={CANVAS_COMPETE_START_OVERLAY_CLASS + '__second-line-text ' +
              competeTextHideClass
            }
          >
            {' '}
            seconds
          </span>
        </div>
      </div>
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

export default connect(mapStateToProps, {})(CanvasCompeteStartOverlay);

