import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import axios from 'axios';

const refs = {
  searchForm: document.querySelector('.search-form'),
  cardList: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

refs.searchForm.addEventListener('submit', onSearchSubmit);

let searchQuerry = '';
let page = 1;

function onSearchSubmit(e) {
  e.preventDefault();
  refs.cardList.innerHTML = '';
  searchQuerry = e.currentTarget.searchQuery.value;
  apiLoadData(searchQuerry);
}
refs.loadMoreBtn.addEventListener('click', onLoadMoreBtnClick);
console.log(searchQuerry);

function onLoadMoreBtnClick() {
  page += 1;
  console.log(page);
  apiLoadData(searchQuerry, page);
}

async function apiLoadData(querry) {
  const options = {
    params: {
      q: querry,
      key: '31317963-93e1be27f3dc3526dd5fff289',
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      per_page: 40,
      page: page,
    },
  };

  // options.params.q = querry;
  // options.params.page = page;

  const data = await axios.get(`https://pixabay.com/api/`, options);

  matchQuerry(data);
}

function matchQuerry(data) {
  if (data.data.total === 0) {
    noMatchFind();
    return;
  }

  if (data.config.params.page === 1) {
    matchFound(data.data.total);
  }

  renderCard(data);
  if (data.data.hits.length < 40) {
    refs.loadMoreBtn.style = 'none';
    return Notiflix.Notify.success(
      `We're sorry, but you've reached the end of search results.`
    );
  }
}

function noMatchFind() {
  Notiflix.Notify.failure(
    ` Sorry, there are no images matching your search query. Please try again.`
  );
}

function matchFound(value) {
  Notiflix.Notify.success(`Hooray! We found ${value} images.`);
}

function renderCard(data) {
  let card = data.data.hits
    .map(element => {
      return `
    <div class="photo-card">
  <img src="${element.webformatURL}" alt="${element.tags}" width=450 height=350 loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes: ${element.likes}</b>
    </p>
    <p class="info-item">
      <b>Views: ${element.views}</b>
    </p>
    <p class="info-item">
      <b>Comments: ${element.comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads: ${element.downloads}</b>
    </p>
  </div>
</div>
    `;
    })
    .join('');

  refs.cardList.insertAdjacentHTML('beforeend', card);
  refs.loadMoreBtn.style.display = 'block';
  // simpleLightBox.refresh();
  // simpleLightBox.on('show.simplelightbox');
}

// refs.cardList.addEventListener('click', onGalleryImageClick);

// function onGalleryImageClick(evt) {
//   evt.preventDefault();
//   if (evt.target.nodeName !== 'IMG') {
//     return;
//   }
//   simpleLightBox.on('show.simplelightbox');
// }
let simpleLightBox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: '250',
});
