import { supabase } from './supabase.js';
import { getSatiricalLine, getSatireSettings } from './satire.js';

let currentUser = null;
let deadlineCheckInterval = null;

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

function showNotification(message, type = 'info') {
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

async function loadTodos() {
    const todoList = document.getElementById('todoList');
    
    try {
        const { data: { user } } = await supabase.auth.getUser();
        currentUser = user;
        
        const { data, error } = await supabase
            .from('todos')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        
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
            <div class="text-center text-red-600 py-20 border-4 border-red-600 font-black uppercase tracking-tighter">
                <div class="text-4xl mb-4">SYSTEM FAILURE</div>
                <div class="text-xl">Even the database is tired of your bullshit: ${error.message}</div>
            </div>
        `;
    }
}

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
        <div class="flex items-center gap-4 bg-gray-800 border ${isOverdue ? 'border-red-600' : 'border-gray-700'} p-6 group hover:border-red-500 transition" data-todo-id="${todo.id}">
            <input 
                type="checkbox" 
                ${todo.completed ? 'checked' : ''}
                class="todo-checkbox w-8 h-8 border-2 border-gray-600 text-red-600 focus:ring-0 cursor-pointer flex-shrink-0 bg-gray-900 rounded-none appearance-none checked:bg-red-600"
            >
            <div class="flex-1 min-w-0">
                <span class="block text-white text-xl font-black uppercase tracking-tighter ${todo.completed ? 'line-through text-gray-600' : ''}">
                    ${escapeHtml(todo.title)}
                </span>
                ${deadline ? `
                    <span class="block text-xs mt-1 uppercase tracking-widest font-bold ${isOverdue ? 'text-red-500' : 'text-gray-500'}">
                        ${isOverdue ? '⚠️ DEADLINE MISSED: ' : ''}${deadlineText}
                    </span>
                ` : ''}
            </div>
            <button class="todo-delete opacity-0 group-hover:opacity-100 text-gray-600 hover:text-red-500 transition flex-shrink-0 p-2 uppercase text-xs font-black tracking-widest">
                Delete
            </button>
        </div>
    `;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

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

async function showCompletionModal() {
    const settings = await getSatireSettings();
    if (settings.snowflakeMode) return 'truth';

    return new Promise((resolve) => {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4';
        modal.innerHTML = `
            <div class="bg-gray-900 border-4 border-red-600 p-10 max-w-md w-full text-center shadow-[20px_20px_0px_0px_rgba(220,38,38,0.3)]">
                <h2 class="text-4xl font-black text-white uppercase tracking-tighter mb-6">Wait a fucking second.</h2>
                <p class="text-gray-400 text-sm mb-10 font-black uppercase tracking-widest leading-relaxed">Did you actually finish this task, or are you just fucking lying to feel better about your pathetic existence?</p>
                <div class="flex flex-col gap-4">
                    <button id="lyingBtn" class="w-full bg-red-600 text-white font-black py-5 uppercase tracking-widest hover:bg-red-700 transition text-lg">
                        I'm fucking lying
                    </button>
                    <button id="truthBtn" class="w-full bg-white text-black font-black py-5 uppercase tracking-widest hover:bg-gray-200 transition text-lg">
                        I actually did it
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        document.getElementById('lyingBtn').onclick = () => {
            modal.remove();
            resolve('lying');
        };
        document.getElementById('truthBtn').onclick = () => {
            modal.remove();
            resolve('truth');
        };
    });
}

async function toggleTodo(todoId, completed) {
    try {
        if (completed) {
            const result = await showCompletionModal();
            const settings = await getSatireSettings();
            
            if (result === 'lying') {
                const messages = {
                    0: "You're lying. How pathetic.",
                    1: "Lying to a productivity app? You've reached a new low.",
                    2: "Wow. Not only are you lazy, you're a dishonest piece of shit too.",
                    3: settings.allowProfanity ? 
                        "You're a fucking disgrace. Lying about work? Go fuck yourself." :
                        "You're a total fraud. A pathetic, lying excuse for a human being."
                };
                showNotification(messages[settings.level] || messages[1], 'error');
            } else {
                const messages = {
                    0: "Task completed.",
                    1: "You actually did it. Want a medal, you big baby?",
                    2: "Miracles do happen. You finished one (1) task. Don't get used to it.",
                    3: settings.allowProfanity ? 
                        "Holy shit, you actually worked. About fucking time, you lazy prick." :
                        "Look at you, acting like a functional adult for five seconds. Cute."
                };
                showNotification(messages[settings.level] || messages[1], 'info');
            }
            
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

function attachTodoEventListeners() {
    document.querySelectorAll('.todo-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            const todoId = e.target.closest('[data-todo-id]').dataset.todoId;
            toggleTodo(todoId, e.target.checked);
        });
    });
    
    document.querySelectorAll('.todo-delete').forEach(button => {
        button.addEventListener('click', (e) => {
            const todoId = e.target.closest('[data-todo-id]').dataset.todoId;
            if (confirm('Are you really going to delete this task? Giving up already, you weak piece of shit?')) {
                deleteTodo(todoId);
            }
        });
    });
}

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
