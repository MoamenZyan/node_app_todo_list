// Elements
const button = document.getElementById("form_button");
const form = document.getElementById("myForm");

// To Fire Signup Function
button.addEventListener("click", (event) => {
    event.preventDefault();
    const form_data = new FormData(form);
    signup(form_data);
});

// Function To Fetch Signup API
function signup(data){
    const form_data = new URLSearchParams(data);
    const result = document.getElementById("result");
    fetch('/api/signup', {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: form_data
    })
    .then(response => {
        if (response.ok){
            const msg = "Signed Up Successfully"
            return msg
        } else if (response.status === 409) {
            const msg = "Username Or Email Already Exists";
            throw msg
        } else {
            const msg = "Error Adding User";
            throw msg
        }
    })
    .then(msg => {
        result.style.display = "block";
        result.style.visibility = "visible";
        result.style.marginTop = "20px";
        result.innerHTML = msg;
    })
    .catch(msg => {
        result.style.display = "block";
        result.style.visibility = "visible";
        result.style.marginTop = "20px";
        result.innerHTML = msg;
    });
}
