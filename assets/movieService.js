const apiKey = "c7df8f94e93761c777c141b65c987c3e";

const fetchMovies = async (genreId, page) => {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${genreId}&vote_average.gte=7.8&vote_average.lte=10&page=${page}&primary_release_date.gte=1994-01-01`);
        const data = await response.json();
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

export const getMovie = async (genreId, callback) => {
    const storedMovies = JSON.parse(localStorage.getItem("recentMovies")) || [];
    const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
    const recentMovieIds = storedMovies.filter(movie => movie.timestamp > fiveMinutesAgo).map(movie => movie.id);

    const pagesToFetch = 20; // Number of pages to fetch
    let allMovies = [];

    for (let page = 1; page <= pagesToFetch; page++) {
        const movies = await fetchMovies(genreId, page);
        allMovies = allMovies.concat(movies);
    }

    const filteredMovies = allMovies.filter(movie => !recentMovieIds.includes(movie.id));

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
    localStorage.setItem("recentMovies", JSON.stringify(recentMovies.filter(movie => Date.now() - movie.timestamp <= 5 * 60 * 1000)));
};












