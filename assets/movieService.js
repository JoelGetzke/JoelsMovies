const apiKey = "c7df8f94e93761c777c141b65c987c3e";

const fetchMovies = async (genreId, page) => {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${genreId}&vote_average.gte=7.8&vote_average.lte=10&page=${page}`);
        const data = await response.json();
        return data.results || [];
    } catch (error) {
        console.error('Error fetching movies:', error);
        return [];
    }
};

export const getMovie = async (genreId, callback) => {
    const storedMovies = JSON.parse(localStorage.getItem("recentMovies")) || [];
    const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
    const recentMovieIds = storedMovies.filter(movie => movie.timestamp > fiveMinutesAgo).map(movie => movie.id);

    const pagesToFetch = 5; // Number of pages to fetch
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

    const movie = filteredMovies[Math.floor(Math.random() * filteredMovies.length)];
    callback(movie);
};

export const addRecentMovie = (movie) => {
    const recentMovies = JSON.parse(localStorage.getItem("recentMovies")) || [];
    recentMovies.push({ id: movie.id, timestamp: Date.now() });
    localStorage.setItem("recentMovies", JSON.stringify(recentMovies.filter(movie => Date.now() - movie.timestamp <= 5 * 60 * 1000)));
};








