import React from 'react';
import { connect } from 'react-redux';
import {
  setTimer,
  invokeScore,
  setImageProcessing,
  setTimerDone,
} from '../../../state-manager/actions';
import Loader from '../loader/Loader';
import { calcCanvasAndModelDim } from '../../../lib/CalcCanvasAndModelDim';
import { throttle } from '../../../lib/Throttle';
import CanvasRetryOverlay from './CanvasRetryOverlay';
import DrawingResult from './DrawingResult';
import CanvasStartOverlay from './CanvasStartOverlay';

export const CANVAS_CLASS = 'canvas';

const styles = {
  canvas: {
    cursor: 'crosshair',
  },
};

class Canvas extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      baseURL: null,
      fadeOut: false,
      isSizeSet: false,
      width: null,
      height: null,
      imgWidth: null,
      imgHeight: null,
      drawing: false,
      currentColor: 'black',
      cleared: false,
    };

    window.addEventListener('resize', () => {
      this.setCanvasSize();
    });
  }

  componentDidMount() {
    setTimeout(() => {
      this.setCanvasSize();
      this.initCanvas();
    }, 2);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.shouldResetCanvas !== this.props.shouldResetCanvas) {
      if (this.props.shouldResetCanvas) {
        this.reset();
        this.props.setShouldResetCanvas(false);
      }
    }
    if (prevProps.leftHand !== this.props.leftHand) {
      this.setCanvasSize();
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

  setCanvasSize() {
    const { width, height, imgWidth, imgHeight } = calcCanvasAndModelDim(() => {
      styles.canvas = {
        ...styles.canvas,
        marginRight: '0',
      };
    });

    this.setState({ isSizeSet: false }, () => {
      this.setState(
        {
          width,
          height,
          imgWidth,
          imgHeight,
          isSizeSet: true,
        },
        () => {
          this.reset();
        }
      );
    });
  }

  reset() {
    //clears it to all white, resets state to original
    let ratio = 700;
    if (this.state.width < 500) {
      ratio = 1800;
    }
    let lineWidth = (2 * this.state.width) / ratio;
    this.setState({
      lineWidth: lineWidth,
    });
    if (this.refs.canvas) {
      this.ctx = this.refs.canvas.getContext('2d');
      this.ctx.fillStyle = 'white';
      this.ctx.fillRect(0, 0, this.state.width, this.state.height);
      this.initCanvas();
    }
  }


  initCanvas() {
    this.setState({
      canvas: this.refs.canvas,
    });
    this.refs.canvas.addEventListener('mousedown', this.onMouseDown, false);
    this.refs.canvas.addEventListener('mouseup', this.onMouseUp, false);
    this.refs.canvas.addEventListener('mouseout', this.onMouseUp, false);
    this.refs.canvas.addEventListener(
      'mousemove',
      throttle(this.onMouseMove, 5),
      false
    );
    this.refs.canvas.addEventListener('touchstart', this.onMouseDown, false);
    this.refs.canvas.addEventListener(
      'touchmove',
      throttle(this.onTouchMove, 5),
      false
    );
    this.refs.canvas.addEventListener('touchend', this.onMouseUp, false);
  }

  drawLine = (x0, y0, x1, y1, color, emit, force) => {
    if (this.props.canStartDrawing) {
      if (this.props.timerDone) {
        if (this.props.isInHomePage) {
          this.props.setTimer({ showTimer: true, timer: 10 });
          this.props.setTimerDone(false);
        } else {
          this.props.setHasUserDrawnOnCanvas(true);
        }
        this.setState({
          fadeOut: true,
        });
      }
    }
    const context = this.state.canvas.getContext('2d');
    context.beginPath();
    context.moveTo(x0, y0);
    context.lineTo(x1, y1);
    context.strokeStyle = color;
    context.lineWidth = this.state.lineWidth;
    if (force) {
      context.lineWidth = this.state.lineWidth * (force * (force + 10));
    }
    context.stroke();
    context.closePath();

    if (!emit) {
      return;
    }
  };

  onMouseDown = (e) => {
    e.preventDefault();
    this.setState(() => {
      return {
        currentX: e.clientX,
        currentY: e.clientY,
        drawing: true,
      };
    });
  };

  onMouseUp = (e) => {
    this.setState(() => {
      return {
        drawing: false,
        currentX: e.clientX,
        currentY: e.clientY,
      };
    });
  };

  onMouseMove = (e) => {
    if (!this.state.drawing) {
      return;
    }
    this.setState(() => {
      return {
        currentX: e.clientX,
        currentY: e.clientY,
      };
    },
      this.drawLine(
        this.state.currentX - this.refs.canvas.getBoundingClientRect().left,
        this.state.currentY - this.refs.canvas.getBoundingClientRect().top,
        e.clientX - this.refs.canvas.getBoundingClientRect().left,
        e.clientY - this.refs.canvas.getBoundingClientRect().top,
        this.state.currentColor, true));
  };

  onTouchMove = (e) => {
    e.preventDefault();
    if (!this.state.drawing) {
      return;
    }
    this.setState(() => {
      this.drawLine(
        this.state.currentX - this.refs.canvas.getBoundingClientRect().left,
        this.state.currentY - this.refs.canvas.getBoundingClientRect().top,
        e.touches[0].clientX - this.refs.canvas.getBoundingClientRect().left,
        e.touches[0].clientY - this.refs.canvas.getBoundingClientRect().top,
        this.state.currentColor,
        true,
        e.touches[0].force
      );

      return {
        currentX: e.touches[0].clientX,
        currentY: e.touches[0].clientY,
      };
    });
  };

  render() {
    const {
      fadeOut,
      width,
      height,
      imgWidth,
      imgHeight,
      isSizeSet,
    } = this.state;
    const { isCompeting } = this.props;
    const side = this.props.leftHand ? `${CANVAS_CLASS}--left-hand` : '';
    return (
      <React.Fragment>
        {isSizeSet && (
          <div
            className={CANVAS_CLASS + ' ' + side}
            width={`${width}px`}
            height={`${height}px`}
          >
            {this.props.imageProcessing &&
              <Loader
              />}

            <CanvasStartOverlay
              height={height}
              canStartDrawing={this.props.canStartDrawing}
              canJoinClub={this.props.canJoinClub}
              isCompeting={isCompeting}
              fadeOut={fadeOut}
            />

            {this.props.activeModel.isDrawn && !isCompeting && (
              <CanvasRetryOverlay
                width={width}
                height={height}
                navigateToClubPage={this.props.navigateToClubPage}
              />
            )}

            <DrawingResult
              width={width}
              height={height}
              imgWidth={imgWidth}
              imgHeight={imgHeight}
              isInHomePage={this.props.isInHomePage}
              imgPath={this.props.imgPath}
              model={this.props.model}
              baseURL={this.props.baseURL}
            />
            <canvas
              id='canvas__drawing'
              style={styles.canvas}
              className={CANVAS_CLASS + ' ' + '__area'}
              height={`${height}px`}
              width={`${width}px`}
              ref='canvas'
            />
          </div>
        )}
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  const {
    timer,
    showTimer,
    timerDone,
    imageProcessing,
    currentScore,
    leftHand,
    startImageProcessing,
    activeModel,
  } = state;
  return {
    timer,
    showTimer,
    timerDone,
    imageProcessing,
    currentScore,
    leftHand,
    startImageProcessing,
    activeModel,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    setTimer: (payload) => dispatch(setTimer(payload)),
    invokeScore: (payload) => dispatch(invokeScore(payload)),
    setImageProcessing: (payload) => dispatch(setImageProcessing(payload)),
    setTimerDone: (payload) => dispatch(setTimerDone(payload)),
  };
};


export default connect(mapStateToProps, mapDispatchToProps)(Canvas);
