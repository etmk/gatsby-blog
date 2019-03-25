import { combineReducers } from 'redux';
import pages from './pages';
import sideBar from './sideBar';

const reducer = combineReducers({ pages, sideBar });

export default reducer;
