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

    // 👇 Tell user backend may be waking up
    addAI("⏳ Thinking...");

    // 👇 Abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
        controller.abort();
    }, 60000); // 60 seconds wait

    try {
        const res = await fetch(
            "https://snowgpt-backend.onrender.com/chat",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: msg }),
                signal: controller.signal
            }
        );

        clearTimeout(timeoutId);

        const data = await res.json();

        // Remove "Thinking..." message
        chatBox.removeChild(chatBox.lastChild);

        addAI(data.reply || "⚠️ No response from AI.");

    } catch (err) {
        // Remove "Thinking..." message
        chatBox.removeChild(chatBox.lastChild);

        addAI("⏳ Server is waking up. Please wait 30–40 seconds and send again.");
    }
}

input.addEventListener("keydown", e => {
    if (e.key === "Enter") sendMessage();
});
