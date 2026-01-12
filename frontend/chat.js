const chatBox = document.getElementById("chat-box");
const input = document.getElementById("user-input");

function addUser(text) {
    const d = document.createElement("div");
    d.className = "user";
    d.innerText = text;
    chatBox.appendChild(d);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function addAI(text) {
    const d = document.createElement("div");
    d.className = "ai";
    chatBox.appendChild(d);

    const words = text.split(" ");
    let i = 0;

    const timer = setInterval(() => {
        if (i < words.length) {
            d.innerText += (i ? " " : "") + words[i];
            i++;
            chatBox.scrollTop = chatBox.scrollHeight;
        } else {
            clearInterval(timer);
        }
    }, 80);
}

async function sendMessage() {
    const msg = input.value.trim();
    if (!msg) return;

    addUser(msg);
    input.value = "";

    try {
        const res = await fetch("https://snowgpt2-o-backend.onrender.com/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: msg })
        });

        const data = await res.json();
        addAI(data.reply);

    } catch (err) {
        addAI("⚠️ Server is not responding");
    }
}

input.addEventListener("keydown", e => {
    if (e.key === "Enter") sendMessage();
});
