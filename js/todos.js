import { supabase } from './supabase.js';
import { getSatiricalLine, getSatireSettings } from './satire.js';

let currentUser = null;
let deadlineCheckInterval = null;


/**
 * Check for overdue tasks and show satire
 */
async function checkOverdueTasks() {
    if (!currentUser) return;
    
    const { data, error } = await supabase
        .from('todos')
        .select('*')
        .eq('user_id', currentUser.id)
        .eq('completed', false)
        .not('deadline', 'is', null);
    
    if (error || !data) return;
    
    const now = new Date();
    const settings = await getSatireSettings();
    
    data.forEach(todo => {
        if (new Date(todo.deadline) < now) {
            // Check if we've already shown notification for this task
            const notifiedKey = `notified_${todo.id}`;
            if (!localStorage.getItem(notifiedKey)) {
                const messages = {
                    0: `Your deadline for "${todo.title}" has passed.`,
                    1: `Oh look, you missed the deadline for "${todo.title}". Shocking. Truly.`,
                    2: `Breaking news: Another deadline missed. "${todo.title}" is now officially a monument to your incompetence.`,
                    3: settings.allowProfanity ? 
                        `Are you fucking kidding me? "${todo.title}" was due ages ago, you lazy piece of shit!` :
                        `Seriously? "${todo.title}" was due and you just... ignored it? You're a total failure.`
                };
                
                showNotification(messages[settings.level] || messages[1], 'error');
                localStorage.setItem(notifiedKey, 'true');
            }
        }
    });
}

/**
 * Show notification
 */
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm ${
        type === 'error' ? 'bg-red-900/90 border border-red-700 text-red-200' : 'bg-gray-800/90 border border-gray-700 text-white'
    }`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

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
            const emptyHTML = `
                <div class="text-center text-gray-300 py-12 text-base">
                    No tasks yet. Add one above, if you're even capable of doing anything.
                </div>
            `;
            todoList.innerHTML = emptyHTML;
            const mobileList = document.getElementById('todoListMobile');
            if (mobileList) mobileList.innerHTML = emptyHTML;
        } else {
            const todosHTML = data.map(todo => renderTodoItem(todo)).join('');
            todoList.innerHTML = todosHTML;
            const mobileList = document.getElementById('todoListMobile');
            if (mobileList) mobileList.innerHTML = todosHTML;
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
    const now = new Date();
    const deadline = todo.deadline ? new Date(todo.deadline) : null;
    const isOverdue = deadline && deadline < now && !todo.completed;
    const deadlineText = deadline ? deadline.toLocaleString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        hour: 'numeric', 
        minute: '2-digit' 
    }) : '';
    
    return `
        <div class="flex items-center gap-4 bg-white/10 backdrop-blur-sm border-2 ${isOverdue ? 'border-red-400' : 'border-white/20'} p-4 rounded-2xl group hover:bg-white/15 transition" data-todo-id="${todo.id}">
            <input 
                type="checkbox" 
                ${todo.completed ? 'checked' : ''}
                class="todo-checkbox w-6 h-6 rounded-full border-2 border-white/40 text-purple-600 focus:ring-2 focus:ring-white/40 cursor-pointer flex-shrink-0 bg-transparent"
            >
            <div class="flex-1 min-w-0">
                <span class="block text-white text-base ${todo.completed ? 'line-through text-gray-400' : ''}">
                    ${escapeHtml(todo.title)}
                </span>
                ${deadline ? `
                    <span class="block text-sm mt-1 ${isOverdue ? 'text-red-300 font-medium' : 'text-gray-300'}">
                        ${isOverdue ? '⚠️ ' : ''}${deadlineText}${isOverdue ? ' - OVERDUE' : ''}
                    </span>
                ` : ''}
            </div>
            <button class="todo-delete opacity-0 group-hover:opacity-100 text-red-300 hover:text-red-200 transition flex-shrink-0 p-2 hover:bg-red-500/20 rounded-full">
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
async function addTodo(title, deadline = null) {
    try {
        const { error } = await supabase
            .from('todos')
            .insert([
                {
                    user_id: currentUser.id,
                    title,
                    completed: false,
                    deadline: deadline || null
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
        // Clear notification flag when completing
        if (completed) {
            localStorage.removeItem(`notified_${todoId}`);
        }
        
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
    const addTodoFormMobile = document.getElementById('addTodoFormMobile');
    const todoInput = document.getElementById('todoInput');
    const todoDeadline = document.getElementById('todoDeadline');
    const todoInputMobile = document.getElementById('todoInputMobile');
    const todoDeadlineMobile = document.getElementById('todoDeadlineMobile');
    
    // Load initial todos
    loadTodos();
    
    // Start deadline checker (every 30 seconds)
    deadlineCheckInterval = setInterval(checkOverdueTasks, 30000);
    checkOverdueTasks(); // Check immediately
    
    // Handle desktop form submission
    addTodoForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const title = todoInput.value.trim();
        if (!title) return;
        
        const deadline = todoDeadline.value || null;
        
        await addTodo(title, deadline);
        todoInput.value = '';
        todoDeadline.value = '';
    });
    
    // Handle mobile form submission
    addTodoFormMobile?.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const title = todoInputMobile.value.trim();
        if (!title) return;
        
        const deadline = todoDeadlineMobile.value || null;
        
        await addTodo(title, deadline);
        todoInputMobile.value = '';
        todoDeadlineMobile.value = '';
        
        // Sync to desktop inputs
        loadTodos();
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
