const apiKey = '535b82486819425b363ecd51e605db3c';
const apiUrl = 'https://api.themoviedb.org'; //chabnge this

// Example endpoint to get a list of movies
const endpoint = `${apiUrl}/movies`;

// Constructing the request URL with API key
const requestUrl = `${endpoint}?api_key=${apiKey}`;

// Making a GET request using fetch API
fetch(requestUrl)
  .then(response => {
    // Check if the response is successful (status code 200)
    if (response.ok) {
      // Parse the JSON response
      return response.json();
    }
    // If response is not successful, throw an error
    throw new Error('Network response was not ok.');
  })
  .then(data => {
    // Do something with the data
    console.log(data);
  })
  .catch(error => {
    // Handle errors
    console.error('There was a problem with the fetch operation:', error);
  });
