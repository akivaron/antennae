import {
  queryCurrent,
  getBookmark,
  updateBookmark,
  getTimeHistory,
  updateTimeHistory,
  register,
  updateJawabanEssay,
  updateJawabanMultipleChoices,
  getJawabanEssay,
  getJawabanMultipleChoices,
  updateProfile,
  updatePassword,
  updatePoint,
} from '@/services/user';

export default {
  namespace: 'user',

  state: {
    reg: {},
    regStatus: 'error',
    bookmark: [],
    timeHistory: [],
    point: [],
    currentUser: {},
    jawabanEssay: [],
    jawabanMultipleChoices: [],
    updateProfile: {},
    updateProfileStatus: 'error',
    updatePassword: {},
    updatePasswordStatus: 'error'
  },

  effects: {
    *regStatus({payload}, { put }) {
      yield put({
        type: 'registerStatus',
        payload,
      });
    },
    *updateProfileStatus({payload}, { put }) {
      yield put({
        type: 'updateProfileUserStatus',
        payload,
      });
    },
    *updatePasswordStatus({payload}, { put }) {
      yield put({
        type: 'updatePasswordUserStatus',
        payload,
      });
    },
    *register({payload}, { call, put }) {
      const response = yield call(register, payload);
      yield put({
        type: 'reg',
        payload: response,
      });
    },
    *updateProfile({payload}, { call, put }) {
      const response = yield call(updateProfile, payload);
      yield put({
        type: 'updateProfileUser',
        payload: response,
      });
    },
    *updatePassword({payload}, { call, put }) {
      const response = yield call(updatePassword, payload);
      yield put({
        type: 'updatePasswordUser',
        payload: response,
      });
    },
    *fetchCurrent(_, { call, put }) {
      const response = yield call(queryCurrent);
      yield put({
        type: 'saveCurrentUser',
        payload: response,
      });
    },
    *getBookmark(_, { call, put }) {
      const response = yield call(getBookmark);
      yield put({
        type: 'saveBookmark',
        payload: response,
      });
    },
    *getTimeHistory(_, { call, put }) {
      const response = yield call(getTimeHistory);
      yield put({
        type: 'saveTimeHistory',
        payload: response,
      });
    },
    *getJawabanEssay(_, { call, put }) {
      const response = yield call(getJawabanEssay);
      yield put({
        type: 'saveJawabanEssay',
        payload: response,
      });
    },
    *getJawabanMultipleChoices(_, { call, put }) {
      const response = yield call(getJawabanMultipleChoices);
      yield put({
        type: 'saveJawabanMultipleChoices',
        payload: response,
      });
    },
    *updateTimeHistory({payload}, { call, put }) {
      const response = yield call(updateTimeHistory,payload);
      yield put({
        type: 'saveTimeHistory',
        payload: response,
      });
    },
    *updateBookmark({payload}, { call, put }) {
      const response = yield call(updateBookmark,payload);
      yield put({
        type: 'saveBookmark',
        payload: response,
      });
    },
    *updatePoint({payload}, { call, put }) {
      const response = yield call(updatePoint,payload);
      yield put({
        type: 'savePoint',
        payload: response,
      });
    },
    *updateJawabanEssay({payload}, { call, put }) {
      const response = yield call(updateJawabanEssay,payload);
      yield put({
        type: 'saveJawabanEssay',
        payload: response,
      });
    },
    *updateJawabanMultipleChoices({payload}, { call, put }) {
      const response = yield call(updateJawabanMultipleChoices,payload);
      yield put({
        type: 'saveJawabanMultipleChoices',
        payload: response,
      });
    },
  },

  reducers: {
    updateProfileUser(state, action) {
      return {
        ...state,
        updateProfile: action.payload,
      };
    },
    updatePasswordUser(state, action) {
      return {
        ...state,
        updatePassword: action.payload,
      };
    },
    reg(state, action) {
      return {
        ...state,
        reg: action.payload,
      };
    },
    registerStatus(state, action) {
      return {
        ...state,
        regStatus: action.payload,
      };
    },
    updateProfileUserStatus(state, action) {
      return {
        ...state,
        updateProfileStatus: action.payload,
      };
    },
    updatePasswordUserStatus(state, action) {
      return {
        ...state,
        updatePasswordStatus: action.payload,
      };
    },
    saveBookmark(state, action) {
      return {
        ...state,
        bookmark: action.payload,
      };
    },
    saveTimeHistory(state, action) {
      return {
        ...state,
        timeHistory: action.payload,
      };
    },
    savePoint(state, action) {
      return {
        ...state,
        point: action.payload,
      };
    },
    saveJawabanEssay(state, action) {
      return {
        ...state,
        jawabanEssay: action.payload,
      };
    },
    saveJawabanMultipleChoices(state, action) {
      return {
        ...state,
        jawabanMultipleChoices: action.payload,
      };
    },
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload || {},
      };
    },
  },
};
