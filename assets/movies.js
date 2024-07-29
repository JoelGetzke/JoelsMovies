import { getMovie, addRecentMovie } from "./movieService.js";

const apiKey = "c7df8f94e93761c777c141b65c987c3e";

const categoryButton = document.querySelector("#category-button");
const startButton = document.querySelector("#start-button");
const spinner = document.querySelector(".lds-spinner");
const trailerBackground = document.querySelector('.trailer-background');

let selectedCategory = "";

// Function to periodically fetch new movies
const startPeriodicUpdates = () => {
    const refreshInterval = 24 * 60 * 60 * 1000; // 14 hours in milliseconds
    setInterval(() => {
        if (selectedCategory) {
            showSpinner();
            getMovie(selectedCategory, (movie) => {
                hideSpinner();
                handleMovie(movie);
            });
        }
    }, refreshInterval);
};

document.querySelectorAll(".dropdown-item").forEach(item => {
    item.addEventListener("click", (e) => {
        e.preventDefault();
        selectedCategory = e.target.dataset.value || "All";
        categoryButton.textContent = e.target.textContent;
    });
});

startButton.addEventListener("click", () => {
    if (selectedCategory) {
        clearMovieDetails();
        showMoviePoster();
        showSpinner();
        showTrailerBackground();
        getMovie(selectedCategory, (movie) => {
            hideSpinner();
            handleMovie(movie);
        });
    } else {
        alert("Please select a category.");
    }
});

// Call the periodic updates function when the page loads
startPeriodicUpdates();

const clearMovieDetails = () => {
    document.getElementById('movie-img').src = "";
    document.getElementById('movie-title').textContent = "";
    document.getElementById('movie-vote-average').textContent = "";
    document.getElementById('movie-release-date').textContent = "";
    document.getElementById('movie-overview').textContent = "";
    document.getElementById('trailer-container').innerHTML = "";
};

const handleMovie = (movie) => {
    document.getElementById('movie-img').src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
    document.getElementById('movie-title').textContent = movie.title;
    document.getElementById('movie-vote-average').textContent = `Vote Average: ${movie.vote_average}`;
    document.getElementById('movie-release-date').textContent = `Release Date: ${movie.release_date}`;
    document.getElementById('movie-overview').textContent = movie.overview;

    const trailerContainer = document.getElementById('trailer-container');
    trailerContainer.innerHTML = "";

    getTrailer(movie.id, (trailerUrl) => {
        if (trailerUrl) {
            const iframe = document.createElement('iframe');
            iframe.src = trailerUrl;
            iframe.width = "560";
            iframe.height = "315";
            iframe.frameBorder = "0";
            iframe.allow = "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture";
            iframe.allowFullscreen = true;
            trailerContainer.appendChild(iframe);
        }
    });

    addRecentMovie(movie);
};

const getTrailer = (movieId, callback) => {
    const url = `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${apiKey}&language=en-US`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const trailer = data.results.find(video => video.type === "Trailer" && video.site === "YouTube");
            const trailerUrl = trailer ? `https://www.youtube.com/embed/${trailer.key}` : null;
            callback(trailerUrl);
        })
        .catch(error => {
            console.error("Error fetching trailer:", error);
            callback(null);
        });
};

if (document.getElementById('movie-img').style.display !== "none") {
    document.getElementById('movie-img').style.display = "none";
}

if (trailerBackground.style.display !== "none") {
    // Hide the element
    trailerBackground.style.display = "none";
}




spinner.style.display = "none";


const showMoviePoster = () => {
    document.getElementById('movie-img').style.display = "inline-block";
};

const showTrailerBackground = () => {
    trailerBackground.style.display = "inline-block";
};

const showSpinner = () => {
    spinner.style.display = "inline-block";
};

const hideSpinner = () => {
    spinner.style.display = "none";
};






















