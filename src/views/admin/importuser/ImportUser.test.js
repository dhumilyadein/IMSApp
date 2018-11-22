import React from 'react';
import ReactDOM from 'react-dom';
import ImportUser from './RegisterUser';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<ImportUser />, div);
  ReactDOM.unmountComponentAtNode(div);
});
