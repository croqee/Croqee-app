import React from 'react';
import { connect } from 'react-redux';
import {
  setTimer,
  invokeScore,
  setImageProcessing,
  setTimerDone,
  setActiveModel,
} from '../../../js/actions';
import Loader from '../loader/Loader';
import Sizes from 'react-sizes';
import { calcCanvasAndModelDim } from '../../../lib/CalcCanvasAndModelDim';

let styles = {
  canvas: {
    cursor: 'crosshair',
  },
};
class Canvas extends React.Component {
  constructor(props) {
    super(props);
    this.bool = false;
    this.state = {
      baseURL: null,
      fadeOut: false,
      isSizeSet: false,
      width: null,
      height: null,
      imgWidth: null,
      imgHeight: null,
      countDown: 7,
      competeTextHideClass: '',
      moveStartTextClass: '',
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
    if (prevProps.canStartDrawing !== this.props.canStartDrawing) {
      this.setState({
        competeTextHideClass: '--hiden-compete-text',
        moveStartTextClass: '--move-compete-start-text',
      });
    }
    if (prevProps.canJoinClub !== this.props.canJoinClub) {
      this.startCountDown();
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
          width: width,
          height: height,
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
    let lineWidth = (1.7 * this.state.width) / ratio;
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

  retryDrawing() {
    this.props.setActiveModel({
      ...this.props.activeModel,
      isDrawn: false,
    });
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
      this.throttle(this.onMouseMove, 5),
      false
    );

    this.refs.canvas.addEventListener('touchstart', this.onMouseDown, false);

    this.refs.canvas.addEventListener(
      'touchmove',
      this.throttle(this.onTouchMove, 5),
      false
    );

    this.refs.canvas.addEventListener('touchend', this.onMouseUp, false);
  }


  drawLine = (x0, y0, x1, y1, color, emit, force) => {
    if (this.props.canStartDrawing) {
      if (this.props.timerDone) {
        if (this.props.isInHomePage) {
          this.props.setTimer({ showTimer: true, timer: 30 });
          this.props.setTimerDone(false);
        } else {
          this.props.setHasUserDrawnOnCanvas(true);
        }
        this.setState({
          fadeOut: true,
        });
      }
    }
    let context = this.state.canvas.getContext('2d');
    context.beginPath();
    context.moveTo(x0, y0);
    context.lineTo(x1, y1);
    context.strokeStyle = color;
    context.lineWidth = this.state.lineWidth;
    if (force) {
      context.lineWidth = this.state.lineWidth * (force * (force + 3.75));
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
    }, this.drawLine(this.state.currentX - this.refs.canvas.getBoundingClientRect().left, this.state.currentY - this.refs.canvas.getBoundingClientRect().top, e.clientX - this.refs.canvas.getBoundingClientRect().left, e.clientY - this.refs.canvas.getBoundingClientRect().top, this.state.currentColor, true));
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

  throttle = (callback, delay) => {
    let previousCall = new Date().getTime();
    return function () {
      let time = new Date().getTime();

      if (time - previousCall >= delay) {
        previousCall = time;
        callback.apply(null, arguments);
      }
    };
  };

  render() {
    const {
      fadeOut,
      width,
      height,
      imgWidth,
      imgHeight,
      isSizeSet,
      countDown,
      competeTextHideClass,
      moveStartTextClass,
    } = this.state;
    const { isCompeting } = this.props;
    let side = this.props.leftHand ? 'canvas_left_hand' : '';
    console.log(width);
    return (
      <React.Fragment>
        {isSizeSet && (
          <div
            className={'canvas ' + side}
            width={`${width}px`}
            height={`${height}px`}
          >
            {this.props.imageProcessing && 
            <Loader 
            />}

            <div
              className={
                fadeOut
                  ? 'canvas__overay canvas__overay--fadeout'
                  : 'canvas__overay canvas__overay--fadein '
              }
              style={{
                width: `${width}px`,
                height: `${height}px`,
                marginBottom: `-${height}px`,
              }}
            >
              {!isCompeting && (
                <span
                  className='canvas__overay__homepage-text'
                  style={{
                    top: `${height / 2 - 40}px`,
                  }}
                >
                  Draw the model here
                </span>
              )}
              {isCompeting && (
                <div
                  className='canvas__overay__compete-text'
                  style={{
                    top: `${height / 2 - 40}px`,
                  }}
                >
                  <div className='canvas__overay__compete-text__first-line'>
                    <span
                      className={
                        'canvas__overay__compete-text__first-line__start ' +
                        moveStartTextClass
                      }
                    >
                      Start
                    </span>
                    <span
                      className={
                        'canvas__overay__compete-text__first-line__text ' +
                        competeTextHideClass
                      }
                    >
                      {' '}
                      drawing the model
                    </span>
                  </div>
                  <div className={'canvas__overay__compete-text__second-line '}>
                    <span
                      className={
                        'canvas__overay__compete-text__second-line__text ' +
                        competeTextHideClass
                      }
                    >
                      here in{' '}
                    </span>
                    <span
                      className={
                        'canvas__overay__compete-text__second-line__text --counter ' +
                        competeTextHideClass
                      }
                    >
                      {countDown}
                    </span>
                    <span
                      className={
                        'canvas__overay__compete-text__second-line__text ' +
                        competeTextHideClass
                      }
                    >
                      {' '}
                      seconds
                    </span>
                  </div>
                </div>
              )}
            </div>
            {this.props.activeModel.isDrawn && !isCompeting && (
              <div
                className={
                  !this.props.activeModel.isDrawn
                    ? 'canvas__blocker canvas__blocker--fadeout'
                    : 'canvas__blocker canvas__blocker--fadein '
                }
                style={{
                  width: `${width}px`,
                  height: `${height}px`,
                  marginBottom: `-${height}px`,
                  paddingTop: `${height / 2 - 100}px`,
                }}
              >
                <button
                  onClick={() => this.props.navigateToClubPage()}
                  className='canvas__blocker__compete-button'
                >
                  Draw more models and compete
                </button>

                <h3> OR </h3>

                <button
                  onClick={() => this.retryDrawing()}
                  className='canvas__blocker__retry-button'
                >
                  Retry
                </button>
              </div>
            )}
            <span
              id='userScore'
              className={'userscore ' + this.props.scoreClass}
              style={{
                width: `${width}px`,
                height: `${height}px`,
                marginBottom: `-${height}px`,
              }}
            >
              {this.props.baseURL ? (
                <React.Fragment>
                  <img
                    alt='alt'
                    className='userscore__drawing'
                    style={{
                      width: `${width}px`,
                      height: `${height}px`,
                      marginBottom: `-${height}px`,
                    }}
                    src={this.props.baseURL}
                  />

                  {this.props.isInHomePage ? (
                    this.props.activeModel.model === 'stillLife' ? (
                      <img
                        alt='alt'
                        className='userscore__model'
                        style={{
                          width: `${imgWidth}px`,
                          height: `${imgHeight}px`,
                        }}
                        src={require('../../../img/compete/still-life/geometrical5.png')}
                      />
                    ) : (
                        <img
                          alt='alt'
                          className='userscore__model'
                          style={{
                            width: `${imgWidth}px`,
                            height: `${imgHeight}px`,
                          }}
                          src={require('../../../img/compete/anatomy/female1.png')}
                        />
                      )
                  ) : (
                      <React.Fragment>
                        {this.props.model.model && (
                          <img
                            alt='alt'
                            className='userscore__model'
                            style={{
                              width: `${imgWidth}px`,
                              height: `${imgHeight}px`,
                            }}
                            src={require(`../../../img${this.props.imgPath}${this.props.model.model}.png`)}
                          />
                        )}
                      </React.Fragment>
                    )}
                  <span className='userscore_score'>
                    Score:
                    <span className='userscore_score_score'>
                      {' '}
                      {this.props.currentScore && this.props.currentScore}
                    </span>
                  </span>
                </React.Fragment>
              ) : (
                  <span
                    style={{
                      position: 'absolute',
                      width: '400px',
                      textAlign: 'center',
                      top: `${height / 2 - 50}px`,
                      left: `${width / 2 - 200}px`,
                      color: 'white',
                      fontSize: '28px',
                    }}
                  >
                    Nothing was drawn on the canvas
                  </span>
                )}
            </span>
            <canvas
              id='canvas__drawing'
              style={styles.canvas}
              className='canvas__canvas'
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
    scoreClass,
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
    scoreClass,
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
    setActiveModel: (payload) => dispatch(setActiveModel(payload)),
  };
};
const mapSizesToProps = ({ width }) => ({
  isMobile: width < 768,
});

const first = connect(mapStateToProps, mapDispatchToProps)(Canvas);
export default Sizes(mapSizesToProps)(first);