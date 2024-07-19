const apiKey = 'c7df8f94e93761c777c141b65c987c3e';

document.addEventListener('DOMContentLoaded', () => {
    let selectedCategory = '';

    // Handle category selection
    document.querySelectorAll('.dropdown-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            selectedCategory = e.target.getAttribute('data-category');
            console.log(`Selected category: ${selectedCategory}`);
            // Update dropdown button text to show selected category
            document.getElementById('categoryButton').textContent = selectedCategory;
        });
    });

    // Handle "Start Watching" button click
    document.getElementById('startWatchingBtn').addEventListener('click', async (e) => {
        e.preventDefault();

        if (selectedCategory) {
            try {
                const movie = await fetchRandomTopRatedMovie(selectedCategory);
                if (movie) {
                    window.location.href = `assets/movie-details.html?id=${movie.id}`;
                } else {
                    alert('No top-rated movies found in this category.');
                }
            } catch (error) {
                console.error('Error fetching movies:', error);
                alert('Failed to fetch movies. Please try again.');
            }
        } else {
            alert('Please select a category.');
        }
    });
});

// Fetch a random top-rated movie from the selected category
async function fetchRandomTopRatedMovie(category) {
    const genreMapping = {
        Action: 28,
        Comedy: 35,
        Drama: 18,
        Fantasy: 14,
        Horror: 27,
        'Sci-Fi': 878,
        Thriller: 53,
        All: null
    };

    const genreId = genreMapping[category];

    let url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&vote_average.gte=8`;
    if (genreId) {
        url += `&with_genres=${genreId}`;
    }

    const response = await fetch(url);
    const data = await response.json();
    const topRatedMovies = data.results;

    if (topRatedMovies.length > 0) {
        const randomIndex = Math.floor(Math.random() * topRatedMovies.length);
        return topRatedMovies[randomIndex];
    }

    return null;
}



