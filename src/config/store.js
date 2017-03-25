import { createStore, applyMiddleware, combineReducers } from 'redux';
import logger from 'redux-logger'
import thunkMiddleware from 'redux-thunk';
import appReducer from '../reducers/app';
import statsReducer from '../reducers/stats';
import { routerReducer } from 'react-router-redux'

const rootReducer = combineReducers({
  app: appReducer,
  stats: statsReducer,
  routing: routerReducer
});


export default function configureStore(initialState = {}) {
  return applyMiddleware(thunkMiddleware, logger)(createStore)(rootReducer, initialState);
}
