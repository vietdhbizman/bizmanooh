import * as actionTypes from './actionTypes';

export const onSetup = (domain,domain2, user, callback) => {
  return {
    type: actionTypes.SETUP_CONFIG,
    domain,
    domain2,
    user,
    callback,
  };
};
