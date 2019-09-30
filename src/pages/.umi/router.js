import React from 'react';
import { Router as DefaultRouter, Route, Switch } from 'react-router-dom';
import dynamic from 'umi/dynamic';
import renderRoutes from 'umi/_renderRoutes';
import RendererWrapper0 from 'C:/xampp/htdocs/skripsi_frontend/src/pages/.umi/LocaleWrapper.jsx'
import _dvaDynamic from 'dva/dynamic'

let Router = require('dva/router').routerRedux.ConnectedRouter;

let routes = [
  {
    "name": "exception",
    "icon": "warning",
    "path": "/exception",
    "hideInMenu": true,
    "routes": [
      {
        "path": "/exception/403",
        "name": "not-permission",
        "component": _dvaDynamic({
  app: window.g_app,
models: () => [
  import('C:/xampp/htdocs/skripsi_frontend/src/pages/Exception/models/error.js').then(m => { return { namespace: 'error',...m.default}})
],
  component: () => import('../Exception/403'),
  LoadingComponent: require('C:/xampp/htdocs/skripsi_frontend/src/components/PageLoading/index').default,
}),
        "exact": true
      },
      {
        "path": "/exception/404",
        "name": "not-find",
        "component": _dvaDynamic({
  app: window.g_app,
models: () => [
  import('C:/xampp/htdocs/skripsi_frontend/src/pages/Exception/models/error.js').then(m => { return { namespace: 'error',...m.default}})
],
  component: () => import('../Exception/404'),
  LoadingComponent: require('C:/xampp/htdocs/skripsi_frontend/src/components/PageLoading/index').default,
}),
        "exact": true
      },
      {
        "path": "/exception/500",
        "name": "server-error",
        "component": _dvaDynamic({
  app: window.g_app,
models: () => [
  import('C:/xampp/htdocs/skripsi_frontend/src/pages/Exception/models/error.js').then(m => { return { namespace: 'error',...m.default}})
],
  component: () => import('../Exception/500'),
  LoadingComponent: require('C:/xampp/htdocs/skripsi_frontend/src/components/PageLoading/index').default,
}),
        "exact": true
      },
      {
        "path": "/exception/trigger",
        "name": "trigger",
        "hideInMenu": true,
        "component": _dvaDynamic({
  app: window.g_app,
models: () => [
  import('C:/xampp/htdocs/skripsi_frontend/src/pages/Exception/models/error.js').then(m => { return { namespace: 'error',...m.default}})
],
  component: () => import('../Exception/TriggerException'),
  LoadingComponent: require('C:/xampp/htdocs/skripsi_frontend/src/components/PageLoading/index').default,
}),
        "exact": true
      },
      {
        "component": () => React.createElement(require('C:/xampp/htdocs/skripsi_frontend/node_modules/umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true })
      }
    ]
  },
  {
    "path": "/user",
    "component": _dvaDynamic({
  
  component: () => import('../../layouts/Guest/Home'),
  LoadingComponent: require('C:/xampp/htdocs/skripsi_frontend/src/components/PageLoading/index').default,
}),
    "Routes": [require('../NonAuthorized').default],
    "authority": [
      "guest"
    ],
    "routes": [
      {
        "path": "/user",
        "redirect": "/user/login",
        "exact": true
      },
      {
        "path": "/user/login",
        "component": _dvaDynamic({
  app: window.g_app,
models: () => [
  import('C:/xampp/htdocs/skripsi_frontend/src/pages/User/models/register.js').then(m => { return { namespace: 'register',...m.default}})
],
  component: () => import('../User/Login'),
  LoadingComponent: require('C:/xampp/htdocs/skripsi_frontend/src/components/PageLoading/index').default,
}),
        "exact": true
      },
      {
        "path": "/user/register",
        "component": _dvaDynamic({
  app: window.g_app,
models: () => [
  import('C:/xampp/htdocs/skripsi_frontend/src/pages/User/models/register.js').then(m => { return { namespace: 'register',...m.default}})
],
  component: () => import('../User/Register'),
  LoadingComponent: require('C:/xampp/htdocs/skripsi_frontend/src/components/PageLoading/index').default,
}),
        "exact": true
      },
      {
        "component": () => React.createElement(require('C:/xampp/htdocs/skripsi_frontend/node_modules/umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true })
      }
    ]
  },
  {
    "path": "/page",
    "component": _dvaDynamic({
  
  component: () => import('../../layouts/Guest/Home'),
  LoadingComponent: require('C:/xampp/htdocs/skripsi_frontend/src/components/PageLoading/index').default,
}),
    "routes": [
      {
        "path": "/",
        "redirect": "/user/login",
        "exact": true
      },
      {
        "path": "/page/videos",
        "component": _dvaDynamic({
  
  component: () => import('../Videos/List'),
  LoadingComponent: require('C:/xampp/htdocs/skripsi_frontend/src/components/PageLoading/index').default,
}),
        "exact": true
      },
      {
        "path": "/page/how-to-use",
        "component": _dvaDynamic({
  
  component: () => import('../HowToUse/List'),
  LoadingComponent: require('C:/xampp/htdocs/skripsi_frontend/src/components/PageLoading/index').default,
}),
        "exact": true
      },
      {
        "component": () => React.createElement(require('C:/xampp/htdocs/skripsi_frontend/node_modules/umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true })
      }
    ]
  },
  {
    "path": "/",
    "component": _dvaDynamic({
  
  component: () => import('../../layouts/BasicLayout'),
  LoadingComponent: require('C:/xampp/htdocs/skripsi_frontend/src/components/PageLoading/index').default,
}),
    "Routes": [require('../Authorized').default],
    "authority": [
      "admin",
      "user"
    ],
    "routes": [
      {
        "path": "/",
        "redirect": "/dashboard/workspace",
        "exact": true
      },
      {
        "path": "/dashboard",
        "name": "dashboard",
        "icon": "dashboard",
        "routes": [
          {
            "path": "/dashboard/workspace",
            "name": "workspace",
            "component": _dvaDynamic({
  
  component: () => import('../Dashboard/Workspace'),
  LoadingComponent: require('C:/xampp/htdocs/skripsi_frontend/src/components/PageLoading/index').default,
}),
            "exact": true
          },
          {
            "path": "/dashboard/profile",
            "name": "profile",
            "component": _dvaDynamic({
  
  component: () => import('../Profile/Edit'),
  LoadingComponent: require('C:/xampp/htdocs/skripsi_frontend/src/components/PageLoading/index').default,
}),
            "exact": true
          },
          {
            "path": "/dashboard/videos",
            "component": _dvaDynamic({
  
  component: () => import('../Videos/List'),
  LoadingComponent: require('C:/xampp/htdocs/skripsi_frontend/src/components/PageLoading/index').default,
}),
            "exact": true
          },
          {
            "path": "/dashboard/how-to-use",
            "component": _dvaDynamic({
  
  component: () => import('../HowToUse/List'),
  LoadingComponent: require('C:/xampp/htdocs/skripsi_frontend/src/components/PageLoading/index').default,
}),
            "exact": true
          },
          {
            "path": "/dashboard/password",
            "name": "password",
            "component": _dvaDynamic({
  
  component: () => import('../Password/Edit'),
  LoadingComponent: require('C:/xampp/htdocs/skripsi_frontend/src/components/PageLoading/index').default,
}),
            "exact": true
          },
          {
            "component": () => React.createElement(require('C:/xampp/htdocs/skripsi_frontend/node_modules/umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true })
          }
        ]
      },
      {
        "component": () => React.createElement(require('C:/xampp/htdocs/skripsi_frontend/node_modules/umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true })
      }
    ]
  },
  {
    "component": _dvaDynamic({
  app: window.g_app,
models: () => [
  import('C:/xampp/htdocs/skripsi_frontend/src/pages/Exception/models/error.js').then(m => { return { namespace: 'error',...m.default}})
],
  component: () => import('../Exception/404'),
  LoadingComponent: require('C:/xampp/htdocs/skripsi_frontend/src/components/PageLoading/index').default,
}),
    "exact": true
  },
  {
    "component": () => React.createElement(require('C:/xampp/htdocs/skripsi_frontend/node_modules/umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true })
  }
];
window.g_routes = routes;
window.g_plugins.applyForEach('patchRoutes', { initialValue: routes });

// route change handler
function routeChangeHandler(location, action) {
  window.g_plugins.applyForEach('onRouteChange', {
    initialValue: {
      routes,
      location,
      action,
    },
  });
}
window.g_history.listen(routeChangeHandler);
routeChangeHandler(window.g_history.location);

export default function RouterWrapper() {
  return (
<RendererWrapper0>
          <Router history={window.g_history}>
      { renderRoutes(routes, {}) }
    </Router>
        </RendererWrapper0>
  );
}
