// Element
const logout = document.getElementById('logout');

// To Fetch Logout API
logout.addEventListener("click", () => {
    if (currentURL.includes('settings')) {
        currentURL = currentURL.slice(0, currentURL.length - 9);
    }
    fetch(`${currentURL}/logout`)
    .then(response => window.location.href = response.url);
});
