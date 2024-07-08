const apiKey = "c7df8f94e93761c777c141b65c987c3e";
const apiUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=en-US&with_original_language=en`;


// Function to fetch English movies for multiple pages
const fetchEnglishMoviesByPages = async (startPage, endPage) => {
    try {
        // Set to store processed movie IDs
        let processedMovieIds = new Set();

        for (let page = startPage; page <= endPage; page++) {
            const pageUrl = `${apiUrl}&page=${page}`;
            const response = await fetch(pageUrl);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            // Filter results to exclude already processed movies (if necessary)
            const filteredMovies = data.results.filter(movie => {
                return !processedMovieIds.has(movie.id);
            });

            if (filteredMovies.length > 0) {
                console.log(`Page ${page} English movies:`, filteredMovies);

                // Update processed movie IDs set
                filteredMovies.forEach(movie => {
                    processedMovieIds.add(movie.id);
                });

                // Post the filtered results for the movies
                const postersSection = document.createElement('div');
                postersSection.classList.add('movie-posters'); // Add a class for styling
                document.body.appendChild(postersSection);

                filteredMovies.forEach(movie => {
                    const img = document.createElement('img');
                    img.src = `https://image.tmdb.org/t/p/w200${movie.poster_path}`;
                    img.alt = movie.title;
                    img.id = `movie-${movie.id}`;
                    img.classList.add('movie-poster'); // Add a class for styling

                    img.addEventListener('click', () => {
                        const movieDetailsURL = `../assets/movie-details.html?id=${movie.id}`;
                        window.location.href = movieDetailsURL;
                    });

                    postersSection.appendChild(img);
                });
            } else {
                console.error(`No new English movies found on page ${page}.`);
            }
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

// Sample usage to fetch pages 1 to 5 for English movies
fetchEnglishMoviesByPages(1, 20);


