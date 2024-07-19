// movieService.js
const apiKey = 'c7df8f94e93761c777c141b65c987c3e';
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/";
const IMAGE_SIZE = "w300"; // Use a larger size for the detail view

export const getMovie = (genreId) => {
    fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${genreId}&vote_average.gte=8`)
        .then(response => response.json())
        .then(data => {
            const movies = data.results;
            if (movies.length > 0) {
                const randomMovie = movies[Math.floor(Math.random() * movies.length)];
                showMovie(randomMovie);
            } else {
                showMovie({ title: "No movies found in this category with a rating of 8 or above." });
            }
        });
};

const showMovie = (movie) => {
    // Display movie details
    document.getElementById('movie-img').src = `${IMAGE_BASE_URL}${IMAGE_SIZE}${movie.poster_path}`;
    document.getElementById('movie-title').textContent = movie.title;
    document.getElementById('movie-overview').textContent = movie.overview;
    document.getElementById('movie-release-date').textContent = `Release Date: ${movie.release_date}`;
    document.getElementById('movie-vote-average').textContent = `Rating: ${movie.vote_average}/10`;

    // Fetch the movie trailers
    fetch(`https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=${apiKey}&language=en-US`)
        .then(response => response.json())
        .then(videoData => {
            const trailer = videoData.results.find(video => video.type === "Trailer" && video.site === "YouTube");
            if (trailer) {
                const trailerContainer = document.getElementById('trailer-container');
                const iframe = document.createElement('iframe');
                iframe.src = `https://www.youtube.com/embed/${trailer.key}`;
                iframe.frameBorder = "0";
                iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
                iframe.allowFullscreen = true;
                trailerContainer.appendChild(iframe);
            } else {
                console.error('No trailer found for this movie.');
            }
        })
        .catch(error => console.error('Error fetching movie trailers:', error));
};






