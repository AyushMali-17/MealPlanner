document.addEventListener('DOMContentLoaded', () => {
    const mealForm = document.getElementById('meal-form');
    const mealList = document.getElementById('meal-list');
    const searchMealInput = document.getElementById('search-meal');
    const clearAllBtn = document.getElementById('clear-all-meals');

    mealForm.addEventListener('submit', function(event) {
        event.preventDefault();
        addMeal();
    });

    searchMealInput.addEventListener('input', searchMeals);

    clearAllBtn.addEventListener('click', clearAllMeals);

    function addMeal() {
        const mealName = document.getElementById('meal-name').value;
        const mealTime = document.getElementById('meal-time').value;
        const ingredients = document.getElementById('ingredients').value.split(',');
        const category = document.getElementById('meal-category').value;

        const meal = {
            name: mealName,
            time: mealTime,
            ingredients: ingredients,
            category: category
        };

        saveMeal(meal);
        displayMeal(meal);
    }

    function saveMeal(meal) {
        let meals = JSON.parse(localStorage.getItem('meals')) || [];
        meals.push(meal);
        localStorage.setItem('meals', JSON.stringify(meals));
    }

    function displayMeal(meal) {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            ${meal.name} (${meal.time}) - ${meal.ingredients.join(', ')} [${meal.category}]
            <button class="edit-meal">Edit</button>
            <button class="delete-meal">Delete</button>
        `;

        listItem.querySelector('.edit-meal').addEventListener('click', () => editMeal(meal, listItem));
        listItem.querySelector('.delete-meal').addEventListener('click', () => deleteMeal(meal, listItem));

        mealList.appendChild(listItem);
    }

    function editMeal(meal, listItem) {
        document.getElementById('meal-name').value = meal.name;
        document.getElementById('meal-time').value = meal.time;
        document.getElementById('ingredients').value = meal.ingredients.join(', ');
        document.getElementById('meal-category').value = meal.category;

        deleteMeal(meal, listItem);
    }

    function deleteMeal(meal, listItem) {
        listItem.remove();
        let meals = JSON.parse(localStorage.getItem('meals')) || [];
        meals = meals.filter(m => m.name !== meal.name || m.time !== meal.time);
        localStorage.setItem('meals', JSON.stringify(meals));
    }

    function searchMeals() {
        const query = searchMealInput.value.toLowerCase();
        const meals = Array.from(mealList.children);

        meals.forEach(mealItem => {
            const mealName = mealItem.textContent.toLowerCase();
            if (mealName.includes(query)) {
                mealItem.style.display = 'block';
            } else {
                mealItem.style.display = 'none';
            }
        });
    }

    function clearAllMeals() {
        localStorage.removeItem('meals');
        while (mealList.firstChild) {
            mealList.removeChild(mealList.firstChild);
        }
    }

    function loadMeals() {
        const meals = JSON.parse(localStorage.getItem('meals')) || [];
        meals.forEach(meal => displayMeal(meal));
    }

    loadMeals();
});
