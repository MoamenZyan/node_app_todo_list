// Element
const settings = document.getElementById("settings");

// Redirect To User's Setting Page
settings.addEventListener("click", ()=> {
    window.location.href = `${currentURL}/settings`;
});
