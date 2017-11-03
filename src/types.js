// @flow

export type UserType = {
  username: string,
  password: string
};

// eslint-plugin-flowtype is supposed to fix this!
// eslint-disable-next-line no-undef
export type UserMapType = {
  [username: string]: UserType
};
