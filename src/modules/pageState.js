import { FINISH_LOADING, TOGGLE_IS_IN_DOCUMENT, SET_CURRENT_PAGE } from './actionTypes';

const initialState = {
  isPageLoaded: false,
  isInDocument: false,
  currentPage: '',
};

const pageState = (state = initialState, action) => {
  const { type } = action;
  switch (type) {
    case FINISH_LOADING: {
      return { ...state, isPageLoaded: true };
    }
    case TOGGLE_IS_IN_DOCUMENT: {
      return { ...state, isInDocument: !state.isInDocument };
    }
    case SET_CURRENT_PAGE: {
      const { currentPage } = action.payload;
      return { ...state, currentPage };
    }
    default:
      return state;
  }
};

export default pageState;
