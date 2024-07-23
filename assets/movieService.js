const apiKey = "c7df8f94e93761c777c141b65c987c3e";
const allGenres = [28, 12, 16, 35, 80, 99, 18, 10751, 14, 36, 27, 10402, 9648, 10749, 878, 10770, 53, 10752, 37];

const fetchMovies = async (genreId, page) => {
    try {
        console.log(`Fetching movies for genreId: ${genreId}, page: ${page}`);
        const genreParam = genreId === "All" ? allGenres.join(',') : genreId;
        const response = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${genreParam}&vote_average.gte=7.0&vote_average.lte=10&page=${page}&primary_release_date.gte=1994-01-01`);
        const data = await response.json();
        console.log('Fetched movies data:', data);
        return data.results || [];
    } catch (error) {
        console.error('Error fetching movies:', error);
        return [];
    }
};

const fetchMovieDetails = async (movieId) => {
    try {
        console.log(`Fetching details for movieId: ${movieId}`);
        const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}`);
        const data = await response.json();
        console.log('Fetched movie details:', data);
        return data;
    } catch (error) {
        console.error('Error fetching movie details:', error);
        return null;
    }
};

const fetchCertification = async (movieId) => {
    try {
        console.log(`Fetching certification for movieId: ${movieId}`);
        const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/release_dates?api_key=${apiKey}`);
        const data = await response.json();
        console.log('Fetched certification data:', data);
        const usCertification = data.results.find(result => result.iso_3166_1 === 'US');
        if (usCertification) {
            const certification = usCertification.release_dates.find(release => release.certification);
            return certification ? certification.certification : null;
        }
        return null;
    } catch (error) {
        console.error('Error fetching movie certifications:', error);
        return null;
    }
};

export const getMovie = async (genreId, callback) => {
    const storedMovies = JSON.parse(localStorage.getItem("recentMovies")) || [];
    const tenMinutesAgo = Date.now() - 10 * 60 * 1000; // Changed to 10 minutes
    const recentMovieIds = storedMovies.filter(movie => movie.timestamp > tenMinutesAgo).map(movie => movie.id);

    const pagesToFetch = 15; // Number of pages to fetch
    let allMovies = [];

    for (let page = 1; page <= pagesToFetch; page++) {
        const movies = await fetchMovies(genreId, page);
        allMovies = allMovies.concat(movies);
    }

    console.log('All movies fetched:', allMovies);

    const filteredMovies = allMovies.filter(movie => !recentMovieIds.includes(movie.id));

    console.log('Filtered movies:', filteredMovies);

    if (filteredMovies.length === 0) {
        console.warn('All movies are in the recent movies list or no movies found.');
        callback(null);
        return;
    }

    for (let movie of filteredMovies) {
        const details = await fetchMovieDetails(movie.id);
        const certification = await fetchCertification(movie.id);

        if (
            details &&
            details.production_countries.some(country => country.iso_3166_1 === 'US') &&
            (certification === 'PG-13' || certification === 'R' || certification === 'NC-17')
        ) {
            callback(details);
            return;
        }
    }

    console.warn('No available movies from the US with a suitable rating found.');
    callback(null);
};

export const addRecentMovie = (movie) => {
    const recentMovies = JSON.parse(localStorage.getItem("recentMovies")) || [];
    recentMovies.push({ id: movie.id, timestamp: Date.now() });
    localStorage.setItem("recentMovies", JSON.stringify(recentMovies.filter(movie => Date.now() - movie.timestamp <= 10 * 60 * 1000))); // Changed to 10 minutes
};

// Event listener to handle dropdown selection
document.querySelectorAll('.dropdown-item').forEach(item => {
    item.addEventListener('click', event => {
        const genreId = event.target.getAttribute('data-value');
        console.log('Genre selected:', genreId);
        getMovie(genreId, movie => {
            if (movie) {
                // Handle movie display here
                console.log('Movie received:', movie);
            } else {
                console.log('No movie found');
            }
        });
    });
});
















