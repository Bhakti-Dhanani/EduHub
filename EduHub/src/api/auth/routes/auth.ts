'use strict';

module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/auth/local/register',
      handler: 'auth.register',
      config: {
        auth: false,
      },
    },
    {
      method: 'POST',
      path: '/auth/local',
      handler: 'auth.callback',
      config: {
        auth: false,
      },
    },
    {
      method: 'GET',
      path: '/users/me',
      handler: 'auth.getUser',
      config: {
        policies: [],
      },
    },
    {
      method: 'GET',
      path: '/users',
      handler: 'auth.listUsers',
      config: {
        policies: [],
      },
    },
  ],
};
