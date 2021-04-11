import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setActiveModel } from '../../../state-manager/actions';

const MODEL_SELECTOR_CLASS = 'model-selector';
const MODEL_SELECTOR_ANATOMY_CLASS = 'model-selector__anatomy';
const MODEL_SELECTOR_STILL_LIFE_CLASS = 'model-selector__still-life';

class ModelSelector extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modelSelectClass: '',
      modelSelectClassRight: ''
    };
    this.modelSelect = React.createRef();

    document.addEventListener('scroll', () => this.trackScrolling());
  }
  componentDidUpdate(prevProps) {
    if (prevProps.leftHand !== this.props.leftHand) {
      if (this.props.leftHand) {
        this.setState({
          modelSelectClassRight: `${MODEL_SELECTOR_CLASS}--right`,
        });
      } else {
        this.setState({
          modelSelectClassRight: '',
        });
      }
    }
    if (prevProps.showTimer !== this.props.showTimer) {
      if (this.props.showTimer) {
        if (this.props.leftHand) {
          this.setState({
            modelSelectClass: `${MODEL_SELECTOR_CLASS}--right-move-right`,
          });
        } else {
          this.setState({
            modelSelectClass: `${MODEL_SELECTOR_CLASS}--move-left`,
          });
        }
      }
    }
    if (prevProps.timerDone !== this.props.timerDone) {
      if (this.props.timerDone) {
        if (this.props.leftHand) {
          this.setState({
            modelSelectClass: `${MODEL_SELECTOR_CLASS}--right-move-left`,
          });
        } else {
          this.setState({
            modelSelectClass: `${MODEL_SELECTOR_CLASS}--move-right`,
          });
        }
      }
    }
  }


  isBottom(el) {
    return el.getBoundingClientRect().bottom <= window.innerHeight;
  }

  trackScrolling = () => {
    const element = document.getElementsByClassName('drawing-model')[0];

    if (
      element &&
      this.isBottom(element) &&
      !this.props.leftHand &&
      this.props.timerDone
    ) {
      this.setState({
        modelSelectClass: `${MODEL_SELECTOR_CLASS}--move-right`,
      });
      document.removeEventListener('scroll', this.trackScrolling);
    }
  };
  setModelToStillLife() {
    this.props.setActiveModel({
      model: 'stillLife',
      isDrawn: false,
    });
  }

  setModelToAnatomy() {
    this.props.setActiveModel({
      model: 'anatomy',
      isDrawn: false,
    });
  }

  render() {
    const {
      height
    } = this.props;

    return (
      <div
        className={`${MODEL_SELECTOR_CLASS} ${this.state.modelSelectClass} ${this.state.modelSelectClassRight}`}
        style={{
          top: `${(height - 236) / 2 - 15}px`,
        }}
      >
        <span
          className={`${MODEL_SELECTOR_ANATOMY_CLASS} ${this.props.activeModel.model === 'anatomy' &&
            `${MODEL_SELECTOR_ANATOMY_CLASS}--active`
            }`}
          onClick={() => {
            this.setModelToAnatomy();
          }}
        />
        <span
          className={`${MODEL_SELECTOR_STILL_LIFE_CLASS} ${this.props.activeModel.model === 'stillLife' &&
          `${MODEL_SELECTOR_STILL_LIFE_CLASS}--active` 
            }`}
          onClick={() => {
            this.setModelToStillLife();
          }}
        />

      </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(ModelSelector);
