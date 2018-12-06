import React from 'react';
import ReactDOM from 'react-dom';
import RegisterUser from './RegisterUser';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<RegisterUser />, div);
  ReactDOM.unmountComponentAtNode(div);
});
