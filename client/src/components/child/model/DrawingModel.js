import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setActiveModel } from '../../../js/actions';
import ModelSelector from './ModelSelector';
import UserScoreOverview from './UserScoreOverview';

let styles = {
  model: {},
};

class DrawingModel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSizeSet: false,
      width: null,
      height: null,
      imgWidth: null,
      imgHeight: null,
      usersScoreFadeClass: '',
    };
    this.modelSelect = React.createRef();

    window.addEventListener('resize', () => {
      this.setModelSize();
    });
  }

  componentDidMount() {
    this.setModelSize();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.showUserScores !== this.props.showUserScores) {
      if (this.props.showUserScores) {
       this.displayConcurrentUsersScores();
      }
    }
  }

  displayConcurrentUsersScores(){
    this.setState(
      {
        usersScoreFadeClass: 'users-scores--fadein',
      },
      () => {
        setTimeout(() => {
          this.setState({
            usersScoreFadeClass: 'users-scores--fadeout',
          });
        }, 7500);
      }
    );
  }
 
  setModelSize() {
    const screenSize =
      document.documentElement.clientWidth ||
      document.body.clientWidth ||
      window.innerWidth;
    let width;
    let height;
    if (screenSize <= 900) {
      width = screenSize;
      height = window.innerHeight / 2;
    } else {
      width = Math.floor(screenSize / 2);
      height = window.innerHeight;
      styles.model = {
        ...styles.model,
        marginLeft: '0',
      };
    }
    const imgRatio = 800 / 800;
    let imgWidth;
    let imgHeight;
    if (width / height <= imgRatio) {
      imgWidth = width;
      imgHeight = imgWidth / imgRatio;
    } else {
      imgHeight = height;
      imgWidth = imgHeight * imgRatio;
    }

    this.setState({ isSizeSet: false }, () => {
      this.setState({
        width,
        height,
        imgWidth,
        imgHeight,
        isSizeSet: true,
      });
    });
  }


  render() {
    const {
      width,
      height,
      isSizeSet,
      usersScoreFadeClass,
      imgWidth,
      imgHeight,
    } = this.state;
    const {
      model,
      compete,
      showUserScores,
      playingUsers,
      user,
    } = this.props;

    return (
      <React.Fragment>
        {isSizeSet && (
          <div
            className='model-wrapper'
            style={{
              ...styles.model,
              width: `${width}px`,
              height: `${height}px`,
              zIndex: '3',
              overflow: 'hidden',
            }}
          >
            {compete ? (
              <React.Fragment>
                {model.model && (
                  <img
                    alt=''
                    src={require(`../../../img${this.props.imgPath}${model.model}.png`)}
                    width={`${imgWidth}px`}
                    height={`${imgHeight}px`}
                    className={'drawing-model ' + this.props.side}
                  />
                )}
                {showUserScores && (
                  <UserScoreOverview
                    usersScoreFadeClass={usersScoreFadeClass}
                    styles={styles}
                    width={width}
                    height={height}
                    playingUsers={playingUsers}
                    user={user}
                  />
                )}
              </React.Fragment>
            ) : (
                <React.Fragment>
                  <ModelSelector height= {height}/>
                  {this.props.activeModel &&
                    this.props.activeModel.model === 'stillLife' ? (
                      <img
                        alt=''
                        src={require('../../../img/compete/still-life/geometrical5.png')}
                        width={`${imgWidth}px`}
                        height={`${imgHeight}px`}
                        className={'drawing-model ' + this.props.side}
                      />
                    ) : (
                      <img
                        alt=''
                        src={require('../../../img/compete/anatomy/female1.png')}
                        width={`${imgWidth}px`}
                        height={`${imgHeight}px`}
                        className={'drawing-model ' + this.props.side}
                      />
                    )}
                  {showUserScores && (
                    <UserScoreOverview
                      usersScoreFadeClass={usersScoreFadeClass}
                      styles={styles}
                      width={width}
                      height={height}
                      playingUsers={playingUsers}
                      user={user}
                    />
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
  const { showTimer, timerDone, leftHand, activeModel } = state;
  return { showTimer, timerDone, leftHand, activeModel };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setActiveModel: (payload) => dispatch(setActiveModel(payload)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DrawingModel);
