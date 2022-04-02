// ACTION TYPES

const SET_KEY = 'SET_KEY';
const RESET_KEY = 'RESET_KEY';

// REDUCER
export default function keyReducer(key: any = null, action: any) {
  switch (action.type) {
    case SET_KEY:
      return action.key;
    case RESET_KEY:
      return null;
    default:
      return key;
  }
}
