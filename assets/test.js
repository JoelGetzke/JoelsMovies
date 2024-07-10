document.addEventListener('DOMContentLoaded', () => {
    const apiKey = 'c7df8f94e93761c777c141b65c987c3e';
    const form = document.getElementById('search-form');
    
    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(form);
        const movieTitle = formData.get('search').trim();
        if (movieTitle === '') return; // Do nothing if search input is empty

        try {
            // Search for the movie by title
            const searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(movieTitle)}`;
            const response = await fetch(searchUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            if (data.results.length > 0) {
                const movieId = data.results[0].id; // Get the ID of the first search result
                window.location.href = `assets/movie-details.html?id=${movieId}`; // Redirect to movie-details.html with movie ID
            } else {
                console.log('No movie found with that title.');
            }
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        }
    });
});






