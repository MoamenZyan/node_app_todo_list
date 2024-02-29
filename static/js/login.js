// Elements
const button = document.getElementById("form_button");
const checkbox = document.getElementById("checkbox");
const form = document.getElementById("myForm");

// To Fire Login Function
button.addEventListener("click", (event) => {
    event.preventDefault();
    const form_data = new FormData(form);
    login(form_data);
});

// To Fetch Login API
function login(data){
    const form_data = new URLSearchParams(data);
    const result = document.getElementById("result");
    fetch('/api/login', {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "checkbox": checkbox.checked,
        },
        body: form_data
    })
    .then(response => {
        if (response.ok){
            window.location.href = response.url;
        } else {
            const msg = "Username/Password Incorrect";
            throw msg
        }
    })
    .catch(msg => {
        result.style.display = "block";
        result.style.visibility = "visible";
        result.style.marginTop = "20px";
        result.innerHTML = msg;
    });
}
