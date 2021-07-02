import React, { Component } from 'react';
import { connect } from 'react-redux';
import ModelSelector from './ModelSelector';
import UserScoreOverview from './UsersScores';
import ModelImage from './ModelImage';
const DRAWING_MODEL_CLASS = 'drawing-model';
const DRAWING_MODEL_DESCRIPTION = 'drawing model image';
class DrawingModel extends Component {

  render() {
    const {
      model,
      compete,
      showUserScores,
      playingUsers,
      user,
      canvasWidth,
      canvasHeight,
      activeModel,
      imgPath
    } = this.props;

    return (
      <React.Fragment>
        {canvasWidth && (
          <div
            className={DRAWING_MODEL_CLASS}
            style={{
              width: `${canvasWidth}px`,
              height: `${canvasHeight}px`,
            }}
          >
            {compete ? (
              <React.Fragment>
                {model.model && (
                  <ModelImage
                    model={model}
                    imgPath={require(`../../../img${imgPath}${model.model}.png`)}
                    description={DRAWING_MODEL_DESCRIPTION} />
                )}
                {showUserScores && (
                  <UserScoreOverview
                    width={canvasWidth}
                    height={canvasHeight}
                    playingUsers={playingUsers}
                    user={user}
                  />
                )}
              </React.Fragment>
            ) : (
                <React.Fragment>
                  <ModelSelector height={canvasHeight} />
                  {activeModel &&
                    activeModel.model === 'stillLife' ? (
                      <ModelImage
                        model={model}
                        imgPath={require('../../../img/compete/still-life/geometrical5.png')}
                        description={DRAWING_MODEL_DESCRIPTION} />
                    ) : (
                      <ModelImage
                        model={model}
                        imgPath={require('../../../img/compete/anatomy/female1.png')}
                        description={DRAWING_MODEL_DESCRIPTION} />
                    )}
                </React.Fragment>
              )}
          </div>
        )}
      </React.Fragment>
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

export default connect(mapStateToProps, {})(DrawingModel);