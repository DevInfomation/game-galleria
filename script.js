const global = {
  currentPage: window.location.pathname,
  api: {
    apiKey: '1810efb422424c25b19f69fbebae88a9',
    apiUrl: 'https://api.rawg.io/',
  },
};

function priceCreation() {
  return Math.floor(Math.random() * 100);
}

async function displayNewReleases() {
  const { results } = await fetchAPIData('games');

  results.forEach((game) => {
    const newReleases = document.createElement('div');

    newReleases.innerHTML = `
            <div class="catalog-item-container">
                <div class="product-item--image">
                  <a href="#"
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
  const { results } = await fetchAPIData('games');

  results.forEach((game) => {
    const topSellers = document.createElement('div');

    topSellers.innerHTML = `
            <div class="catalog-item-container">
                <div class="product-item--image">
                  <a href="#"
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

async function fetchAPIData(endpoint) {
  const API_KEY = global.api.apiKey;
  const API_URL = global.api.apiUrl;

  const response = await fetch(
    `${API_URL}api/${endpoint}?key=${API_KEY}&page_size=8`
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
      break;
    default:
      console.log('Please enter a proper function');
  }
}

document.addEventListener('DOMContentLoaded', init);
