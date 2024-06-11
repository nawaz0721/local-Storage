var login_container = document.getElementById('login_container');
var home_container = document.getElementById('home_container');
var user_email = document.getElementById('user_email');
var email = document.getElementById('email');
var password = document.getElementById('password');
var input = document.getElementById('userInput');
var category = document.getElementById('category');
var clicksHistory = document.getElementById('tasks');

function loginUser(){
    if(!email.value || !password.value){
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

    var obj = {
        email: email,
        input: input.value,
        category: category.value,
        date: now.getMonth() + 1 + "/" + now.getDate() + "/" + now.getFullYear(),
        time: now.toLocaleTimeString()
    };

    saveLocalstorage(obj);
    input.value = "";
}

function saveLocalstorage(obj){
    var tasks = localStorage.getItem("tasks");

    if(tasks){
        tasks = JSON.parse(tasks);
        tasks.push(obj);
        localStorage.setItem("tasks", JSON.stringify(tasks));
    } else {
        tasks = [obj];
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }
    displayTodo();
}

function displayTodo(){
    var tasks = localStorage.getItem("tasks");
    var email = localStorage.getItem("email");
    var selectedCategory = category.value;

    if(tasks){
        clicksHistory.innerHTML = "";
        tasks = JSON.parse(tasks);

        tasks.forEach(function (data) {
            if((data.email === email || email === 'admin@gmail.com') && data.category === selectedCategory){
                var li = `<li> <span class="category">${data.category}</span><span> ${data.input} </span>
                <div>
                <span>${data.date}</span><br>
                <span>${data.time}</span>
                </div>
                <button onclick="editThis(this)" id="edit"><i class="fa-solid fa-pen-to-square"></i></button>
                <button onclick="deleteThis(this)" id="delete"><i class="fa-solid fa-trash"></i ></button> </li>`;
                
                if(email === 'admin@gmail.com'){
                    li = `<li><span>${data.email}</span>` + li.slice(4);
                }
                clicksHistory.innerHTML += li;
            }
        });
    }
}

category.addEventListener('change', displayTodo);
displayTodo();

function editThis(currentElement){
    var taskElement = currentElement.parentElement;
    var taskText = taskElement.querySelector('span:not(.category)').innerText;
    var newText = prompt("Edit your task:", taskText);
    if(newText){
        taskElement.querySelector('span:not(.category)').innerText = newText;

        // Update local storage
        var tasks = localStorage.getItem("tasks");
        if(tasks){
            tasks = JSON.parse(tasks);
            tasks.forEach(function(data){
                if(data.input === taskText) {
                    data.input = newText;
                }
            });
            localStorage.setItem("tasks", JSON.stringify(tasks));
        }
    }
}

function deleteThis(currentElement){
    // Remove from the DOM
    var taskElement = currentElement.parentElement;
    var taskText = taskElement.querySelector('span:not(.category)').innerText;
    taskElement.remove();

    // Remove from local storage
    var tasks = localStorage.getItem("tasks");
    if(tasks){
        tasks = JSON.parse(tasks);
        tasks = tasks.filter(function(data){
            return data.input !== taskText;
        });
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }
}
