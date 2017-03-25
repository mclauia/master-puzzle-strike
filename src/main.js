import React from 'react';
import { render } from 'react-dom';

import { Provider } from 'react-redux';

import { createBrowserHistory } from 'history';
import { Router, Route } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'

import configureStore from './config/store';
import { onGamesUpdate, onSeriesUpdate } from './config/firebase';
import { newRecords, newSerieses } from './actions';

import App from './components/app';

const MAIN_ROOT = document.getElementById('main');

const store = configureStore();
const history = syncHistoryWithStore(createBrowserHistory(), store)

render(
  <Provider store={store}>
    <Router history={history}>
      <Route path="/*" component={App}/>
    </Router>
  </Provider>,
  MAIN_ROOT
);

onGamesUpdate((records) => {
  store.dispatch(newRecords(records))
})

onSeriesUpdate((serieses) => {
  store.dispatch(newSerieses(serieses))
})
