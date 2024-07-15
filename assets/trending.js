import { apiKey, apiUrl } from './api.js'; // Importing apiKey and apiUrl from api.js

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/";
const IMAGE_SIZE = "w200";

const getTrendMovies = () => {
    const trendingEndpoint = `${apiUrl}/3/trending/movie/day`;
    const pageSize = 20; // Increase this value to increase the array length

    // Function to fetch data for a specific page
    const fetchData = (pageNumber, pageSize) => {
        // Constructing the request URL with API key, page number, and page size
        const trendRequestUrl = `${trendingEndpoint}?api_key=${apiKey}&page=${pageNumber}&page_size=${pageSize}`;

        // Making a GET request using fetch API
        return fetch(trendRequestUrl)
            .then(response => {
                // Check if the response is successful (status code 200)
                if (response.ok) {
                    // Parse the JSON response
                    return response.json();
                }
                // If response is not successful, throw an error
                throw new Error('Network response was not ok.');
            });
    }

    // Fetch data for multiple pages
    fetchData(1, pageSize)
        .then(data => {
            if (data && data.results) {
                const postersSection = document.createElement('div');
                postersSection.classList.add('movie-posters'); 
                document.body.appendChild(postersSection);

                data.results.forEach(movie => {
                    const img = document.createElement('img');
                    img.src = `${IMAGE_BASE_URL}${IMAGE_SIZE}${movie.poster_path}`;
                    img.alt = movie.title;
                    img.id = `movie-${movie.id}`;
                    img.classList.add('movie-poster'); 

                    img.addEventListener('click', () => {
                        const movieDetailsURL = `./assets/movie-details.html?id=${movie.id}`;
                        window.location.href = movieDetailsURL;
                    });

                    postersSection.appendChild(img);
                });
            } else {
                console.error("Data is not in expected format", data);
            }
        })
        .catch(error => {
            console.error("Error fetching movies:", error);
        });
}

// Call the function to get trending movies
getTrendMovies();








  
