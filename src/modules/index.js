import { combineReducers } from 'redux';
import sideBar from './sideBar';
import pageState from './pageState';

const reducer = combineReducers({ sideBar, pageState });

export default reducer;
