import { createStore, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import reducer from '../modules';

const logger = createLogger();
const store = createStore(reducer, applyMiddleware(logger));

export default store;
