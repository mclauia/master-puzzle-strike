import React from 'react';
import { render } from 'react-dom';
import App from './components/app';

import { createBrowserHistory } from 'history';
import { Router, Route } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'

import configureStore from './store';

import { Provider } from 'react-redux';

import { onGamesUpdate, onSeriesUpdate } from './firebase';

import { newRecords, newSerieses } from './actions';

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
