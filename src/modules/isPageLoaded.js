import { FINISH_LOADING } from './actionTypes';

const initialState = {
  isPageLoaded: false,
};

const isPageLoaded = (state = initialState, action) => {
  const { type } = action;
  switch (type) {
    case FINISH_LOADING:
      return { isPageLoaded: true };
    default:
      return state;
  }
};

export default isPageLoaded;
