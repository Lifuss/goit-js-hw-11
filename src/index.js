import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { getPhotosByWord } from './pixabayAPI';

const refs = {
  form: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
  target: document.querySelector('.target-load'),
};

let maxPage = 1;
let currentPage = 1;

refs.form.addEventListener('submit', onSearchSubmit);

function onSearchSubmit(e) {
  e.preventDefault();
  refs.gallery.innerHTML = '';

  getPhotosByWord(e.target.elements.searchQuery.value)
    .then(({ res, page }) => {
      currentPage = page;
      maxPage = Math.ceil(res.totalHits / res.hits.length);

      renderMarkup(res.hits);
      observer.observe(refs.target);
      updateStatusObserver();
      lightbox.refresh();
    })
    .catch(err => {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      console.log(err);
    });
  e.target.reset();
}
const observer = new IntersectionObserver(onLoad);

function loadMore() {
  getPhotosByWord()
    .then(({ res, page }) => {
      currentPage = page;
      renderMarkup(res.hits);
      window.scrollBy({
        top: 690,
        behavior: 'smooth',
      });
      updateStatusObserver();
      lightbox.refresh();
    })
    .catch(err => console.log(err));
}

function onLoad(entries, observer) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      loadMore();
    }
  });
}

function renderMarkup(hits) {
  const markup = hits.map(markupTemplate).join('');
  refs.gallery.insertAdjacentHTML('beforeend', markup);
}

function markupTemplate({
  webformatURL,
  largeImageURL,
  tags,
  likes,
  views,
  comments,
  downloads,
}) {
  return `<div class="photo-card">
    <a href="${largeImageURL}"><img class="image" src="${webformatURL}" alt="${tags}" loading="lazy" /></a>
    <div class="info">
    <p class="info-item">
      <b>${likes} &#128077;</b>
    </p>
    <p class="info-item">
      <b>${views} &#128064;</b>
    </p>
    <p class="info-item">
      <b>${comments} &#128221;</b>
    </p>
    <p class="info-item">
      <b>${downloads} &#128228;</b>
    </p>
  </div>
</div>`;
}

const lightbox = new SimpleLightbox('.gallery a', {});

function updateStatusObserver() {
  if (currentPage === maxPage) {
    observer.unobserve(refs.target);
  }
}
