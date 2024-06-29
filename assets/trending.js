import { apiKey, apiUrl } from './api.js'; // Ensure these are defined in api.js


// Example endpoint to get a list of trending movies for a day
const trendingEndpoint = `${apiUrl}/3/trending/movie/day`;

// Function to fetch data for a specific page
function fetchData(pageNumber, pageSize) {
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

// Specify the desired page size and total number of pages
const pageSize = 20; // Increase this value to increase the array length
const totalPages = 1; // Increase this value to fetch more pages

// Fetch data for multiple pages
for (let i = 1; i <= totalPages; i++) {
    fetchData(i, pageSize)
        .then(data => {
            // Do something with the data for the current page
            console.log(`Data for page ${i}:`, data);
        })
        .catch(error => {
            // Handle errors
            console.error(`Error fetching data for page ${i}:`, error);
        });
}




const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/"; // Base URL for images
const IMAGE_SIZE = "w200"; // Supported image size

const getMovies = () => {
    // Fetch the data directly using fetchData function
    fetchData(1, 20)
    .then(data => {
        if (data && data.results) {
            data.results.forEach(movie => {
                // Log movie title and overview
                console.log(movie.title);
                console.log(movie.overview);
                
                // Create an img element for the movie poster
                const img = document.createElement('img');
                img.src = `${IMAGE_BASE_URL}${IMAGE_SIZE}${movie.poster_path}`; // Combine base URL, size, and poster path
                img.alt = movie.title;
                img.id = `movie-${movie.id}`; // Specific ID for the image

                // Append the image to the DOM
                document.body.appendChild(img);
            });
        } else {
            console.error("Data is not in expected format", data);
        }
    })
    .catch(error => {
        console.error("Error fetching movies:", error);
    });
}

// Sample usage - do not modify
getMovies();



  
