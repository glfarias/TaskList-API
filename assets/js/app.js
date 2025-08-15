/* ---------- VARIABLES ---------- */

const defaultTasks = [
"Add a new task by clicking the + button ☝️",
"Move your mouse over a task to see the delete button 🗑️",
"Click a task to check it ✔️"
];

// GET USER, USERID AND TASKS
const user = JSON.parse(localStorage.getItem("user"));
const userId = JSON.parse(localStorage.getItem("userId"));
let tasks = JSON.parse(localStorage.getItem("tasksList"));

const ul = document.querySelector('ul');

let pendingTasks;

const checkAll = document.getElementById("check-all");
const addTaskBtn = document.getElementById("add-task");

/* ---------- EVENT LISTENERS ---------- */

checkAll.addEventListener("click", checkAllTasks)

addTaskBtn.addEventListener("click", addTask)

ul.addEventListener('click', (event) => {
    const elementClicked = event.target;
    const li = event.target.closest("li");

    if (elementClicked.classList.contains('btn-delete-icon') || elementClicked.classList.contains('btn-delete')) {

        if (!li.classList.contains("done")) {
            pendingTasks--;
        }
        
        li.remove();
        
    } else {
        if (li.classList.contains('done')) {
            pendingTasks++;
        } else {
            pendingTasks--;
        }
        li.classList.toggle('done')
    }
    updatePendingTasks();
    saveTasksToApi();
});

/* ---------- FUNCTIONS ---------- */

function checkAllTasks() {
  const allTasks = document.querySelectorAll("li");
  allTasks.forEach(task => {task.classList.add("done");})
  pendingTasks = 0;
  updatePendingTasks();
}

function saveTasksToApi() {
    let currentTasks = [];
    const lis = ul.children;
    Array.from(lis).forEach(li => {currentTasks.push(li.innerText)});
    axios.put(`https://689688bc250b078c203facac.mockapi.io/api/users/${userId}`, {tasks: currentTasks})
    .then(response => {console.log("Up to date: ", response.data)})
    .catch(error => {console.log("Error: ", error)});
}

function updatePendingTasks() {
    const span = document.querySelector(".header span");
    span.innerHTML = `(${pendingTasks})`;
}


function addTask() {
    const taskInput = document.querySelector(".title input");

    if (taskInput.value) {
        ul.innerHTML += `
        <li>
            <div class="btn-delete">
                <ion-icon class="btn-delete-icon" name="trash-outline"></ion-icon>
            </div>
            <span>${taskInput.value}</span>
        </li>
        `;
        taskInput.value = "";
        pendingTasks++;
        updatePendingTasks();
        saveTasksToApi();
    }
}

function loadTasks() {
    console.log("UserID: ", userId);
    console.log("User: ", user);
    console.log("Tasks: ", tasks);
    if (tasks.length == 0) {
        defaultTasks.forEach(defaultTask => {
            tasks.push(defaultTask)
        })
    } 

    tasks.forEach(tarefa => {
        ul.innerHTML += `
        <li>
            <div class="btn-delete">
                <ion-icon class="btn-delete-icon" name="trash-outline"></ion-icon>
            </div>
            <span>${tarefa}</span>
        </li>`})

    pendingTasks = tasks.length;
    updatePendingTasks();
}

/* ---------- DEFAULT WHEN PAGE LOADS ---------- */
if (user) {
    loadTasks();
} else {
    window.location.replace('index.html');
}