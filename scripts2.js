// Function to save tasks in Local Storage
function saveTasks() {
    const columns = document.querySelectorAll('.column');
    const tasks = {};

    columns.forEach(column => {
        const columnId = column.id;
        tasks[columnId] = [];

        column.querySelectorAll('.task').forEach(task => {
            tasks[columnId].push(task.innerText);
        });
    });

    localStorage.setItem("kanbanTasks", JSON.stringify(tasks));
}

// Load tasks from Local Storage
function loadTasks() {
    const savedTasks = JSON.parse(localStorage.getItem("kanbanTasks"));
    if (!savedTasks) return;

    Object.keys(savedTasks).forEach(columnId => {
        const column = document.getElementById(columnId);
        savedTasks[columnId].forEach(taskContent => {
            const task = document.createElement('div');
            task.classList.add('task');
            task.setAttribute('draggable', 'true');
            task.ondragstart = drag;
            task.innerText = taskContent;
            column.appendChild(task);
        });
    });
}

// Modify existing functions to save tasks after every change
function addTask() {
    const taskInput = document.getElementById('new-task-input');
    const taskContent = taskInput.value.trim();

    if (taskContent === "") {
        alert("Please enter a task.");
        return;
    }

    const task = document.createElement('div');
    task.classList.add('task');
    task.setAttribute('draggable', 'true');
    task.ondragstart = drag;
    task.innerText = taskContent;

    document.getElementById('backlog').appendChild(task);
    taskInput.value = '';

    saveTasks(); // Save after adding a task
}

function drop(event) {
    event.preventDefault();
    const taskId = event.dataTransfer.getData("text");
    const task = document.getElementById(taskId);

    if (event.target.classList.contains('column')) {
        event.target.appendChild(task);
        saveTasks(); // Save after moving a task
    }
}

function deleteTask(event) {
    event.preventDefault();
    const taskId = event.dataTransfer.getData("text");
    const task = document.getElementById(taskId);

    if (task) {
        task.remove();
        saveTasks(); // Save after deleting a task
    }
}

// Load tasks when the page is opened
window.onload = loadTasks;
