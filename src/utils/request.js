import fetch from 'dva/fetch';
import { notification } from 'antd';
import router from 'umi/router';
import hash from 'hash.js';
import { isAntdPro } from './utils';
import { reloadAuthorized } from '@/utils/Authorized';
import { BERHASIL_LOGIN } from '@/constants/status';
import { baseApi, baseUrl } from '@/defaultSettings';

const codeMessage = {
  200: 'Server berhasil mengembalikan data yang diminta. ',
  201: 'Data baru atau modifikasi berhasil. ',
  202: 'Permintaan telah memasukkan antrian latar belakang (tugas tidak sinkron). ',
  204: 'Hapus data dengan sukses. ',
  400: 'Permintaan dikirim dengan kesalahan. Server tidak melakukan operasi apa pun untuk membuat atau memodifikasi data. ',
  401: 'Pengguna tidak memiliki izin (token, nama pengguna, kata sandi salah). ',
  403: 'Pengguna diizinkan, tetapi akses dilarang. ',
  404: 'Permintaan yang dikirim adalah untuk catatan yang tidak ada dan server tidak beroperasi. ',
  406: 'Format permintaan tidak tersedia. ',
  410: 'Sumber daya yang diminta dihapus secara permanen dan tidak akan diperoleh lagi. ',
  422: 'Saat membuat objek, kesalahan validasi terjadi. ',
  500: 'Server memiliki kesalahan. Silakan periksa server. ',
  502: 'Gateway error. ',
  503: 'Layanan tidak tersedia, server untuk sementara kelebihan beban atau dikelola. ',
  504: 'Kehabisan waktu. ',
};

const checkStatus = response => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const errortext = codeMessage[response.status] || response.statusText;
  response.json().then(resp => {
    if(resp.status === 'error'){
      if(({}).hasOwnProperty.call(resp, "error")){
        notification.error({
          message: `Kesalahan permintaan ${response.status}`,
          description: resp.error,
        });
      } else if (({}).hasOwnProperty.call(resp, "data")) {
        notification.error({
          message: `Kesalahan permintaan ${response.status}`,
          description: resp.data.message,
        });
      }
    }
  });
  const error = new Error(errortext);
  error.name = response.status;
  error.response = response;
  throw error;
};

const cachedSave = (response, hashcode) => {
  /**
   * Clone a response data and store it in sessionStorage
   * Does not support data other than json, Cache only json
   */
  const contentType = response.headers.get('Content-Type');
  if (contentType && contentType.match(/application\/json/i)) {
    // All data is saved as text
    response
      .clone()
      .text()
      .then(content => {
        if(({}).hasOwnProperty.call(JSON.parse(content),'data')){
          const contents = JSON.parse(content);
          if(contents.data.code === BERHASIL_LOGIN){
              sessionStorage.setItem('Authorization', contents.data.message.token);
          }
        }
        //sessionStorage.setItem(hashcode, content);
        //sessionStorage.setItem(`${hashcode}:timestamp`, Date.now());
      });
  }
  return response;
};

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [option] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, option) {
  const options = {
    expirys: isAntdPro(),
    mode: "cors",
    ...option,
  };
  /**
   * Produce fingerprints based on url and parameters
   * Maybe url has the same parameters
   */
  const fingerprint = url + (options.body ? JSON.stringify(options.body) : '');
  const hashcode = hash
    .sha256()
    .update(fingerprint)
    .digest('hex');

  const defaultOptions = {
    credentials: 'include',
  };
  const newOptions = { ...defaultOptions, ...options };
  if (
    newOptions.method === 'POST' ||
    newOptions.method === 'PUT' ||
    newOptions.method === 'DELETE'
  ) {
    if (!(newOptions.body instanceof FormData)) {
      newOptions.headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
        ...newOptions.headers,
      };
      newOptions.body = JSON.stringify(newOptions.body);
    } else {
      // newOptions.body is FormData
      newOptions.headers = {
        Accept: 'text/plain',
        'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8',
        ...newOptions.headers,
      };
    }
  }

  newOptions.headers = {
    'X-API-KEY': 'k8ko4gggck8koksc88o8o8kokskwko8c0kow8ow8',
    Authorization: sessionStorage.getItem('Authorization') ? sessionStorage.getItem('Authorization'):'',
    ...newOptions.headers
  };

  const expirys = options.expirys && 60;
  // options.expirys !== false, return the cache,
  if (options.expirys !== false) {
    const cached = sessionStorage.getItem(hashcode);
    const whenCached = sessionStorage.getItem(`${hashcode}:timestamp`);
    if (cached !== null && whenCached !== null) {
      const age = (Date.now() - whenCached) / 1000;
      if (age < expirys) {
        const response = new Response(new Blob([cached]));
        return response.json();
      }
      sessionStorage.clear();
      localStorage.clear();
    }
  }

  let dataUrl = baseApi + url;
  let dataOption = newOptions;

  if(option && ({}).hasOwnProperty.call(option, "rextester")){
    dataUrl = url;
    dataOption = option;
  }

  return fetch(dataUrl, dataOption)
    .then(checkStatus)
    .then(response => cachedSave(response, hashcode))
    .then(response => {
      // DELETE and 204 do not return data by default
      // using .json will report an error.
      if (newOptions.method === 'DELETE' || response.status === 204) {
        return response.text();
      }
      return response.json();
    })
    .catch(e => {
      const status = e.name;
      if (status === 401) {
        // @HACK
        /* eslint-disable no-underscore-dangle */
        window.g_app._store.dispatch({
          type: 'login/logout',
        });
        return;
      }
      // environment should not be used
      if (status === 403) {
        localStorage.clear();
        sessionStorage.clear();
        window.location.reload()
        return;
      }
      if (status <= 504 && status >= 500) {
        localStorage.clear();
        sessionStorage.clear();
        reloadAuthorized();
        router.push('/exception/500');
        return;
      }
      if (status >= 404 && status < 422) {
        router.push('/exception/404');
        return;
      }

      throw e;
    });
}
