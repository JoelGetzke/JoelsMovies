const apiKey = "c7df8f94e93761c777c141b65c987c3e";
const allGenres = [28, 12, 16, 35, 80, 99, 18, 10751, 14, 36, 27, 10402, 9648, 10749, 878, 10770, 53, 10752, 37];
const excludedGenres = [99, 10751, 36]; // Example genres to exclude (Documentary, Family, History)
const minVotes = 300; // Set a threshold for the minimum number of votes to consider a movie professional

const fetchMovies = async (genreId, page) => {
    try {
        const genreParam = genreId === "AllMovies" ? excludedGenres.join(',') : genreId;
        const url = genreId === "AllMovies" ?
            `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&without_genres=${genreParam}&vote_average.gte=7.1&vote_average.lte=10.0&page=${page}&primary_release_date.gte=1994-01-01` :
            `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${genreParam}&vote_average.gte=7.1&vote_average.lte=10.0&page=${page}&primary_release_date.gte=1994-01-01`;
        console.log(`Fetching movies with URL: ${url}`);
        const response = await fetch(url);
        console.log(`Response status: ${response.status}`);
        const data = await response.json();
        console.log(`Fetched ${data.results.length} movies from page ${page}`);
        return data.results || [];
    } catch (error) {
        console.error('Error fetching movies:', error);
        return [];
    }
};

const fetchMovieDetails = async (movieId) => {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching movie details:', error);
        return null;
    }
};

const fetchCertification = async (movieId) => {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/release_dates?api_key=${apiKey}`);
        const data = await response.json();
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

// Fisher-Yates shuffle algorithm
const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

const fetchAllMovies = async (genreId, pagesToFetch) => {
    const promises = [];
    for (let page = 1; page <= pagesToFetch; page++) {
        promises.push(fetchMovies(genreId, page));
    }
    const results = await Promise.all(promises);
    return results.flat();
};

export const getMovie = async (genreId, callback) => {
    const storedMovies = JSON.parse(localStorage.getItem("recentMovies")) || [];
    const tenMinutesAgo = Date.now() - 10 * 60 * 1000; // Changed to 10 minutes
    const recentMovieIds = storedMovies.filter(movie => movie.timestamp > tenMinutesAgo).map(movie => movie.id);

    const pagesToFetch = genreId === "AllMovies" ? 125 : 175;
    let allMovies = await fetchAllMovies(genreId, pagesToFetch);

    allMovies = shuffleArray(allMovies);

    const filteredMovies = allMovies.filter(movie => !recentMovieIds.includes(movie.id) && movie.vote_count >= minVotes);

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
document.querySelectorAll('.btn-group .dropdown-item').forEach(item => {
    item.addEventListener('click', event => {
        const genreId = event.target.getAttribute('data-value');
        console.log(`Selected genre ID: ${genreId}`); // Log the selected genre ID for debugging
        getMovie(genreId, movie => {
            if (movie) {
                // Handle movie display here
                console.log(movie);
            } else {
                console.log('No movie found');
            }
        });
    });
});






















