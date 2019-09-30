import request from '@/utils/request';

export async function accountLogin(params) {
  return request(`siswa/login/action`, {
    method: 'POST',
    body: params,
  });
}

export async function register(params) {
  return request(`siswa/register/action`, {
    method: 'POST',
    body: params,
  });
}

export async function queryCurrent() {
  return request('siswa/profile/current');
}

export async function getBookmark() {
  return request('siswa/bookmark/list');
}

export async function getTimeHistory() {
  return request('siswa/timehistory/list');
}

export async function updateBookmark(params) {
  return request(`siswa/bookmark/update`, {
    method: 'POST',
    body: params,
  });
}

export async function updateTimeHistory(params) {
  return request(`siswa/timehistory/update`, {
    method: 'POST',
    body: params,
  });
}

export async function updatePoint(params) {
  return request(`siswa/point/update`, {
    method: 'POST',
    body: params,
  });
}

export async function updateProfile(params) {
  return request(`siswa/profile/update`, {
    method: 'POST',
    body: params,
  });
}

export async function updatePassword(params) {
  return request(`siswa/password/action`, {
    method: 'POST',
    body: params,
  });
}


export async function getJawabanEssay() {
  return request(`siswa/jawaban/listEssay`);
}

export async function getJawabanMultipleChoices() {
  return request(`siswa/jawaban/listMultipleChoices`);
}

export async function updateJawabanEssay(params) {
  return request(`siswa/jawaban/updateEssay`, {
    method: 'POST',
    body: params,
  });
}

export async function updateJawabanMultipleChoices(params) {
  return request(`siswa/jawaban/updateMultipleChoices`, {
    method: 'POST',
    body: params,
  });
}
