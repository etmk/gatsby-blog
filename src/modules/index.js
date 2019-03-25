import { combineReducers } from 'redux';
import pages from './pages';
import sideBar from './sideBar';
import isPageLoaded from './isPageLoaded';

const reducer = combineReducers({ pages, sideBar, isPageLoaded });

export default reducer;
