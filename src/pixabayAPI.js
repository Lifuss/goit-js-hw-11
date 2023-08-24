import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';

let per_page = 40;
let page = 1;
let searchWord = '';

export async function getPhotosByWord(wordBySearch) {
  page++;

  if (wordBySearch) {
    searchWord = wordBySearch;
    page = 1;
  }
  console.log(page);

  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${BASE_URL}?q=${searchWord}&per_page=${per_page}&page=${page}`,
    params: {
      key: '39012417-8ecd5ac19c5f88775b27b3185',
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: 'true',
    },
  };

  const {
    data: { hits, totalHits },
  } = await axios.request(config);
  const obj = {
    hits,
    totalHits,
    page,
  };
  return obj;
}
