import request from '@/utils/request';

export async function getKelas() {
  return request(`public/kelas/list`);
}

export async function getMateri() {
  return request(`public/materi/list`);
}

export async function getMateriVideo() {
  return request(`public/materi/video`);
}

export async function getHowToUse() {
  return request(`public/howtouse/video`);
}

export async function getSoal(params) {
  return request(`public/soal/list`, {
    method: 'POST',
    body: params,
  });
}

export async function checkJawabanPilgan(params) {
  return request(`public/jawaban/pilgan`, {
    method: 'POST',
    body: params,
  });
}
