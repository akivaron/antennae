import request from '@/utils/request';

export async function rextester(params) {
  return request(`https://rextester.com/rundotnet/api`, {
    method: 'POST',
    body: params,
    rextester: true
  });
}

export async function judge0(params) {
  return request(`siswa/login/action`, {
    method: 'POST',
    body: params,
  });
}
