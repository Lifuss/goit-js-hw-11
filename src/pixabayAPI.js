import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const BASE_URL = 'https://pixabay.com/api/';
// const loadBtn = document.querySelector('.load-more');

let params = new URLSearchParams({
  key: '39012417-8ecd5ac19c5f88775b27b3185',
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: 'true',
});
let per_page = 40;
let page = 1;
let searchWord = '';

export function getPhotosByWord(wordBySearch) {
  page += 1;

  if (wordBySearch) {
    searchWord = wordBySearch;
    page = 1;
  }

  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${BASE_URL}?q=${searchWord}&${params}&per_page=${per_page}&page=${page}`,
  };

  const fetch = axios
    .request(config)
    .then(res => {
      if (!res.data.hits.length) {
        throw new Error('error');
      }
      const obj = {
        res: res.data,
        page,
      };
      return obj;
    })
    .catch(err => {
      console.log(err);
    });
  return fetch;
}
