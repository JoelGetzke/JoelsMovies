// movies.js
import { getMovie } from "./movieService.js";

const categoryButton = document.querySelector("#category-button");
const startButton = document.querySelector("#start-button");
const movieDetailsContainer = document.querySelector("#movie-details-container");

let selectedCategory = "";

document.querySelectorAll(".dropdown-item").forEach(item => {
    item.addEventListener("click", (e) => {
        e.preventDefault();
        selectedCategory = e.target.dataset.value;
        categoryButton.textContent = e.target.textContent;
    });
});

startButton.addEventListener("click", () => {
    if (selectedCategory) {
        clearMovieDetails();
        getMovie(selectedCategory);
    } else {
        alert("Please select a category.");
    }
});

const clearMovieDetails = () => {
    document.getElementById('movie-img').src = "";
    document.getElementById('movie-title').textContent = "";
    document.getElementById('movie-release-date').textContent = "";
    document.getElementById('movie-vote-average').textContent = "";
    document.getElementById('movie-overview').textContent = "";
    document.getElementById('trailer-container').innerHTML = "";
};





