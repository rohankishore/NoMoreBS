import { supabase } from './supabase.js';

let currentUser = null;

/**
 * Load todos from Supabase
 */
async function loadTodos() {
    const todoList = document.getElementById('todoList');
    
    try {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        currentUser = user;
        
        // Fetch todos
        const { data, error } = await supabase
            .from('todos')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        // Render todos
        if (data.length === 0) {
            todoList.innerHTML = `
                <div class="text-center text-gray-400 py-8">
                    No tasks yet. Add one above!
                </div>
            `;
        } else {
            todoList.innerHTML = data.map(todo => renderTodoItem(todo)).join('');
            attachTodoEventListeners();
        }
    } catch (error) {
        console.error('Error loading todos:', error);
        todoList.innerHTML = `
            <div class="text-center text-red-400 py-8">
                Error loading tasks: ${error.message}
            </div>
        `;
    }
}

/**
 * Render a single todo item
 */
function renderTodoItem(todo) {
    return `
        <div class="flex items-center gap-3 bg-gray-700 p-4 rounded-lg group" data-todo-id="${todo.id}">
            <input 
                type="checkbox" 
                ${todo.completed ? 'checked' : ''}
                class="todo-checkbox w-5 h-5 rounded border-gray-500 text-purple-600 focus:ring-purple-500 focus:ring-offset-gray-700 cursor-pointer"
            >
            <span class="flex-1 text-white ${todo.completed ? 'line-through text-gray-400' : ''}">
                ${escapeHtml(todo.title)}
            </span>
            <button class="todo-delete opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
            </button>
        </div>
    `;
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Add a new todo
 */
async function addTodo(title) {
    try {
        const { error } = await supabase
            .from('todos')
            .insert([
                {
                    user_id: currentUser.id,
                    title,
                    completed: false
                }
            ]);
        
        if (error) throw error;
        
        await loadTodos();
    } catch (error) {
        console.error('Error adding todo:', error);
        alert('Failed to add task: ' + error.message);
    }
}

/**
 * Toggle todo completion
 */
async function toggleTodo(todoId, completed) {
    try {
        const { error } = await supabase
            .from('todos')
            .update({ completed })
            .eq('id', todoId);
        
        if (error) throw error;
        
        await loadTodos();
    } catch (error) {
        console.error('Error updating todo:', error);
        alert('Failed to update task: ' + error.message);
    }
}

/**
 * Delete a todo
 */
async function deleteTodo(todoId) {
    try {
        const { error } = await supabase
            .from('todos')
            .delete()
            .eq('id', todoId);
        
        if (error) throw error;
        
        await loadTodos();
    } catch (error) {
        console.error('Error deleting todo:', error);
        alert('Failed to delete task: ' + error.message);
    }
}

/**
 * Attach event listeners to todo items
 */
function attachTodoEventListeners() {
    // Checkboxes
    document.querySelectorAll('.todo-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            const todoId = e.target.closest('[data-todo-id]').dataset.todoId;
            toggleTodo(todoId, e.target.checked);
        });
    });
    
    // Delete buttons
    document.querySelectorAll('.todo-delete').forEach(button => {
        button.addEventListener('click', (e) => {
            const todoId = e.target.closest('[data-todo-id]').dataset.todoId;
            if (confirm('Delete this task?')) {
                deleteTodo(todoId);
            }
        });
    });
}

/**
 * Initialize todo functionality
 */
export function initTodos() {
    const addTodoForm = document.getElementById('addTodoForm');
    const todoInput = document.getElementById('todoInput');
    
    if (!addTodoForm) return;
    
    // Load initial todos
    loadTodos();
    
    // Handle form submission
    addTodoForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const title = todoInput.value.trim();
        if (!title) return;
        
        await addTodo(title);
        todoInput.value = '';
    });
    
    // Set up real-time subscriptions
    supabase
        .channel('todos')
        .on('postgres_changes', {
            event: '*',
            schema: 'public',
            table: 'todos',
            filter: `user_id=eq.${currentUser?.id}`
        }, () => {
            loadTodos();
        })
        .subscribe();
}
