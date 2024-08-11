document.addEventListener('DOMContentLoaded', () => {
    const mealForm = document.getElementById('meal-form');
    const mealList = document.getElementById('meal-list');
    const totalCaloriesElem = document.getElementById('total-calories');
    const totalProteinElem = document.getElementById('total-protein');
    const totalCarbsElem = document.getElementById('total-carbs');
    const totalFatsElem = document.getElementById('total-fats');
    const calorieProgressElem = document.getElementById('calorie-progress');
    const calorieProgressTextElem = document.getElementById('calorie-progress-text');
    const clearAllMealsBtn = document.getElementById('clear-all-meals');
    const searchMealInput = document.getElementById('search-meal');
    const filterCategorySelect = document.getElementById('filter-category');
    const sortMealsBtn = document.getElementById('sort-meals');
    const toggleDarkModeBtn = document.getElementById('toggle-dark-mode');
    
    let meals = [];
    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFats = 0;
    const calorieGoal = 2000; // example calorie goal

    const updateStats = () => {
        totalCaloriesElem.textContent = totalCalories;
        totalProteinElem.textContent = totalProtein;
        totalCarbsElem.textContent = totalCarbs;
        totalFatsElem.textContent = totalFats;
        const calorieProgress = Math.min(100, (totalCalories / calorieGoal) * 100);
        calorieProgressElem.style.width = `${calorieProgress}%`;
        calorieProgressTextElem.textContent = `${Math.round(calorieProgress)}%`;
    };

    const renderMeals = () => {
        mealList.innerHTML = '';
        const searchQuery = searchMealInput.value.toLowerCase();
        const filterCategory = filterCategorySelect.value;
        const filteredMeals = meals.filter(meal => {
            return (filterCategory === 'All' || meal.category === filterCategory) &&
                   meal.name.toLowerCase().includes(searchQuery);
        });
        filteredMeals.forEach(meal => {
            const li = document.createElement('li');
            li.innerHTML = `
                <div>${meal.name} (${meal.time})</div>
                <div>${meal.category} - ${meal.calories} kcal, ${meal.protein}g protein, ${meal.carbs}g carbs, ${meal.fats}g fats</div>
                <button class="btn-danger btn-icon" onclick="removeMeal('${meal.name}')"><i class="fas fa-trash-alt"></i></button>
            `;
            mealList.appendChild(li);
        });
    };

    const addMeal = (event) => {
        event.preventDefault();
        const name = document.getElementById('meal-name').value;
        const time = document.getElementById('meal-time').value;
        const category = document.getElementById('meal-category').value;
        const calories = parseFloat(document.getElementById('calories').value);
        const protein = parseFloat(document.getElementById('protein').value);
        const carbs = parseFloat(document.getElementById('carbs').value);
        const fats = parseFloat(document.getElementById('fats').value);
        const ingredients = document.getElementById('ingredients').value;

        const meal = {
            name,
            time,
            category,
            calories,
            protein,
            carbs,
            fats,
            ingredients
        };
        
        meals.push(meal);
        totalCalories += calories;
        totalProtein += protein;
        totalCarbs += carbs;
        totalFats += fats;
        
        updateStats();
        renderMeals();
        mealForm.reset();
    };

    const removeMeal = (name) => {
        meals = meals.filter(meal => meal.name !== name);
        totalCalories = meals.reduce((acc, meal) => acc + meal.calories, 0);
        totalProtein = meals.reduce((acc, meal) => acc + meal.protein, 0);
        totalCarbs = meals.reduce((acc, meal) => acc + meal.carbs, 0);
        totalFats = meals.reduce((acc, meal) => acc + meal.fats, 0);
        updateStats();
        renderMeals();
    };

    const clearAllMeals = () => {
        meals = [];
        totalCalories = 0;
        totalProtein = 0;
        totalCarbs = 0;
        totalFats = 0;
        updateStats();
        renderMeals();
    };

    mealForm.addEventListener('submit', addMeal);
    clearAllMealsBtn.addEventListener('click', clearAllMeals);
    searchMealInput.addEventListener('input', renderMeals);
    filterCategorySelect.addEventListener('change', renderMeals);
    sortMealsBtn.addEventListener('click', () => {
        meals.sort((a, b) => a.name.localeCompare(b.name));
        renderMeals();
    });
    toggleDarkModeBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
    });

    renderMeals();
});
