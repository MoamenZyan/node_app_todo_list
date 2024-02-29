// Elements
const button = document.getElementById("popup_form_button");
const add_task_button = document.getElementById("add_task_button");
const form = document.getElementById("form_popup");
const section = document.getElementById('section');
const input = document.getElementById('desc_input');
const deadline = document.getElementById('deadline');
const result = document.getElementById("result");
const todo = document.getElementById("todo");
const currentURL = window.location.href;

// Get Tasks As Soon As Page Loads
window.onload = () => {
    get_tasks();
}

// Blur And UnBlur Add Task Form
document.addEventListener('click', (event) => {
    if (form.style.display == "flex" && event.target !== form && !form.contains(event.target))
    {
        section.classList.remove('blur');
        form.style.display = "none";
        form.style.visibility = "hidden";
    }
    else if (event.target === button)
    {
        form.style.display = "flex";
        form.style.visibility = "visible";
        section.classList.add('blur');
        input.focus();
    }
});

// To Add Error Msg To Result Div
add_task_button.addEventListener("click", async (event) => {
    const task_form = document.getElementById("task_form");
    const form_data = new FormData(task_form);
    event.preventDefault();
    if (input.value !== "" && deadline !== ""){
        add_task(form_data);
    } else {
        result.style.display = "block";
        result.style.visibility = "visible";
        result.style.marginTop = "20px"
        result.innerHTML = "Please enter a description and a deadline";
    }
});

// Function To Fetch Get Task Api
async function get_tasks(){
    const user_id = (await fetch(`${currentURL}/user_id`).then(response => response.json()))[0]["id"];
    fetch(`${currentURL}/tasks`, {
        headers: {
            'user_id': user_id,
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.length === 0)
        {
            todo.classList.add('no_items');
            todo.innerHTML = "There Is No Tasks Yet";
        }
        else
        {
            append_tasks(data);
        }
    });
}

// Function To Fetch The Add Task Api
async function add_task(data){
    const user_id = (await fetch(`${currentURL}/user_id`).then(response => response.json()))[0]["id"];
    const form_data = new URLSearchParams(data);
    fetch(`${currentURL}/add_task`, {
        method: "POST",
        headers: {
            'user_id': user_id,
        },
        body: form_data,
    })
    .then(response => {
        if (response.ok) {
            location.reload();
        } else {
            const msg = "Error Adding Task";
            throw msg;
        }
    })
    .catch(msg => {
        result.style.display = "block";
        result.style.visibility = "visible";
        result.style.marginTop = "20px"
        result.innerHTML = msg;
    });
}


// Function To Append Task To HTML Div
function append_tasks(data) {
    todo.classList.remove('no_items');
    data.forEach((item) => {
        const ops = document.createElement('div');
        const remove_div = document.createElement('div');
        const check_div = document.createElement('div');

        ops.classList.add("todo_operations");
        remove_div.classList.add(item["task_id"]);
        check_div.classList.add(item["task_id"]);
        remove_div.id = "remove_icon";
        check_div.id = "check_icon";

        ops.appendChild(remove_div);
        ops.appendChild(check_div);

        const todo_info = document.createElement('div');
        const description = document.createElement('p');
        const deadline = document.createElement('p');
        const status = document.createElement('p');
        todo_info.classList.add('todo_info');
        description.innerHTML = item['description'];
        deadline.innerHTML = item['deadline'].slice(0, 10);
        if (item['status'] === 0) {
            status.innerHTML = 'not complete';
        } else {
            status.innerHTML = 'completed';
        }
        todo_info.appendChild(description);
        todo_info.appendChild(deadline);
        todo_info.appendChild(status);
        todo_info.appendChild(ops);
        todo.appendChild(todo_info);
    });
}

document.addEventListener("click", (event)=> {
    const task_id = event.target.classList["value"];
    if (event.target.id == "remove_icon") {
        remove_task(task_id);
    } else if (event.target.id == "check_icon") {
        check_task(task_id);
    }
});

function remove_task(task_id){
    fetch(`${currentURL}/delete_task`, {
        method: "DELETE",
        headers: {
            "task_id": task_id,
        }
    })
    .then(response => {
        if (response.ok) {
            location.reload();
        }
    })
}

function check_task(task_id){
    fetch(`${currentURL}/check_task`, {
        method: "PUT",
        headers: {
            "task_id": task_id,
        }
    })
    .then(response => {
        if (response.ok) {
            location.reload();
        }
    })
}