const apiKey = "c7df8f94e93761c777c141b65c987c3e";
const apiUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&with_original_language=en`;

// Function to fetch Action movies (genre ID 28) for multiple pages
const fetchActionMoviesByPages = async (startPage, endPage) => {
    try {
        // Set to store processed movie IDs
        let processedMovieIds = new Set();

        for (let page = startPage; page <= endPage; page++) {
            const pageUrl = `${apiUrl}&page=${page}&with_genres=28`;
            const response = await fetch(pageUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();

            // Filter results to include only movies with genre ID 28 (Action)
            const actionMovies = data.results.filter(movie => {
                return movie.genre_ids.includes(878) && !processedMovieIds.has(movie.id);
            });

            if (actionMovies.length > 0) {
                console.log(`Page ${page} action movies:`, actionMovies);

                // Update processed movie IDs set
                actionMovies.forEach(movie => {
                    processedMovieIds.add(movie.id);
                });

                // Post the filtered results for Action movies
                const postersSection = document.createElement('div');
                postersSection.classList.add('movie-posters'); // Add a class for styling
                document.body.appendChild(postersSection);

                actionMovies.forEach(movie => {
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
                console.error(`No new action movies found on page ${page}.`);
            }
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

// Sample usage to fetch pages 1 to 10 for Action genre only
fetchActionMoviesByPages(1, 15);