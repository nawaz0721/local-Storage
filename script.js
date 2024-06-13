var login_container = document.getElementById('login_container');
var home_container = document.getElementById('home_container');
var user_email = document.getElementById('user_email');
var email = document.getElementById('email');
var password = document.getElementById('password');
var input = document.getElementById('userInput');
var newCategory = document.getElementById('new-category');
var filterCategory = document.getElementById('filter-category');
var taskTableBody = document.getElementById('tasks').querySelector('tbody');

function loginUser() {
    if (!email.value || !password.value) {
        alert("Please fill in all fields");
        return;
    }
    localStorage.setItem("email", email.value);
    localStorage.setItem("password", password.value);
    checkUserLogin();
    displayTodo();
}

function checkUserLogin() {
    var email = localStorage.getItem("email");
    if (email) {
        login_container.classList.remove('show');
        home_container.classList.add('show');
        user_email.innerText = email;
    } else {
        login_container.classList.add('show');
        home_container.classList.remove('show');
    }
}
checkUserLogin();

function logout() {
    localStorage.removeItem("email");
    localStorage.removeItem("password");
    checkUserLogin();
}

function addTask() {
    var email = localStorage.getItem("email");
    var now = new Date();

    var task = {
        email: email,
        input: input.value,
        category: newCategory.value,
        date: now.getMonth() + 1 + "/" + now.getDate() + "/" + now.getFullYear(),
        time: now.toLocaleTimeString()
    };

    saveLocalStorage(task);
    input.value = "";
}

function saveLocalStorage(task) {
    var tasks = localStorage.getItem("tasks");

    if (tasks) {
        tasks = JSON.parse(tasks);
        tasks.push(task);
        localStorage.setItem("tasks", JSON.stringify(tasks));
    } else {
        tasks = [task];
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }
    displayTodo();
}

function displayTodo() {
    var tasks = localStorage.getItem("tasks");
    var email = localStorage.getItem("email");
    var selectedCategory = filterCategory.value;

    if (tasks) {
        taskTableBody.innerHTML = "";
        tasks = JSON.parse(tasks);

        tasks.forEach(function (task) {
            if ((task.email === email || email === 'admin@gmail.com') && (selectedCategory === 'All' || task.category === selectedCategory)) {
                var tr = document.createElement('tr');
                tr.innerHTML = `<td>${task.email}</td>
                                <td>${task.category}</td>
                                <td>${task.input}</td>
                                <td>${task.date}</td>
                                <td>${task.time}</td>
                                <td><button onclick="editTask(this)"><i class="fa-solid fa-pen-to-square"></i></button></td>
                                <td><button onclick="deleteTask(this)"><i class="fa-solid fa-trash"></i></button></td>`;
                taskTableBody.appendChild(tr);
            }
        });
    }
}

filterCategory.addEventListener('change', displayTodo);
displayTodo();

function editTask(button) {
    var tr = button.parentElement.parentElement;
    var taskText = tr.children[2].innerText;
    var newText = prompt("Edit your task:", taskText);
    
    if (newText) {
        tr.children[2].innerText = newText;
        updateLocalStorage(tr, newText);
    }
}

function updateLocalStorage(tr, newText) {
    var tasks = JSON.parse(localStorage.getItem("tasks"));
    var email = tr.children[0].innerText;
    var category = tr.children[1].innerText;
    var date = tr.children[3].innerText;
    var time = tr.children[4].innerText;

    tasks.forEach(task => {
        if (task.email === email && task.category === category && task.date === date && task.time === time) {
            task.input = newText;
        }
    });

    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function deleteTask(button) {
    var tr = button.parentElement.parentElement;
    tr.remove();
    removeLocalStorage(tr);
}

function removeLocalStorage(tr) {
    var tasks = JSON.parse(localStorage.getItem("tasks"));
    var email = tr.children[0].innerText;
    var category = tr.children[1].innerText;
    var taskText = tr.children[2].innerText;
    var date = tr.children[3].innerText;
    var time = tr.children[4].innerText;

    tasks = tasks.filter(task => !(task.email === email && task.category === category && task.input === taskText && task.date === date && task.time === time));

    localStorage.setItem("tasks", JSON.stringify(tasks));
}
