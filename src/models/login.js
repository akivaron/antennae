import { routerRedux } from 'dva/router';
import { accountLogin } from '@/services/user';
import { setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';
import { reloadAuthorized } from '@/utils/Authorized';

export default {
  namespace: 'login',

  state: {
    status: undefined,
  },

  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(accountLogin, payload);
      yield put({
        type: 'changeLoginStatus',
        payload: response,
      });
      // Login successfully
      if (response && response.status === 'ok') {
        reloadAuthorized();
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params;
        if (redirect) {
          const redirectUrlParams = new URL(redirect);
          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);
            if (redirect.startsWith('/#')) {
              redirect = redirect.substr(2);
            }
          } else {
            window.location.href = redirect;
            return;
          }
        }
        yield put(routerRedux.replace(redirect || '/'));
      }
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      if(payload){
        setAuthority(payload.currentAuthority);
        return {
          ...state,
          status: ({}).hasOwnProperty.call(payload,'status') ? payload.status : '',
          type: ({}).hasOwnProperty.call(payload,'type') ? payload.type : '',
          data: ({}).hasOwnProperty.call(payload,'data') ? payload.data : '',
        };
      }
      return {
        ...state,
        status:  '',
        type: '',
        data: '',
      };
    },
  },
};
