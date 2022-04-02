// const { ipc } = window.electron;

const SET_KEY = 'SET_KEY';
const RESET_KEY = 'RESET_KEY';

// ACTION CREATORS

export const setKey = (key: string) => {
  return {
    type: SET_KEY,
    key,
  };
};

export const resetKey = () => {
  return {
    type: RESET_KEY,
  };
};
