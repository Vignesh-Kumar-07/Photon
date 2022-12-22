const auth = "563492ad6f917000010000017d95705241294893a66665cd51b341f3";

const galleryContainer = document.querySelector(".gallery--container");
const searchInput = document.querySelector(".search-input");
const submitBtn = document.querySelector(".submit-btn");
const moreBtn = document.querySelector(".more");
const form = document.querySelector(".search-form");

let searchValue;
let page = 2;
let fetchApi;
let currentValue;

const updateUI = function (data) {
  data.photos.forEach((imgEl) => {
    const html = `
    <div class="image">
      <p class="img--author">${imgEl.photographer}</p>
      <img
        src="${imgEl.src.original}"
        alt="image name"
        class="img"
      />
    </div>
    `;
    galleryContainer.insertAdjacentHTML("beforeend", html);
  });
};

const getJSON = async function (url, message) {
  const dataFetch = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: auth,
    },
  });

  if (!dataFetch.ok) {
    throw new Error(message);
  }

  const data = await dataFetch.json();

  return data;
};

// curated function
const dataFetch = async function () {
  try {
    fetchApi = `https://api.pexels.com/v1/curated?per_page=3`;
    const data = await getJSON(fetchApi, "Problem with API");

    //update UI
    // console.log(data);

    updateUI(data);
  } catch (err) {
    console.error(`something went wrong ${err.message}`);
  }
};
dataFetch();

searchInput.addEventListener("input", function (e) {
  searchValue = e.target.value;
  currentValue = searchValue;
});

form.addEventListener("submit", function (e) {
  e.preventDefault();
  if (!searchValue) {
    alert("Type what you want to search...💥💥💥");
  } else {
    searchImage(searchValue);
    searchInput.value = "";
  }
});

//searchImage
const searchImage = async function (query) {
  try {
    fetchApi = `https://api.pexels.com/v1/search?query=${query}&per_page=3`;
    const data = await getJSON(fetchApi, "Image not found");

    // clear the ui;
    if (searchValue) {
      galleryContainer.innerHTML = "";
    }
    updateUI(data);
  } catch (err) {
    console.error(`something went wrong ${err.message}`);
  }
};

//
const loadMore = async function () {
  page += 2;

  if (currentValue) {
    fetchApi = `https://api.pexels.com/v1/search?query=${currentValue}&per_page=${page}`;
  } else {
    fetchApi = `https://api.pexels.com/v1/curated?per_page=${page}`;
  }
  const data = await getJSON(fetchApi);

  updateUI(data);
};
moreBtn.addEventListener("click", loadMore);
