const apiKey = 'c7df8f94e93761c777c141b65c987c3e';

// Fetch popular movies from TMDB API
async function fetchMovies() {
  const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=inc`); //change this to search for movies
  const data = await response.json();
  return data.results.map(movie => ({ name: movie.title }));
}

const input = document.getElementById('rechercheInput');
const suggestions = document.getElementById('suggestions');
const submitBtn = document.getElementById('submit');

submitBtn.addEventListener('click', function(e) {
  e.preventDefault();
});

const toLowerCase = (s) => s.toLowerCase();
const strIncludes = (s1) => (s2) => s1.includes(s2);
const filterByName = (val) => ({ name }) => strIncludes(toLowerCase(name))(toLowerCase(val));

const empty = (element) => {
  while (element.firstElementChild) {
    element.firstElementChild.remove();
  }
};

const getFilteredArray = (arr) => (keyword) => keyword ? arr.filter(filterByName(keyword)) : [];

async function setupMovieSuggestions() {
  const movies = await fetchMovies();
  const getFilteredMovies = getFilteredArray(movies);

  input.addEventListener('input', function(e) {
    const filteredMovies = getFilteredMovies(e.target.value);
    updateSuggestions(suggestions, this)(filteredMovies);
  });
}

const getSuggestionItemEl = (suggestion) => {
  const suggestionItem = document.createElement('div');
  suggestionItem.classList.add('suggestion-item');
  suggestionItem.textContent = suggestion.name;
  return { suggestionItem };
};

const getListenerFn = (input, movie, callback) => (e) => {
  input.value = movie.name;

  if (callback && callback instanceof Function) {
    callback(input);
  }
};

const updateSuggestions = (container, input) => (filteredMovies) => {
  empty(container);

  filteredMovies.forEach((movie) => {
    const { suggestionItem } = getSuggestionItemEl(movie);
    suggestionItem.addEventListener('click', getListenerFn(input, movie, (input) => updateSuggestions(container, input)(getFilteredMovies(input.value))));
    container.append(suggestionItem);
  });
};

setupMovieSuggestions();
