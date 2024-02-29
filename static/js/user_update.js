// Elements
const button = document.getElementById("form_button");
const form = document.getElementById("myForm");
const result = document.getElementById("result");
let currentURL = window.location.href;

// Fire Update Function
button.addEventListener("click", (event) => {
    event.preventDefault();
    const form_data = new FormData(form);
    update(form_data);
});

// Function To Fetch Update API
async function update(data) {
    const user_id = await fetch(`${currentURL.slice(0, currentURL.length - 9)}/user_id`).then(response => response.json());
    const form_data = new URLSearchParams(data);
    fetch(`${currentURL.slice(0, currentURL.length - 9)}/api/settings`, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "user_id": user_id[0]['id'],
        },
        body: form_data
    })
    .then(response => {
        if (response.ok) {
            const msg = "User Info Updated.";
            return msg;
        } else {
            const msg = "Username/Email/Phone Must Be Unique";
            throw msg;
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
