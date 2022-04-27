const SET_PROFILE = 'SET_PEERS';

// ACTION CREATORS

export const setProfile = (profile: any) => {
  return {
    type: SET_PROFILE,
    profile,
  };
};
