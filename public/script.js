document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // Validate credentials (you can replace this logic with API calls or other methods)
    if (username === "user" && password === "password") {
        alert("Login successful!");
    } else {
        alert("Invalid credentials. Please try again.");
    }
});
