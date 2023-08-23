import { fetchBreeds } from './cat-api.js';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SlimSelect from 'slim-select';
import 'slim-select/dist/slimselect.css';

const refs = {
  breedSelect: document.querySelector('.breed-select'),
  catInfo: document.querySelector('.cat-info'),
  loaderElem: document.querySelector('.loader'),
  errorElem: document.querySelector('.error'),
};

function renderSelect() {
  setTimeout(() => {
    fetchBreeds()
      .then(data =>
        data.forEach(({ id, name }) => {
          const markup = `<option value="${id}">${name}</option>`;
          refs.breedSelect.insertAdjacentHTML('beforeend', markup);
        })
      )
      .catch(error => {
        return Notify.failure(
          'Oops! Something went wrong! Try reloading the page!',
          {
            position: 'center-center',
            clickToClose: true,
            fontSize: '26px',
            width: 'fit-content',
          }
        );
      })
      .finally(() => {
        new SlimSelect({
          select: refs.breedSelect,
        });
        loader();
        Notify.info('Please choose a cat breed', {
          position: 'center-center',
          clickToClose: true,
          fontSize: '26px',
          width: 'fit-content',
        });
      });
  }, 1000);
}
renderSelect();

refs.breedSelect.addEventListener('change', onSelectBreed);

function onSelectBreed(e) {
  loader();
  setTimeout(() => {
    fetchBreeds()
      .then(res => {
        const filteredCat = {
          ...res.filter(el => e.target.value === el.id)[0],
        };
        const { image, name, description, temperament } = filteredCat;

        const markup = `<img class="image" src="${image.url}" alt="${name}">
        <div class="text-box">
        <h2 class="desc-title">${name}</h2>
        <p class="desc-text">${description}</p>
        <p><b>Temperament</b>${temperament}</p>
        </div>`;

        refs.catInfo.innerHTML = markup;
      })
      .catch(error => {
        return Notify.failure(
          'Oops! Something went wrong! Try reloading the page!',
          {
            position: 'center-center',
            clickToClose: true,
            fontSize: '26px',
            width: 'fit-content',
          }
        );
      })
      .finally(() => {
        loader();
      });
  }, 600);
}

function loader() {
  refs.catInfo.classList.toggle('visually-hidden');
  refs.breedSelect.classList.toggle('visually-hidden');
  refs.loaderElem.classList.toggle('visually-hidden');
}
