// Elements
const password_icon = document.getElementById("password_icon");
const password_input = document.getElementById("password_input");

// Password Flag
let is_visible = false;

// To Handle Hide And Show of The Password
password_icon.addEventListener("click", () => {
    if (is_visible){
        password_icon.classList.add("hide");
        password_icon.classList.remove("show");
        password_input.type = "password";
        is_visible = false
    } else {
        password_icon.classList.add("show");
        password_icon.classList.remove("hide");
        password_input.type = "text";
        is_visible = true
    }
});
