export default [
  {
    name: 'exception',
    icon: 'warning',
    path: '/exception',
    hideInMenu: true,
    routes: [
      // exception
      {
        path: '/exception/403',
        name: 'not-permission',
        component: './Exception/403',
      },
      {
        path: '/exception/404',
        name: 'not-find',
        component: './Exception/404',
      },
      {
        path: '/exception/500',
        name: 'server-error',
        component: './Exception/500',
      },
      {
        path: '/exception/trigger',
        name: 'trigger',
        hideInMenu: true,
        component: './Exception/TriggerException',
      },
    ],
  },
  // user
  {
    path: '/user',
    component: '../layouts/Guest/Home',
    Routes: ['src/pages/NonAuthorized'],
    authority: ['guest'],
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', component: './User/Login' },
      { path: '/user/register', component: './User/Register' },
    ],
  },
  {
    path: '/page',
    component: '../layouts/Guest/Home',
    routes: [
      { path: '/', redirect: '/user/login' },
      { path: '/page/videos', component: './Videos/List' },
      { path: '/page/how-to-use', component: './HowToUse/List' },
    ],
  },
  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    authority: ['admin', 'user'],
    routes: [
      // dashboard
      { path: '/', redirect: '/dashboard/workspace' },
      {
        path: '/dashboard',
        name: 'dashboard',
        icon: 'dashboard',
        routes: [
          {
            path: '/dashboard/workspace',
            name: 'workspace',
            component: './Dashboard/Workspace',
          },
          {
            path: '/dashboard/profile',
            name: 'profile',
            component: './Profile/Edit',
          },

          { path: '/dashboard/videos', component: './Videos/List' },
          { path: '/dashboard/how-to-use', component: './HowToUse/List' },
          {
            path: '/dashboard/password',
            name: 'password',
            component: './Password/Edit',
          },
        ],
      },
    ],
  },
  {
    component: './Exception/404',
  },
];
