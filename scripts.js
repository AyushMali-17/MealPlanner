document.addEventListener('DOMContentLoaded', function () {
    const mealForm = document.getElementById('meal-form');
    const mealList = document.getElementById('meal-list');
    const searchMealInput = document.getElementById('search-meal');
    const filterCategory = document.getElementById('filter-category');
    const sortMealsButton = document.getElementById('sort-meals');
    const toggleDarkModeButton = document.getElementById('toggle-dark-mode');

    let meals = [];

    mealForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const mealData = getFormData();
        addMeal(mealData);
        saveMeals();
        clearForm();
        updateMealStatistics();
    });

    mealList.addEventListener('dragover', handleDragOver);
    mealList.addEventListener('drop', handleDrop);

    searchMealInput.addEventListener('input', filterAndDisplayMeals);
    filterCategory.addEventListener('change', filterAndDisplayMeals);
    sortMealsButton.addEventListener('click', sortMeals);

    toggleDarkModeButton.addEventListener('click', toggleDarkMode);

    function getFormData() {
        return {
            name: document.getElementById('meal-name').value,
            time: document.getElementById('meal-time').value,
            category: document.getElementById('meal-category').value,
            calories: parseInt(document.getElementById('calories').value),
            protein: parseInt(document.getElementById('protein').value),
            carbs: parseInt(document.getElementById('carbs').value),
            fats: parseInt(document.getElementById('fats').value),
            ingredients: document.getElementById('ingredients').value.split(',').map(i => i.trim()),
        };
    }

    function addMeal(mealData) {
        meals.push(mealData);
        displayMeals();
    }

    function displayMeals() {
        mealList.innerHTML = '';
        meals.forEach((meal, index) => {
            const mealItem = document.createElement('li');
            mealItem.draggable = true;
            mealItem.innerHTML = `
                <span>${meal.name} (${meal.category}) - ${meal.time}</span>
                <button onclick="editMeal(${index})">Edit</button>
                <button onclick="deleteMeal(${index})">Delete</button>
            `;
            mealItem.addEventListener('dragstart', handleDragStart);
            mealItem.addEventListener('dragend', handleDragEnd);
            mealList.appendChild(mealItem);
        });
    }

    function saveMeals() {
        localStorage.setItem('meals', JSON.stringify(meals));
    }

    function loadMeals() {
        const savedMeals = localStorage.getItem('meals');
        if (savedMeals) {
            meals = JSON.parse(savedMeals);
            displayMeals();
            updateMealStatistics();
        }
    }

    function clearForm() {
        mealForm.reset();
    }

    function deleteMeal(index) {
        if (confirm('Are you sure you want to delete this meal?')) {
            meals.splice(index, 1);
            saveMeals();
            displayMeals();
            updateMealStatistics();
        }
    }

    function editMeal(index) {
        const meal = meals[index];
        document.getElementById('meal-name').value = meal.name;
        document.getElementById('meal-time').value = meal.time;
        document.getElementById('meal-category').value = meal.category;
        document.getElementById('calories').value = meal.calories;
        document.getElementById('protein').value = meal.protein;
        document.getElementById('carbs').value = meal.carbs;
        document.getElementById('fats').value = meal.fats;
        document.getElementById('ingredients').value = meal.ingredients.join(', ');
        deleteMeal(index);
    }

    function filterAndDisplayMeals() {
        const searchTerm = searchMealInput.value.toLowerCase();
        const category = filterCategory.value;
        const filteredMeals = meals.filter(meal => {
            const matchesName = meal.name.toLowerCase().includes(searchTerm);
            const matchesCategory = category === 'All' || meal.category === category;
            return matchesName && matchesCategory;
        });
        displayFilteredMeals(filteredMeals);
    }

    function displayFilteredMeals(filteredMeals) {
        mealList.innerHTML = '';
        filteredMeals.forEach((meal, index) => {
            const mealItem = document.createElement('li');
            mealItem.draggable = true;
            mealItem.innerHTML = `
                <span>${meal.name} (${meal.category}) - ${meal.time}</span>
                <button onclick="editMeal(${index})">Edit</button>
                <button onclick="deleteMeal(${index})">Delete</button>
            `;
            mealItem.addEventListener('dragstart', handleDragStart);
            mealItem.addEventListener('dragend', handleDragEnd);
            mealList.appendChild(mealItem);
        });
    }

    function sortMeals() {
        meals.sort((a, b) => a.name.localeCompare(b.name));
        displayMeals();
    }

    function updateMealStatistics() {
        let totalCalories = 0;
        let totalProtein = 0;
        let totalCarbs = 0;
        let totalFats = 0;

        meals.forEach(meal => {
            totalCalories += meal.calories;
            totalProtein += meal.protein;
            totalCarbs += meal.carbs;
            totalFats += meal.fats;
        });

        document.getElementById('total-calories').textContent = totalCalories;
        document.getElementById('total-protein').textContent = totalProtein;
        document.getElementById('total-carbs').textContent = totalCarbs;
        document.getElementById('total-fats').textContent = totalFats;
    }

    function handleDragStart(event) {
        event.target.classList.add('dragging');
    }

    function handleDragOver(event) {
        event.preventDefault();
        const afterElement = getDragAfterElement(mealList, event.clientY);
        const draggingElement = document.querySelector('.dragging');
        if (afterElement == null) {
            mealList.appendChild(draggingElement);
        } else {
            mealList.insertBefore(draggingElement, afterElement);
        }
    }

    function handleDrop() {
        const draggingElement = document.querySelector('.dragging');
        draggingElement.classList.remove('dragging');
        saveMeals(); // Save the updated order
    }

    function handleDragEnd() {
        const draggingElement = document.querySelector('.dragging');
        if (draggingElement) {
            draggingElement.classList.remove('dragging');
        }
    }

    function getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('li:not(.dragging)')];
        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    function toggleDarkMode() {
        document.body.classList.toggle('dark-mode');
        const isDarkMode = document.body.classList.contains('dark-mode');
        localStorage.setItem('darkMode', isDarkMode);
        toggleDarkModeButton.textContent = isDarkMode ? 'Light Mode' : 'Dark Mode';
    }

    function loadDarkModeSetting() {
        const darkModeSetting = localStorage.getItem('darkMode');
        if (darkModeSetting === 'true') {
            document.body.classList.add('dark-mode');
            toggleDarkModeButton.textContent = 'Light Mode';
        } else {
            toggleDarkModeButton.textContent = 'Dark Mode';
        }
    }

    // Load meals and dark mode setting from local storage on page load
    loadMeals();
    loadDarkModeSetting();
});
