import { OPEN_SIDE_BAR, CLOSE_SIDE_BAR } from './actionTypes';

const initialState = {
  isOpened: false,
};

const setSideBar = (state = initialState, action) => {
  const { type } = action;
  switch (type) {
    case OPEN_SIDE_BAR:
      return { ...state, isOpened: true };
    case CLOSE_SIDE_BAR:
      return { ...state, isOpened: false };
    default:
      return state;
  }
};

export default setSideBar;
