import { apiKey, apiUrl} from './api.js';

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



  
