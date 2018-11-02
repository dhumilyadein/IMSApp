import React from 'react';
import ReactDOM from 'react-dom';
import SearchUser from './SearchUser';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<SearchUser />, div);
  ReactDOM.unmountComponentAtNode(div);
});
