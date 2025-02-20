document.addEventListener("DOMContentLoaded", loadTasks);

function addTask(taskText = null) {
    const taskInput = document.getElementById("new-task-input");
    const taskContent = taskText || taskInput.value.trim();

    if (taskContent === "") {
        alert("Please enter a task.");
        return;
    }

    const task = document.createElement("div");
    task.classList.add("task");
    task.setAttribute("draggable", "true");
    task.setAttribute("id", "task-" + Date.now());
    task.ondragstart = drag;
    task.innerText = taskContent;
    task.ondblclick = editTask;

    document.getElementById("backlog").appendChild(task);
    saveTasks();
    updateCounts();
    taskInput.value = "";
}

function allowDrop(event) {
    event.preventDefault();
}

function drag(event) {
    event.dataTransfer.setData("text", event.target.id);
}

function drop(event) {
    event.preventDefault();
    const taskId = event.dataTransfer.getData("text");
    const task = document.getElementById(taskId);

    if (event.target.classList.contains("column")) {
        event.target.appendChild(task);
        saveTasks();
        updateCounts();
    }
}

function deleteTask(event) {
    event.preventDefault();
    const taskId = event.dataTransfer.getData("text");
    const task = document.getElementById(taskId);
    if (task) {
        task.remove();
        saveTasks();
        updateCounts();
    }
}

function editTask(event) {
    const newTask = prompt("Edit your task:", event.target.innerText);
    if (newTask !== null) {
        event.target.innerText = newTask;
        saveTasks();
    }
}

function saveTasks() {
    localStorage.setItem("kanbanTasks", document.querySelector(".board").innerHTML);
}

function loadTasks() {
    if (localStorage.getItem("kanbanTasks")) {
        document.querySelector(".board").innerHTML = localStorage.getItem("kanbanTasks");
        document.querySelectorAll(".task").forEach(task => {
            task.ondragstart = drag;
            task.ondblclick = editTask;
        });
    }
    updateCounts();
}

function updateCounts() {
    ["backlog", "todo", "in-progress", "done"].forEach(id => {
        document.getElementById("count-" + id).innerText = document.getElementById(id).children.length - 1;
    });
}

// AI Task Suggestions
document.getElementById("suggest-task").addEventListener("click", () => {
    const suggestions = ["Complete UI Design", "Fix Bug #42", "Write Documentation", "Improve Performance"];
    addTask(suggestions[Math.floor(Math.random() * suggestions.length)]);
});

// Voice Commands
document.getElementById("start-voice").addEventListener("click", () => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.start();
    recognition.onresult = (event) => {
        addTask(event.results[0][0].transcript);
    };
});

// Dark Mode Toggle
document.getElementById("dark-mode-toggle").addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
});
