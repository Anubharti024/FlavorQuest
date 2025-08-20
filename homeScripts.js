
// Scripts for Home page :

document.addEventListener("DOMContentLoaded", () => {
  fetchCategories();
  fetchRandomRecipe();
});


// fetch recipes :
async function fetchRecipes() {
  const query = document.getElementById('search').value;
  if (!query) return;

  showLoader();
  const res = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${query}`);
  const data = await res.json();
  hideLoader();

  displayRecipes(data.meals);
}

// fetch categories :
async function fetchCategories() {
  showLoader();
  const res = await fetch("https://www.themealdb.com/api/json/v1/1/categories.php");
  const data = await res.json();
  hideLoader();

  const categorySelect = document.getElementById("category");
  data.categories.forEach(category => {
    const option = document.createElement("option");
    option.value = category.strCategory;
    option.textContent = category.strCategory;
    categorySelect.appendChild(option);
  });
}

// fetch recipes by category :
async function fetchByCategory() {
  const category = document.getElementById('category').value;
  if (!category) return;

  showLoader();
  const res = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`);
  const data = await res.json();
  hideLoader();

  displayRecipes(data.meals);
}



// 000000000000000000000 Display-Recipy 00000000000000000000

function displayRecipes(meals) {
  const recipesDiv = document.getElementById('recipes');
  recipesDiv.innerHTML = '';

  if (!meals || meals.length === 0) {
    recipesDiv.innerHTML = '<p>No recipes found.</p>';
    return;
  }

  meals.forEach(meal => {
    const recipe = document.createElement('div');

    recipe.classList.add('recipe');
    recipe.innerHTML = `
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
        <h3>${meal.strMeal}</h3>
        <button onclick="fetchRecipeDetails(${meal.idMeal})">View Details</button>
        <button onclick="toggleFavorite(${meal.idMeal}, '${meal.strMeal}', '${meal.strMealThumb}')">⭐</button>
      `;
    recipesDiv.appendChild(recipe);
  });
}

// fetch recipes Details by ID :
async function fetchRecipeDetails(id) {
  showLoader();
  const res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
  const data = await res.json();
  hideLoader();

  const meal = data.meals[0];

  const detailsDiv = document.getElementById("recipeDetails");
  detailsDiv.innerHTML = `
      <h2>${meal.strMeal}</h2>
      <img src="${meal.strMealThumb}" width="300">
      <p><strong>Category:</strong> ${meal.strCategory}</p>
      <p><strong>Instructions:</strong> ${meal.strInstructions}</p>
      <button onclick="closeDetails()">Close</button>
    `;
  detailsDiv.classList.remove("hidden");
}

function closeDetails() {
  document.getElementById("recipeDetails").classList.add("hidden");
}


// Fetch Random recipe :
async function fetchRandomRecipe() {
  showLoader();
  const res = await fetch("https://www.themealdb.com/api/json/v1/1/random.php");
  const data = await res.json();
  hideLoader();

  const meal = data.meals[0];
  const randomRecipeDiv = document.getElementById('randomRecipe');
  randomRecipeDiv.classList.add('recipe');
  randomRecipeDiv.innerHTML = `
      <h2>Try This Random Recipe!</h2>
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
      <h3>${meal.strMeal}</h3>
      <button onclick="fetchRecipeDetails(${meal.idMeal})">View Details</button>
    `;
}

//0000000000000000 FAVORITE FEATURE 000000000000000000

function toggleFavorite(id, name, thumb) {
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  const exists = favorites.find(f => f.id === id);

  if (exists) {
    favorites = favorites.filter(f => f.id !== id);
    alert(`${name} has been removed from favorites.`);
  } else {
    favorites.push({ id, name, thumb });
    alert(`${name} has been added to favorites.`);
  }

  localStorage.setItem("favorites", JSON.stringify(favorites));

  // Refresh if favorites section is visible
  if (document.getElementById("favoritesSection").style.display === "block") {
    showFavorites();
  }
}

// show favourites recipes :
function showFavorites() {
  const favs = JSON.parse(localStorage.getItem("favorites")) || [];
  document.getElementById("favoritesSection").style.display = "block";

  const container = document.getElementById("favoritesList");
  container.innerHTML = "";

  favs.forEach(fav => {
    const card = document.createElement("div");
    card.classList.add("recipe");
    card.innerHTML = `
        <img src="${fav.thumb}" alt="${fav.name}" width="100">
        <h3>${fav.name}</h3>
        <button onclick="fetchRecipeDetails(${fav.id})">View Details</button>
        <button onclick="removeFavorite('${fav.id}')">Remove</button>

      `;
    container.appendChild(card);
  });
}

// Remove favourite recipes :
function removeFavorite(id) {
  id = Number(id);
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  favorites = favorites.filter(f => f.id !== id);
  localStorage.setItem("favorites", JSON.stringify(favorites));
  showFavorites();
}

function closeFavorites() {
  document.getElementById("favoritesSection").style.display = "none";
}



//00000000000000 Toggal Menu 0000000000000000
function toggleMenu() {
  const navMenu = document.getElementById('navMenu');
  navMenu.classList.toggle('show');
}



//00000000000000000 Loading spinner 0000000000000

function showLoader() {
  document.getElementById("loader").classList.remove("hidden");
}
function hideLoader() {
  document.getElementById("loader").classList.add("hidden");
}


//00000000000000000 Dark Mode Toggal 000000000000000
function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
  localStorage.setItem("darkMode", document.body.classList.contains("dark-mode"));
}

// Auto-enable if it was on last time
document.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("darkMode") === "true") {
    document.body.classList.add("dark-mode");
  }
});


// Redirect to sign-in page if not logged in :
if (localStorage.getItem('isLoggedIn') !== 'true') {
  window.location.href = 'signin.html'; // replace with your actual sign-in file name
}

//  Logout function :
function logout() {
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('userEmail');
  window.location.href = 'signin.html';
}

// Logging status :
if (localStorage.getItem('isLoggedIn') !== 'true') {
  window.location.href = 'signin.html';
}


/* ------- END ------- */


