import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import CanvasPage from './components/canvas/CanvasPage';
import { configure ,shallow, mount, render  } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});

describe('App', () => {
  it('renders correctly with canvas', () => {
    const div = document.createElement('div');
    const wrapper = render(<App />,div);
    expect(wrapper.find('.canvas').length).toBe(1);
  });
});