import { API_KEY, API_URL } from './config.js';

const global = {
  currentPage: window.location.pathname,
  api: {
    apiKey: API_KEY,
    apiUrl: API_URL,
  },
};

function priceCreation() {
  return Math.floor(Math.random(6) * 100);
}

async function displayNewReleases() {
  const { results } = await fetchAPIData('games', 8, 20);

  results.forEach(game => {
    const newReleases = document.createElement('div');

    newReleases.innerHTML = `
            <div class="catalog-item-container">
                <div class="product-item--image">
                  <a href="product-game.html?id=${game.id}"
                    ><img
                      src="${game.background_image}"
                      alt="${game.name}"
                      width="310px"
                      height="177.75px"
                      style="display: block"
                  /></a>
                </div>
                <div class="catalog-item--description">
                  <div class="catalog-item--title">
                    <p>${game.name}</p>
                  </div>
                  <div class="catalog-item--price">
                    <p>$${priceCreation()}.99</p>
                  </div>
                </div>
            </div>
          `;

    document.querySelector('.another-one').appendChild(newReleases);
  });
}

async function displayTopSellers() {
  const { results } = await fetchAPIData('games', 8, 1);

  results.forEach(game => {
    const topSellers = document.createElement('div');

    topSellers.innerHTML = `
        <div class="catalog-item-container">
            <div class="product-item--image">
              <a href="product-game.html?id=${game.id}"
                ><img
                  src="${game.background_image}"
                  alt="${game.name}"
                  width="310px"
                  height="177.75px"
                  style="display: block"
              /></a>
            </div>
            <div class="catalog-item--description">
              <div class="catalog-item--title">
                <p>${game.name}</p>
              </div>
              <div class="catalog-item--price">
                <p>$${priceCreation()}.99</p>
              </div>
            </div>
        </div>
      `;

    document.querySelector('.catalog-list').appendChild(topSellers);
  });
}

async function displayPublishers() {
  const { results } = await fetchAPIData('publishers', 4, 1);

  results.forEach(publisher => {
    const publisherDiv = document.createElement('div');

    publisherDiv.innerHTML = `
      <div class="content-publisher-container">
        <a href="#" class="content-publisher">
          <img src="${publisher.image_background}" class="catalog-item--publisher" alt="${publisher.name}">
        </a>
      </div>
    `;

    document
      .querySelector('.content-publishers-container')
      .appendChild(publisherDiv);
  });
}

async function displayGameDetail() {
  const gameId = window.location.search.split('=')[1];
  const gameTitle = document.getElementById('title');
  const gameDetailBox = document.getElementById('game-detail-box');
  const minimumRequirementsUl = document.getElementById('minimum-requirements');
  const recommendedRequirementsUl = document.getElementById('recommended-requirements');
  const systemRequirements = document.getElementById('system-requirements');
  const gameDetails = await fetchGameDetailAPI(`games/${gameId}`);
  const { results } = await fetchGameDetailAPI(`games/${gameId}/screenshots`);

  const productMainImage = document.querySelector('.product-slider-screen');
  const productSideImage = document.querySelector('.catalog-item--image');
  const productDescrption = document.querySelector('.product-description');

  let gameTitleName = document.createElement('h1');

  gameTitleName = gameDetails.name;
  gameTitle.append(gameTitleName);

  productMainImage.innerHTML = `<img src="${gameDetails.background_image}" alt="${gameDetails.name}" class="content-img">`;
  productSideImage.innerHTML = `<img src="${gameDetails.background_image}" alt="${gameDetails.name}" width="360" height="206">`;

  results.slice(0, 5).forEach(screenshot => {
    const ul = document.getElementById('container-images-ul');
    const li = document.createElement('li');

    li.innerHTML = `
      <img src="${screenshot.image}"
      alt="${screenshot.name}"
      class="content-sub-image-preview">
    `;

    ul.appendChild(li);
  });

  let productionText = document.createElement('p');

  productionText.textContent = `${gameDetails.description_raw}`;
  productionText.classList.add('product-description-text');
  productDescrption.append(productionText);

  const newDate = new Date(gameDetails.released);
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec',];

  gameDetailBox.innerHTML = `
    <li>
      Genre
      <div class="value">
        <a href="#">${gameDetails.genres.map(genre => ` ${genre.name}`)}</a>
      </div>
    </li>
    <li>
      Release Date
      <div class="value">
        <a href="#">${newDate.getDay()}/${months[newDate.getMonth()]}/${newDate.getFullYear()}</a>
      </div>
    </li>
    <li>
      Publisher
      <div class="value">
        <a href="#">${gameDetails.publishers[0].name}</a>
      </div>
    </li>
    <li>
      Game Developer
      <div class="value">
        <a href="#">${gameDetails.developers[0].name}</a>
      </div>
    </li>
  `;

  let minimumLi = document.createElement('li');
  let recommendedLi = document.createElement('li');

  if (gameDetails.platforms[0].requirements.minimum.length > 0) {
    minimumLi.textContent = gameDetails.platforms[0].requirements.minimum.split(',');

    minimumRequirementsUl.append(minimumLi);
  } else {
    minimumLi.textContent = 'No requirements were found';
  }

  if (gameDetails.platforms[0].requirements.recommended.length > 0) {
    recommendedLi.textContent = gameDetails.platforms[0].requirements.recommended.split(',');

    recommendedRequirementsUl.append(recommendedLi);
  } else {
    recommendedLi.textContent = 'No requirements were found';
  }

}

async function fetchGameDetailAPI(endpoint) {
  const API_KEY = global.api.apiKey;
  const API_URL = global.api.apiUrl;

  const response = await fetch(`${API_URL}api/${endpoint}?key=${API_KEY}`);

  const data = response.json();

  return data;
}

async function fetchAPIData(endpoint, pageSize, page) {
  const API_KEY = global.api.apiKey;
  const API_URL = global.api.apiUrl;

  const response = await fetch(
    `${API_URL}api/${endpoint}?key=${API_KEY}&page_size=${pageSize}&page=${page}`
  );

  const data = response.json();

  return data;
}

function init() {
  switch (global.currentPage) {
    case '/':
    case '/index.html':
      displayTopSellers();
      displayNewReleases();
      displayPublishers();
      break;
    case '/product-game.html':
      displayGameDetail();
      break;
    default:
      console.log('Please enter a proper function');
  }
}

document.addEventListener('DOMContentLoaded', init);
