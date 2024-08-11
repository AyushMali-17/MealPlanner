document.addEventListener('DOMContentLoaded', () => {
    const mealForm = document.getElementById('meal-form');
    const mealList = document.getElementById('meal-list');
    const searchMealInput = document.getElementById('search-meal');
    const clearAllBtn = document.getElementById('clear-all-meals');
    const toggleDarkModeBtn = document.getElementById('toggle-dark-mode');

    let isDarkMode = false;

    mealForm.addEventListener('submit', function(event) {
        event.preventDefault();
        addMeal();
    });

    searchMealInput.addEventListener('input', function() {
        const searchTerm = searchMealInput.value.toLowerCase();
        const meals = document.querySelectorAll('#meal-list li');
        meals.forEach(meal => {
            const mealName = meal.querySelector('.meal-name').textContent.toLowerCase();
            if (mealName.includes(searchTerm)) {
                meal.style.display = '';
            } else {
                meal.style.display = 'none';
            }
        });
    });

    clearAllBtn.addEventListener('click', clearAllMeals);

    toggleDarkModeBtn.addEventListener('click', () => {
        isDarkMode = !isDarkMode;
        document.body.classList.toggle('dark-mode', isDarkMode);
        const meals = document.querySelectorAll('#meal-list li');
        meals.forEach(meal => meal.classList.toggle('dark-mode', isDarkMode));
    });

    mealList.addEventListener('dragstart', handleDragStart);
    mealList.addEventListener('dragover', handleDragOver);
    mealList.addEventListener('drop', handleDrop);
    mealList.addEventListener('dragend', handleDragEnd);

    function addMeal() {
        const mealName = document.getElementById('meal-name').value;
        const mealTime = document.getElementById('meal-time').value;
        const mealCategory = document.getElementById('meal-category').value;
        const calories = parseInt(document.getElementById('calories').value);
        const protein = parseInt(document.getElementById('protein').value);
        const carbs = parseInt(document.getElementById('carbs').value);
        const fats = parseInt(document.getElementById('fats').value);
        const ingredients = document.getElementById('ingredients').value.split(',');

        const meal = {
            name: mealName,
            time: mealTime,
            category: mealCategory,
            calories,
            protein,
            carbs,
            fats,
            ingredients
        };

        saveMeal(meal);
        displayMeal(meal);
        updateMealStatistics();
        mealForm.reset();
    }

    function displayMeal(meal) {
        const mealItem = document.createElement('li');
        mealItem.draggable = true;
        mealItem.innerHTML = `
            <span class="meal-name">${meal.name}</span>
            <span class="meal-time">${meal.time}</span>
            <span class="meal-category">${meal.category}</span>
            <span class="meal-nutrition">Calories: ${meal.calories} | Protein: ${meal.protein}g | Carbs: ${meal.carbs}g | Fats: ${meal.fats}g</span>
            <span class="meal-ingredients">${meal.ingredients.join(', ')}</span>
            <button class="delete-meal">Delete</button>
        `;
        mealList.appendChild(mealItem);

        const deleteBtn = mealItem.querySelector('.delete-meal');
        deleteBtn.addEventListener('click', () => {
            mealItem.remove();
            updateMealStatistics();
            saveAllMeals();
        });
    }

    function saveMeal(meal) {
        const meals = JSON.parse(localStorage.getItem('meals')) || [];
        meals.push(meal);
        localStorage.setItem('meals', JSON.stringify(meals));
    }

    function saveAllMeals() {
        const meals = [];
        const mealItems = document.querySelectorAll('#meal-list li');
        mealItems.forEach(item => {
            const meal = {
                name: item.querySelector('.meal-name').textContent,
                time: item.querySelector('.meal-time').textContent,
                category: item.querySelector('.meal-category').textContent,
                calories: parseInt(item.querySelector('.meal-nutrition').textContent.split('|')[0].split(': ')[1]),
                protein: parseInt(item.querySelector('.meal-nutrition').textContent.split('|')[1].split(': ')[1]),
                carbs: parseInt(item.querySelector('.meal-nutrition').textContent.split('|')[2].split(': ')[1]),
                fats: parseInt(item.querySelector('.meal-nutrition').textContent.split('|')[3].split(': ')[1]),
                ingredients: item.querySelector('.meal-ingredients').textContent.split(', ')
            };
            meals.push(meal);
        });
        localStorage.setItem('meals', JSON.stringify(meals));
    }

    function clearAllMeals() {
        localStorage.removeItem('meals');
        while (mealList.firstChild) {
            mealList.removeChild(mealList.firstChild);
        }
        updateMealStatistics();
    }

    function loadMeals() {
        const meals = JSON.parse(localStorage.getItem('meals')) || [];
        meals.forEach(meal => displayMeal(meal));
        updateMealStatistics();
    }

    function updateMealStatistics() {
        const meals = JSON.parse(localStorage.getItem('meals')) || [];
        const totalCalories = meals.reduce((total, meal) => total + meal.calories, 0);
        const totalProtein = meals.reduce((total, meal) => total + meal.protein, 0);
        const totalCarbs = meals.reduce((total, meal) => total + meal.carbs, 0);
        const totalFats = meals.reduce((total, meal) => total + meal.fats, 0);

        document.getElementById('total-calories').textContent = totalCalories;
        document.getElementById('total-protein').textContent = totalProtein;
        document.getElementById('total-carbs').textContent = totalCarbs;
        document.getElementById('total-fats').textContent = totalFats;
    }

    function handleDragStart(e) {
        e.target.classList.add('dragging');
    }

    function handleDragOver(e) {
        e.preventDefault();
        const draggingItem = document.querySelector('.dragging');
        const closestItem = [...mealList.children].find(child => {
            return e.clientY < child.offsetTop + child.offsetHeight / 2;
        });

        if (closestItem) {
            mealList.insertBefore(draggingItem, closestItem);
        } else {
            mealList.appendChild(draggingItem);
        }
    }

    function handleDrop() {
        document.querySelector('.dragging').classList.remove('dragging');
        saveAllMeals();
    }

    function handleDragEnd() {
        document.querySelector('.dragging').classList.remove('dragging');
    }

    loadMeals();
});
