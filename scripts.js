document.addEventListener('DOMContentLoaded', () => {
    const mealForm = document.getElementById('meal-form');
    const mealList = document.getElementById('meal-list');
    const shoppingList = document.getElementById('shopping-list');

    mealForm.addEventListener('submit', function(event) {
        event.preventDefault();
        addMeal();
    });

    function addMeal() {
        const mealName = document.getElementById('meal-name').value;
        const mealTime = document.getElementById('meal-time').value;
        const ingredients = document.getElementById('ingredients').value.split(',');

        const meal = {
            name: mealName,
            time: mealTime,
            ingredients: ingredients
        };

        // Save meal to localStorage
        saveMeal(meal);

        // Display the meal on the planner
        displayMeal(meal);
    }

    function saveMeal(meal) {
        let meals = JSON.parse(localStorage.getItem('meals')) || [];
        meals.push(meal);
        localStorage.setItem('meals', JSON.stringify(meals));
    }

    function displayMeal(meal) {
        const listItem = document.createElement('li');
        listItem.textContent = `${meal.name} (${meal.time}) - ${meal.ingredients.join(', ')}`;
        mealList.appendChild(listItem);
    }

    // Load meals on page load
    loadMeals();

    function loadMeals() {
        const meals = JSON.parse(localStorage.getItem('meals')) || [];
        meals.forEach(displayMeal);
    }

    // Generate shopping list
    generateShoppingList();

    function generateShoppingList() {
        const meals = JSON.parse(localStorage.getItem('meals')) || [];
        const allIngredients = meals.flatMap(meal => meal.ingredients);
        const uniqueIngredients = [...new Set(allIngredients)];

        uniqueIngredients.forEach(ingredient => {
            const listItem = document.createElement('li');
            listItem.textContent = ingredient;
            shoppingList.appendChild(listItem);
        });
    }
});
