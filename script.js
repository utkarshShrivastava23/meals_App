const searchBox = document.querySelector(".search-bar");
const searchBtn = document.querySelector(".search-btn");
const recipeContainer = document.querySelector(".recipe-container");
const recipeHeading = document.querySelector(".recipe-section-title");
const favouritesBtn = document.querySelector(".favourites");
const recipeDetailsContent = document.querySelector(".recipe-details");
const recipeCloseBtn = document.querySelector(".recipe-detail-close-btn");
const favouritesSection = document.querySelector(".fa-bars");
const favouritesDisplaySection = document.querySelector(".display-favourites-container")

searchBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const searchInput = searchBox.value.trim();
    console.log(searchInput);

    fetchRecipes(searchInput);
});
var count = 0;
const fetchRecipes = async (query) => {
   
    if (!query) {
        recipeHeading.innerHTML = "Enter Valid search..."
    } else {
        try {
            recipeHeading.innerHTML = "Fetching Results...";
            const data = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
            const response = await data.json();
            recipeHeading.innerHTML = " Your Search results:"
            response.meals.forEach(meal => {
                const recipeDiv = document.createElement("div");
                recipeDiv.classList.add("recipe");
                recipeDiv.innerHTML =
                    `<img src="${meal.strMealThumb}">
            <h3 class="mealName">${meal.strMeal}</h3>`
                var functions = document.createElement("div");
                functions.classList.add("functions");
                const button = document.createElement("button");
                button.classList.add("details");
                button.textContent = "More Details"
                functions.appendChild(button);
                // const favouritesBtn = document.createElement("button");
                // favouritesBtn.classList.add("favourites");
                // favouritesBtn.classList.add("inactive");
                // favouritesBtn.setAttribute("id", `${count}`);
                // favouritesBtn.innerHTML = `<i class="fa-regular fa-heart" id="${count++}"></i>`
                // functions.appendChild(favouritesBtn)
                recipeDiv.appendChild(functions);
                recipeContainer.appendChild(recipeDiv);

                button.addEventListener("click", () => {
                    openRecipePopup(meal);
                });

            });
        } catch (error) {
            recipeHeading.innerHTML = "Error getting results..."
        }
    }
}
favouritesSection.addEventListener("click", () => {
    var elementId = favouritesSection.getAttribute("id");
    if (elementId == "inactive") {
        favouritesSection.setAttribute("id", "active");
        favouritesDisplaySection.style.display = "block";
    } else {
        var closeFavouriteBtn = document.getElementsByClassName(".favouriteCloseBtn");
        closeFavouriteBtn.addEventListener("click", () => {
            favouritesSection.setAttribute("id", "inactive");
            favouritesDisplaySection.style.display = "none";
        })
    }
})

const fetchIngredients = (meal) => {
    let ingredientList = "";
    for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        if (ingredient) {
            const measure = meal[`strMeasure${i}`];
            ingredientList += `<li>${measure} ${ingredient}</li>`
        } else {
            break
        }
    }
    return ingredientList;
}
const openRecipePopup = (meal) => {
    recipeDetailsContent.innerHTML = `
        <h2 class="recipeName">${meal.strMeal}</h2>
        <h3>Ingredients:</h3>
        <ul class="ingredientList">${fetchIngredients(meal)}</ul>
        <div>
            <h3>Instructions:</h3>
            <p class="recipeInstructions">${meal.strInstructions}</p>
        </div>
    `
    recipeDetailsContent.parentElement.style.display = "block";

}

recipeCloseBtn.addEventListener("click", () => {
    recipeDetailsContent.parentElement.style.display = "none";
})

searchBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const searchInput = searchBox.value.trim();
    fetchRecipes(searchInput);
});


