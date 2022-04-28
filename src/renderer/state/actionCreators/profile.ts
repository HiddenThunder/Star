const SET_PROFILE = 'SET_PROFILE';

// ACTION CREATORS

export const setProfile = (profile: any) => {
  return {
    type: SET_PROFILE,
    profile,
  };
};
