// import 'babel-polyfill'

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider,Router } from 'react-redux';
import thunk from 'redux-thunk'; 
import { createStore,combineReducers, applyMiddleware  } from 'redux';

import Routers from './Router'
import * as reducers from './reducer/'

import './index.css'; 

import createHistory from 'history/createBrowserHistory'

const history = createHistory()

const store = createStore(
  combineReducers({
    ...reducers,
  }),
  applyMiddleware(thunk)
)

ReactDOM.render(
  <Provider store={store}>
    <Routers history={history} />
  </Provider>,
  document.getElementById('root')
);
