// Minimalist Dark To Do List Logic
document.addEventListener('DOMContentLoaded', () => {
    // 1. Elements selection
    const todoForm = document.getElementById('todo-form');
    const todoInput = document.getElementById('todo-input');
    const todoList = document.getElementById('todo-list');
    const totalCountEl = document.getElementById('total-count');
    const completedCountEl = document.getElementById('completed-count');
    const itemsLeftEl = document.getElementById('items-left');
    const clearCompletedBtn = document.getElementById('clear-completed');
    const filterButtons = document.querySelectorAll('.filter-btn');

    // 2. State definition (Loads from localStorage)
    let todos = JSON.parse(localStorage.getItem('day5_todos')) || [];
    let currentFilter = 'all'; // 'all' | 'active' | 'completed'

    // 3. Save to LocalStorage helper
    const saveToLocalStorage = () => {
        localStorage.setItem('day5_todos', JSON.stringify(todos));
    };

    // 4. Update Statistics counter UI
    const updateStats = () => {
        const total = todos.length;
        const completed = todos.filter(t => t.completed).length;
        const active = total - completed;

        totalCountEl.textContent = total;
        completedCountEl.textContent = completed;
        itemsLeftEl.textContent = `${active} active left`;

        // Hide/Show Clear Completed button
        if (completed > 0) {
            clearCompletedBtn.style.visibility = 'visible';
        } else {
            clearCompletedBtn.style.visibility = 'hidden';
        }
    };

    // 5. Render list items helper
    const renderTodos = () => {
        // Clear current listing
        todoList.innerHTML = '';

        // Filter items based on current tab selection
        const filteredTodos = todos.filter(todo => {
            if (currentFilter === 'active') return !todo.completed;
            if (currentFilter === 'completed') return todo.completed;
            return true; // 'all'
        });

        // Toggle Empty state notice
        if (filteredTodos.length === 0) {
            const emptyMsg = document.createElement('div');
            emptyMsg.className = 'empty-todo-msg';
            if (currentFilter === 'active') {
                emptyMsg.textContent = 'No active tasks. Clear day!';
            } else if (currentFilter === 'completed') {
                emptyMsg.textContent = 'No completed tasks yet.';
            } else {
                emptyMsg.textContent = 'No tasks yet. Enjoy your day!';
            }
            todoList.appendChild(emptyMsg);
            updateStats();
            return;
        }

        // Build HTML components dynamically
        filteredTodos.forEach(todo => {
            const item = document.createElement('div');
            item.className = `todo-item ${todo.completed ? 'completed' : ''}`;
            item.dataset.id = todo.id;

            item.innerHTML = `
                <div class="todo-item-left">
                    <div class="todo-checkbox">
                        <svg class="check-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" 
                            stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                    </div>
                    <span class="todo-text">${escapeHtml(todo.text)}</span>
                </div>
                <button class="delete-btn" aria-label="Delete Task" title="Delete Task">
                    <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" 
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                </button>
            `;

            // Checkbox completion toggle trigger
            const checkbox = item.querySelector('.todo-checkbox');
            checkbox.addEventListener('click', () => toggleTodo(todo.id));

            // Text click also toggles checkbox for convenience
            const todoText = item.querySelector('.todo-text');
            todoText.addEventListener('click', () => toggleTodo(todo.id));

            // Delete task action trigger
            const deleteBtn = item.querySelector('.delete-btn');
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                deleteTodo(todo.id);
            });

            todoList.appendChild(item);
        });

        updateStats();
    };

    // 6. Escape inputs utility
    const escapeHtml = (text) => {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    };

    // 7. Operations logic
    const addTodo = (text) => {
        const trimmed = text.trim();
        if (trimmed === '') return;

        const newTodo = {
            id: Date.now(),
            text: trimmed,
            completed: false
        };

        todos.unshift(newTodo); // Push to the top of list
        saveToLocalStorage();
        renderTodos();
    };

    const toggleTodo = (id) => {
        todos = todos.map(t => {
            if (t.id === id) {
                return { ...t, completed: !t.completed };
            }
            return t;
        });
        saveToLocalStorage();
        renderTodos();
    };

    const deleteTodo = (id) => {
        todos = todos.filter(t => t.id !== id);
        saveToLocalStorage();
        renderTodos();
    };

    // 8. Event Listener triggers
    todoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        addTodo(todoInput.value);
        todoInput.value = ''; // Reset input field
    });

    // Clear completed tasks
    clearCompletedBtn.addEventListener('click', () => {
        todos = todos.filter(t => !t.completed);
        saveToLocalStorage();
        renderTodos();
    });

    // Filters switcher
    filterButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Remove active classes
            filterButtons.forEach(b => b.classList.remove('active'));
            // Add active to current click
            e.target.classList.add('active');
            
            currentFilter = e.target.dataset.filter;
            renderTodos();
        });
    });

    // 9. Initial Load Render
    renderTodos();
});
