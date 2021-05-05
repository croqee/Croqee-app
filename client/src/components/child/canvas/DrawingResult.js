import React from 'react';
import { connect } from 'react-redux';

const DRAWING_RESULT_CLASS = 'drawing-result';

class DrawingResult extends React.Component {

  render() {
    const {
      canvasWidth,
      canvasHeight,
      innerModelWidth,
      innerModelHeight,
    } = this.props;
    return (
      <span
        id='userScore'
        className={DRAWING_RESULT_CLASS + ' ' + this.props.scoreClass}
        style={{
          width: `${canvasWidth}px`,
          height: `${canvasHeight}px`,
          marginBottom: `-${canvasHeight}px`,
        }}
      >
        {this.props.baseURL ? (
          <React.Fragment>
            <img
              alt='alt'
              className={DRAWING_RESULT_CLASS + '__drawing'}
              style={{
                width: `${canvasWidth}px`,
                height: `${canvasHeight}px`,
                marginBottom: `-${canvasHeight}px`,
              }}
              src={this.props.baseURL}
            />

            {this.props.isInHomePage ? (
              this.props.activeModel.model === 'stillLife' ? (
                <img
                  alt='alt'
                  className={DRAWING_RESULT_CLASS + '__model'}
                  style={{
                    width: `${innerModelWidth}px`,
                    height: `${innerModelHeight}px`,
                  }}
                  src={require('../../../img/compete/still-life/geometrical5.png')}
                />
              ) : (
                  <img
                    alt='alt'
                    className={DRAWING_RESULT_CLASS + '__model'}
                    style={{
                      width: `${innerModelWidth}px`,
                      height: `${innerModelHeight}px`,
                    }}
                    src={require('../../../img/compete/anatomy/female1.png')}
                  />
                )
            ) : (
                <React.Fragment>
                  {this.props.model.model && (
                    <img
                      alt='alt'
                      className={DRAWING_RESULT_CLASS + '__model'}
                      style={{
                        width: `${innerModelWidth}px`,
                        height: `${innerModelHeight}px`,
                      }}
                      src={require(`../../../img${this.props.imgPath}${this.props.model.model}.png`)}
                    />
                  )}
                </React.Fragment>
              )}
            <span className={DRAWING_RESULT_CLASS + '__score'}>
              Score:
                    <span className={DRAWING_RESULT_CLASS + '__score-number'}>
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
                top: `${canvasHeight / 2 - 50}px`,
                left: `${canvasWidth / 2 - 200}px`,
                color: 'white',
                fontSize: '28px',
              }}
            >
              Nothing was drawn on the canvas
            </span>
          )}
      </span>
    )
  }
}

const mapStateToProps = (state) => {
  const {
    currentScore,
    scoreClass,
    leftHand,
    activeModel,
    canvasWidth,
    canvasHeight,
    innerModelWidth,
    innerModelHeight
  } = state;
  return {
    currentScore,
    scoreClass,
    leftHand,
    activeModel,
    canvasWidth,
    canvasHeight,
    innerModelWidth,
    innerModelHeight
  };
};
const mapDispatchToProps = () => { };

export default connect(mapStateToProps, mapDispatchToProps)(DrawingResult);
