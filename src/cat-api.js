import axios from 'axios';

const BASE_URL = 'https://api.thecatapi.com/v1/';

axios.defaults.headers.common['x-api-key'] =
  'live_FMlgfW8OYbvjcjUsCEvuAvTZtUx6LHeUmDdpkyi8NJNmhb0aFyzh0PHlDZbaDWuA';

export function fetchBreeds() {
  const catArr = axios.get(`${BASE_URL}breeds`).then(response => response.data);
  return catArr;
}
