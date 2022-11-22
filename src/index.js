import './css/styles.css';
import { fetchCountries, numberWithCommas } from './fetchCountries';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;
const refs = {
  searchBox: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.searchBox.addEventListener(
  'input',
  debounce(onInputChange, DEBOUNCE_DELAY)
);

function onInputChange(e) {
  e.preventDefault();

  const name = e.target.value.trim();

  refs.countryInfo.innerHTML = '';
  refs.countryList.innerHTML = '';

  if (!name) {
    return;
  }

  fetchCountries(name)
    .then(countries => {
      if (countries.length > 10) {
        return Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      }
      makeCountryList(countries);
    })
    .catch(err => Notify.failure('Oops, there is no country with that name'));
}

function makeCountryList(countries) {
  if (countries.length === 1) {
    makeCountryInfo(countries);
  } else {
    makeCountrysList(countries);
  }
}

function makeCountryInfo(country) {
  const markup = country
    .map(({ flags, name, capital, population, languages }) => {
      const totalPeople = numberWithCommas(population);
      return `<img class="flag" width="200px" src='${flags.svg}'
      alt='${name.official} flag' />
        <ul class="country-info__list">
            <li class="country-info__item country-info__item--name"><p><b>Name: </b>${
              name.official
            }</p></li>
            <li class="country-info__item"><b>Population: </b>${totalPeople}</li>
            <li class="country-info__item"><b>Capital: </b>${capital}</li>
            <li class="country-info__item"><b>Languages: </b>${Object.values(
              languages
            )}</li>
        </ul>`;
    })
    .join('');
  refs.countryInfo.innerHTML = markup;
}
function makeCountrysList(countries) {
  const markup = countries
    .map(({ flags, name }) => {
      return `
                <li class="country-list__item">
                    <img class="country-list__flag" src="${flags.svg}" alt="Flag of ${name.official}" width = 50px>
                    <p class="country-list__name">${name.official}</p>
                </li>
                `;
    })

    .join('');

  refs.countryList.innerHTML = markup;
}
