import React from 'react';
import ReactDOM from 'react-dom';
import MaterialUIAutocomplete from './MaterialUIAutocomplete';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<MaterialUIAutocomplete />, div);
  ReactDOM.unmountComponentAtNode(div);
});
