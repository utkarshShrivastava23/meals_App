// Requirements
const searchInput = document.querySelector("#searchInput");
const searchBtn = document.querySelector("#search-btn");
const state = document.querySelector("#present-status")
const recipeContainer = document.querySelector(".recipe-display-section");
const viewDetailsBtn = document.querySelector(".view-button");
const addToFavouritesBtn = document.querySelector(".addToFavouritesBtn");
const recipeDetailsContent = document.querySelector(".recipe-details");
const recipeCloseBtn = document.querySelector(".recipe-close-btn");
const favouritesStorage = [];
const favouriteCloseBtn = document.querySelector(".favourites-close-btn");
const favouritesSection = document.querySelector(".favourites-section");
const favouritesOpenBtn = document.querySelector("#open-favourites-btn");
const favouritesDisplaySection = document.querySelector(".favourites-display-section");

// Serach Keyword
searchBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const searchKey = searchInput.value.trim();
    if (!searchKey) {
        state.innerHTML = `<p id="present-status">Type the meal in the search box...</p>`
        return;
    }
    fetchRecipes(searchKey);
});

// Fetch Recipes
const fetchRecipes = async (query) => {
    state.innerHTML = `<p id="present-status">Fetching Recipes...</p>`
    try {
        const data = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
        const response = await data.json();
        state.innerHTML = `<p id="present-status">Search Results...</p>`
        var value = 0;
        recipeContainer.innerHTML = "";
        response.meals.forEach(meal => {
            const recipeDiv = document.createElement('div');
            recipeDiv.classList.add("recipe");
            recipeDiv.setAttribute("id", `recipe${value}`);
            recipeDiv.innerHTML = `
            <img src="${meal.strMealThumb}">
            <h3>${meal.strMeal}</h3>
            <p>${meal.strArea}</p>
            <p>${meal.strCategory}</p>
        `

            const functionSection = document.createElement('div');
            functionSection.classList.add("functions");

            const viewDetailsBtn = document.createElement('button');
            viewDetailsBtn.textContent = "View Details"
            viewDetailsBtn.classList.add("view-button")
            functionSection.appendChild(viewDetailsBtn);
            viewDetailsBtn.addEventListener('click', () => {
                openRecipePopup(meal);
            });

            const addToFavouritesBtn = document.createElement("i");
            addToFavouritesBtn.classList.add("fa-heart");
            addToFavouritesBtn.classList.add("fa-regular");
            addToFavouritesBtn.setAttribute("id", `${meal.idMeal}`);

            addToFavouritesBtn.addEventListener('click', () => {
                var className = document.getElementById(`${meal.idMeal}`).className;
                console.log(className);
                if (className == "fa-heart fa-regular") {
                    addToFavouritesBtn.classList.remove("fa-regular");
                    addToFavouritesBtn.classList.add("fa-solid");
                    addToFavourites(meal);
                } else {
                    addToFavouritesBtn.classList.remove("fa-solid");
                    addToFavouritesBtn.classList.add("fa-regular");
                    removeFromFavourites(meal.idMeal);
                }
            })
            functionSection.appendChild(addToFavouritesBtn);
            recipeDiv.appendChild(functionSection);
            recipeContainer.appendChild(recipeDiv);
            value++;
        });
    } catch (error) {
        state.innerHTML = `<p id="present-status">Error in fetching recipes...</p>`
    }
}

// Fetch Ingredients
const fetchIngredients = (meal) => {
    let ingredientList = "";
    for (let i = 1; i <= 20; i < i++) {
        const ingredient = meal[`strIngredient${i}`];
        if (ingredient) {
            const measure = meal[`strMeasure${i}`];
            ingredientList += `<li>${measure} ${ingredient}</li>`
        } else {
            break;
        }
    }
    return ingredientList;
}

// Open Recipe Details Popup
const openRecipePopup = (meal) => {
    recipeDetailsContent.innerHTML = `
        <h2 class="recipeName">${meal.strMeal}</h2>
        <h3>Ingredients:</h3>
        <ul class="ingredientsList">
            ${fetchIngredients(meal)}
        </ul>
        <div>
            <h3>Instructions:</h3>
            <p class="instructions">
                ${meal.strInstructions}
            </p>
        </div>
    `

    recipeDetailsContent.parentElement.style.display = "block";
}
// Recipe Detail Close Button
recipeCloseBtn.addEventListener('click', () => {
    recipeDetailsContent.parentElement.style.display = "none";
})

// Close Favourite Section
favouriteCloseBtn.addEventListener('click', () => {
    favouritesSection.style.display = "none";
})

// Open Favourite Section
favouritesOpenBtn.addEventListener('click', () => {
    favouritesSection.style.display = "block";
})

// Add to Favourites Section
const addToFavourites = (meal) => {
    var object = {
        index: favouritesStorage.length,
        id: meal.idMeal,
        mealDetails: meal
    };
    favouritesStorage.push(object);
    loadFavourites(favouritesStorage);
}

// Remove from favourites section
const removeFromFavourites = (query) => {
    var startIndex = 0;
    favouritesStorage.forEach(element => {
        if (element.id == query) {
            favouritesStorage.splice(element.index, 1);
            startIndex = element.index;
        }
    });

    for (i = startIndex; i < favouritesStorage.length; i++) {
        favouritesStorage[i].index = favouritesStorage[i].index - 1;
    }
    loadFavourites(favouritesStorage);

    document.getElementById(query).classList.remove("fa-solid");
    document.getElementById(query).classList.add("fa-regular");

}

// Display Favourites Section
const loadFavourites = (array) => {
    if (array.length == 0) {
        favouritesDisplaySection.innerHTML = `
            <p>No item added</p>
        `;
    } else {
        favouritesDisplaySection.innerHTML = "";

        array.forEach(meal => {
            const favouriteDiv = document.createElement('div');
            favouriteDiv.classList.add("favourite");
            favouriteDiv.innerHTML = `
                <img src="${meal.mealDetails.strMealThumb}">
                <h3>${meal.mealDetails.strMeal}</h3>
                <p>${meal.mealDetails.strArea}</p>
                <p>${meal.mealDetails.strCategory}</p>
            `

            const viewFavouriteDetailBtn = document.createElement('button');
            viewFavouriteDetailBtn.textContent = "View Details"
            viewFavouriteDetailBtn.classList.add("view-button")
            favouriteDiv.appendChild(viewFavouriteDetailBtn);
            viewFavouriteDetailBtn.addEventListener('click', () => {
                openRecipePopup(meal.mealDetails);
            });

            const removeFavouriteBtn = document.createElement('button');
            removeFavouriteBtn.textContent = "remove from favourite";
            removeFavouriteBtn.classList.add("remove-btn");
            favouriteDiv.appendChild(removeFavouriteBtn);
            removeFavouriteBtn.addEventListener("click", () => {
                removeFromFavourites(meal.id);
            });

            favouritesDisplaySection.appendChild(favouriteDiv)
        });


    }
}