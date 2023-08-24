import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { getPhotosByWord } from './pixabayAPI';
import debounce from 'lodash.debounce';

const refs = {
  form: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
  target: document.querySelector('.target-load'),
};

let maxPage = 1;
let currentPage = 1;
let searchedWord = '';

refs.form.addEventListener('submit', onSearchSubmit);

function onSearchSubmit(e) {
  e.preventDefault();
  searchedWord = e.target.elements.searchQuery.value.trim();
  if (!searchedWord) {
    return Notify.warning('Please enter your search target', {
      position: 'center-center',
      clickToClose: true,
      fontSize: '22px',
      width: 'fit-content',
    });
  }

  currentPage = 1;
  maxPage = 1;
  refs.gallery.innerHTML = '';

  getPhotosByWord(searchedWord, currentPage)
    .then(({ hits, totalHits }) => {
      if (totalHits === 0) {
        throw new Error(err);
      }
      maxPage = Math.ceil(totalHits / hits.length);
      renderMarkup(hits);
      Notify.success(`For the query ${totalHits} images were found`, {
        clickToClose: true,
        fontSize: '22px',
        width: 'fit-content',
      });
      observer.observe(refs.target);
      updateStatusObserver();

      lightbox.refresh();
    })
    .catch(err => {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.',
        {
          position: 'center-center',
          clickToClose: true,
          fontSize: '22px',
          width: 'fit-content',
        }
      );
    });
  e.target.reset();
}
const observer = new IntersectionObserver(onLoad);

function loadMore() {
  if (maxPage === 1) {
    return;
  }
  currentPage += 1;
  getPhotosByWord(searchedWord)
    .then(({ hits }) => {
      renderMarkup(hits);
      window.scrollBy({
        top: 690,
        behavior: 'smooth',
      });
      updateStatusObserver();
      lightbox.refresh();
    })
    .catch(err => console.log('error on load'));
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
    document.addEventListener('scroll', debounce(onBottomHit, 300));
  }
}

function onBottomHit() {
  const scrollableHeight =
    document.documentElement.scrollHeight - window.innerHeight;
  if (window.scrollY >= scrollableHeight) {
    Notify.info(`&#127879; you've got to the end of the gallery`, {
      position: 'center-bottom',
      clickToClose: true,
      fontSize: '22px',
      width: 'fit-content',
    });
    document.removeEventListener('scroll', onBottomHit);
  }
}
