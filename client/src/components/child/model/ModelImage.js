import React, { Component } from 'react';
import { connect } from 'react-redux';

const MODEL_IMAGE_CLASS = 'model-image';

class ModelImage extends Component {

  render() {
    const {
      innerModelWidth,
      innerModelHeight,
      imgPath,
      description,
      leftHand
    } = this.props;
    const side = leftHand ? "model_left_hand" : "";
    
    return (
      <img
        alt={description}
        src={require(imgPath)}
        style={{
          width: `${innerModelWidth}px`,
          height: `${innerModelHeight}px`,
        }}
        className={MODEL_IMAGE_CLASS + ' ' + side}
      />
    )
  }
}
const mapStateToProps = (state) => {
  const {
    innerModelWidth,
    innerModelHeight,
    leftHand
  } = state;
  return {
    innerModelWidth,
    innerModelHeight,
    leftHand
  };
};

export default connect(mapStateToProps, {})(ModelImage);
