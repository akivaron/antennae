import { getMateri, getSoal, checkJawabanPilgan, getKelas, getMateriVideo, getHowToUse } from '@/services/publics';

export default {
  namespace: 'publics',

  state: {
    kelas: [],
    list: [],
    materi: [],
    materiVideo: [],
    howToVideo: [],
    currentMateriVideo: '',
    currentHowToVideo: '',
    soal: [],
    timeout: 0,
    checkJawabanPilgan: '',
    questionFinish: false,
    dashboardCurrentStep: sessionStorage.getItem('soalCountDown') ? 1 : 0,
    berandaStatus: true,
    pauseCountDownSoal: {
      status: '',
      time: sessionStorage.getItem('soalCountDown')
    }
  },

  effects: {
    *getKelas(_, { call, put }) {
      const response = yield call(getKelas);
      yield put({
        type: 'saveKelas',
        payload: response,
      });
    },
    *setBerandaStatus({payload}, {put }) {
      yield put({
        type: 'saveBerandaStatus',
        payload,
      });
    },
    *setCurrentMateriVideo({payload}, {put }) {
      yield put({
        type: 'saveCurrentMateriVideo',
        payload,
      });
    },
    *setDashboardCurrentStep({payload}, {put }) {
      yield put({
        type: 'saveDashboardCurrentStep',
        payload,
      });
    },
    *setCurrentHowToVideo({payload}, {put }) {
      yield put({
        type: 'saveCurrentHowToVideo',
        payload,
      });
    },
    *getMateri(_, { call, put }) {
      const response = yield call(getMateri);
      yield put({
        type: 'saveMateri',
        payload: response,
      });
    },
    *getHowToUse(_, { call, put }) {
      const response = yield call(getHowToUse);
      yield put({
        type: 'saveHowToVideo',
        payload: response,
      });
    },
    *getMateriVideo(_, { call, put }) {
      const response = yield call(getMateriVideo);
      yield put({
        type: 'saveMateriVideo',
        payload: response,
      });
    },
    *checkJawabanPilgan({payload}, { call, put }) {
      const response = yield call(checkJawabanPilgan, payload);
      yield put({
        type: 'checkJwbanPilgan',
        payload: response,
      });
    },
    *getSoal({payload}, { call, put }) {
      const response = yield call(getSoal, payload);
      yield put({
        type: 'saveSoal',
        payload: response,
      });
    },
    *setTimeoutSoal({payload}, { put }) {
      yield put({
        type: 'saveTimeoutSoal',
        payload,
      });
    },
    *pauseCountDownSoal({payload}, { put }) {
      yield put({
        type: 'saveCountDownSoal',
        payload,
      });
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    saveBerandaStatus(state, action) {
      return {
        ...state,
        berandaStatus: action.payload,
      };
    },
    saveCountDownSoal(state, action) {
      return {
        ...state,
        pauseCountDownSoal: action.payload,
      };
    },
    saveDashboardCurrentStep(state, action) {
      return {
        ...state,
        dashboardCurrentStep: action.payload,
      };
    },
    saveCurrentMateriVideo(state, action) {
      return {
        ...state,
        currentMateriVideo: action.payload,
      };
    },
    saveCurrentHowToVideo(state, action) {
      return {
        ...state,
        currentHowToVideo: action.payload,
      };
    },
    saveMateri(state, action) {
      return {
        ...state,
        materi: action.payload || [],
      };
    },
    saveMateriVideo(state, action) {
      return {
        ...state,
        materiVideo: action.payload || [],
      };
    },
    saveHowToVideo(state, action) {
      return {
        ...state,
        howToVideo: action.payload || [],
      };
    },
    saveKelas(state, action) {
      return {
        ...state,
        kelas: action.payload || [],
      };
    },
    saveSoal(state, action) {
      return {
        ...state,
        soal: action.payload || [],
      };
    },
    checkJwbanPilgan(state, action) {
      return {
        ...state,
        checkJawabanPilgan: action.payload || '',
      };
    },
    saveTimeoutSoal(state, action) {
      return {
        ...state,
        timeout: action.payload || 0,
      };
    },
    handleFinish(state, payload) {
      return {
        ...state,
        questionFinish: payload || state.questionFinish,
      };
    },
    changeNotifyCount(state, action) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload,
        },
      };
    },
  },
};
