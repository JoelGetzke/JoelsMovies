import { apiKey } from './api.js'; // Importing apiKey from api.js

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/";
const IMAGE_SIZE = "w200";
const apiUrl = "https://api.themoviedb.org/3/movie/now_playing";

const getNowPlayingMovies = () => {
    const pageNumber = 1;
    const pageSize = 20;

    // Function to fetch data for a specific page
    const fetchData = (pageNumber, pageSize) => {
        // Constructing the request URL with the specified queries
        const nowPlayingRequestUrl = `${apiUrl}?api_key=${apiKey}&page=${pageNumber}`;

        // Making a GET request using fetch API
        return fetch(nowPlayingRequestUrl)
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Network response was not ok.');
            })
            .then(data => {
                // Filter data to include only movies with original_language "en"
                const filteredData = data.results.filter(movie => movie.original_language === "en");
                console.log(filteredData);
                return filteredData; // Ensure the filtered data is returned for further processing
            })
            .catch(error => {
                console.error('Error fetching movies:', error);
            });
    };

    // Fetch data for the specified page and size
    fetchData(pageNumber, pageSize)
        .then(data => {
            if (data && data.length > 0) {
                const postersSection = document.createElement('div');
                postersSection.classList.add('movie-posters'); // Add a class for styling

                data.forEach(movie => {
                    const img = document.createElement('img');
                    img.src = `${IMAGE_BASE_URL}${IMAGE_SIZE}${movie.poster_path}`;
                    img.alt = movie.title;
                    img.id = `movie-${movie.id}`;
                    img.classList.add('movie-poster'); // Add a class for styling

                    img.addEventListener('click', () => {
                        const movieDetailsURL = `./assets/movie-details.html?id=${movie.id}`;
                        window.location.href = movieDetailsURL;
                    });

                    postersSection.appendChild(img);
                });

                // Append the postersSection div to the body or another appropriate container
                document.body.appendChild(postersSection);
            } else {
                console.error("No movies found with original language 'en'.");
            }
        })
        .catch(error => {
            console.error("Error fetching movies:", error);
        });
};

// Sample usage - do not modify
getNowPlayingMovies();

    






