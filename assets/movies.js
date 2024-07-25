import { getMovie, addRecentMovie } from "./movieService.js";

const apiKey = "c7df8f94e93761c777c141b65c987c3e";

const categoryButton = document.querySelector("#category-button");
const startButton = document.querySelector("#start-button");

let selectedCategory = "";

// Function to periodically fetch new movies
const startPeriodicUpdates = () => {
    const refreshInterval = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    setInterval(() => {
        if (selectedCategory) {
            getMovie(selectedCategory, handleMovie);
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
        getMovie(selectedCategory, handleMovie);
    } else {
        alert("Please select a category.");
    }
});

// Call the periodic updates function when the page loads
startPeriodicUpdates();

const clearMovieDetails = () => {
    document.getElementById('movie-img').src = "";
    document.getElementById('movie-title').textContent = "";
    document.getElementById('movie-release-date').textContent = "";
    document.getElementById('movie-vote-average').textContent = "";
    document.getElementById('movie-overview').textContent = "";
    document.getElementById('trailer-container').innerHTML = "";
};

const handleMovie = (movie) => {
    if (!movie) {
        console.error('No movie data received or all recent movies filtered out.');
        return;
    }

    addRecentMovie(movie);
    showMovie(movie);
};

const showMovie = (movie) => {
    if (!movie) {
        console.error('No movie found to display.');
        return;
    }

    document.getElementById('movie-img').src = `https://image.tmdb.org/t/p/w300${movie.poster_path}`;
    document.getElementById('movie-title').textContent = movie.title;
    document.getElementById('movie-overview').textContent = movie.overview;
    document.getElementById('movie-release-date').textContent = `Release Date: ${movie.release_date}`;
    document.getElementById('movie-vote-average').textContent = `Rating: ${movie.vote_average}/10`;

    fetch(`https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            if (!data.results || data.results.length === 0) {
                console.error('No trailer results found.');
                document.getElementById('trailer-container').innerHTML = "<p>No trailer available.</p>";
                return;
            }

            const trailer = data.results.find(video => video.type === "Trailer" && video.site === "YouTube");
            if (trailer) {
                document.getElementById('trailer-container').innerHTML = `<iframe src="https://www.youtube.com/embed/${trailer.key}" frameborder="0" allowfullscreen></iframe>`;
            } else {
                document.getElementById('trailer-container').innerHTML = "<p>No trailer available.</p>";
            }
        })
        .catch(error => {
            console.error('Error fetching movie trailers:', error);
            document.getElementById('trailer-container').innerHTML = "<p>Error fetching trailer.</p>";
        });
};





















