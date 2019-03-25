import { SET_PAGE } from './actionTypes';

const initialState = {
  home: false,
  about: false,
  dev: false,
  til: false,
};

const setPage = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case SET_PAGE:
      return {
        ...initialState,
        ...payload,
      };
    default:
      return state;
  }
};

export default setPage;
