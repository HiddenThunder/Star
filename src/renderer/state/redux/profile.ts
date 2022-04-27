// ACTION TYPES

const SET_PROFILE = 'SET_PROFILE';

// REDUCER
export default function profileReducer(profile: any = {}, action: any) {
  switch (action.type) {
    case SET_PROFILE:
      return action.profile;
    default:
      return profile;
  }
}
