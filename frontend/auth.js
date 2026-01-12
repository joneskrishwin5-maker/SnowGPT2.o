function login() {
    const u = document.getElementById("username").value;
    const p = document.getElementById("password").value;

    if (!u || !p) return alert("Fill all fields");

    let users = JSON.parse(localStorage.getItem("users") || "{}");

    if (users[u] && users[u] !== p) {
        return alert("Wrong password");
    }

    users[u] = p;
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("user", u);

    location.href = "chat.html";
}

function logout() {
    localStorage.removeItem("user");
    location.href = "index.html";
}

if (location.pathname.includes("chat.html") && !localStorage.getItem("user")) {
    location.href = "index.html";
}
