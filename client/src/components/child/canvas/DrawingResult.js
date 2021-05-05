import React from 'react';
import { connect } from 'react-redux';

const DRAWING_RESULT_CLASS = 'drawing-result';

class DrawingResult extends React.Component {

  render() {
    const {
      width,
      height,
      imgWidth,
      imgHeight,
    } = this.props;
    return (
      <span
        id='userScore'
        className={DRAWING_RESULT_CLASS + ' ' + this.props.scoreClass}
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
              className={DRAWING_RESULT_CLASS + '__drawing'}
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
                  className={DRAWING_RESULT_CLASS + '__model'}
                  style={{
                    width: `${imgWidth}px`,
                    height: `${imgHeight}px`,
                  }}
                  src={require('../../../img/compete/still-life/geometrical5.png')}
                />
              ) : (
                  <img
                    alt='alt'
                    className={DRAWING_RESULT_CLASS + '__model'}
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
                      className={DRAWING_RESULT_CLASS + '__model'}
                      style={{
                        width: `${imgWidth}px`,
                        height: `${imgHeight}px`,
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
    )
  }
}

const mapStateToProps = (state) => {
  const {
    currentScore,
    scoreClass,
    leftHand,
    activeModel,
  } = state;
  return {
    currentScore,
    scoreClass,
    leftHand,
    activeModel,
  };
};
const mapDispatchToProps = () => {
  return {
  };
};


export default connect(mapStateToProps, mapDispatchToProps)(DrawingResult);
