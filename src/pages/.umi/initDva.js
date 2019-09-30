import dva from 'dva';
import createLoading from 'dva-loading';

const runtimeDva = window.g_plugins.mergeConfig('dva');
let app = dva({
  history: window.g_history,
  
  ...(runtimeDva.config || {}),
});

window.g_app = app;
app.use(createLoading());
(runtimeDva.plugins || []).forEach(plugin => {
  app.use(plugin);
});

app.model({ namespace: 'compiler', ...(require('C:/xampp/htdocs/skripsi_frontend/src/models/compiler.js').default) });
app.model({ namespace: 'global', ...(require('C:/xampp/htdocs/skripsi_frontend/src/models/global.js').default) });
app.model({ namespace: 'login', ...(require('C:/xampp/htdocs/skripsi_frontend/src/models/login.js').default) });
app.model({ namespace: 'public', ...(require('C:/xampp/htdocs/skripsi_frontend/src/models/public.js').default) });
app.model({ namespace: 'setting', ...(require('C:/xampp/htdocs/skripsi_frontend/src/models/setting.js').default) });
app.model({ namespace: 'user', ...(require('C:/xampp/htdocs/skripsi_frontend/src/models/user.js').default) });
