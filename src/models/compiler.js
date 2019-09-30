import { rextester } from '@/services/compiler';

export default {
  namespace: 'compiler',

  state: {
    rextesterResult: {},
  },

  effects: {
    *rextesterCompile({payload}, { call, put }) {
      const response = yield call(rextester, payload );
      yield put({
        type: 'rextesterCompiler',
        payload: response,
      });
    },
  },

  reducers: {
    rextesterCompiler(state, action) {
      return {
        ...state,
        rextesterResult: action.payload,
      };
    },
  },
};
