// ==========================
// AI Chat
// ==========================

const sendBtn = document.querySelector("#send-btn");
const userInput = document.querySelector("#user-input");
const chatMessages = document.querySelector(".chat-messages");
const clearChatBtn = document.querySelector("#clear-chat");
const downloadChatBtn = document.querySelector("#download-chat");
const regenerateBtn = document.querySelector("#regenerate-btn");
const typingIndicator = document.querySelector("#typing-indicator");
const newChatBtn = document.querySelector("#new-chat-btn");

let lastUserMessage = "";
let lastBotMessage = null;

if (sendBtn && userInput && chatMessages) {
function saveChat() {
    localStorage.setItem("chatHistory", chatMessages.innerHTML);
}

function loadChat() {
    const savedChat = localStorage.getItem("chatHistory");

    if (savedChat) {
        chatMessages.innerHTML = savedChat;
    }
}

sendBtn.addEventListener("click", async function () {

    const message = userInput.value.trim();

    lastUserMessage = message;

    if (message === "") {
        return;
    }

   const userMessage = document.createElement("div");

userMessage.classList.add("user-message");

userMessage.innerHTML = `
<div class="message-header">
    👤 <strong>You</strong>
</div>

<div class="message-content">
    ${message}
</div>
`;

    chatMessages.appendChild(userMessage);
    
    saveChat();

    userInput.value = "";

    chatMessages.scrollTop = chatMessages.scrollHeight;
    // Bot Reply

const botMessage = document.createElement("div");

lastBotMessage = botMessage;

botMessage.classList.add("bot-message");
botMessage.textContent = "🤖 Thinking...";
typingIndicator.style.display = "flex";
chatMessages.scrollTop = chatMessages.scrollHeight;

chatMessages.appendChild(botMessage);

chatMessages.scrollTop = chatMessages.scrollHeight;

try {
console.log("🚀 Fetch is starting...");

const response = await fetch("/chat", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify({
        message: message,
    }),
});

console.log("Response object:", response);

const data = await response.json();
typingIndicator.style.display = "none";
console.log(data);
botMessage.innerHTML = `
<div class="message-header">
    🤖 <strong>WowGe AI</strong>
</div>

<div class="ai-reply"></div>

<button class="copy-btn">
    📋 Copy
</button>
`;
const aiReply = botMessage.querySelector(".ai-reply");

await typeText(aiReply, data.reply);

saveChat();
const copyBtn = botMessage.querySelector(".copy-btn");

copyBtn.addEventListener("click", function () {

    navigator.clipboard.writeText(data.reply);

    copyBtn.textContent = "✅ Copied!";

    setTimeout(() => {

        copyBtn.textContent = "📋 Copy";

    }, 2000);

});

} catch (error) {
typingIndicator.style.display = "none";
    botMessage.textContent =
        "Gemini API limit reached. Please try again later.";

}

chatMessages.scrollTop = chatMessages.scrollHeight;

});
userInput.addEventListener("keypress", function(event){

    if(event.key === "Enter"){

        sendBtn.click();

    }

});
loadChat(); }
if (clearChatBtn) {

    clearChatBtn.addEventListener("click", function () {

        const confirmClear = confirm("Are you sure you want to clear all chats?");

        if (confirmClear) {

            localStorage.removeItem("chatHistory");

            chatMessages.innerHTML = `
                <div class="bot-message">
                    👋 Hello! I'm WowGe AI. Ask me anything.
                </div>
            `;

        }

    });

}
if (downloadChatBtn) {

    downloadChatBtn.addEventListener("click", function () {

        let chatText = "🤖 WowGe AI Chat History\n";
        chatText += "============================\n\n";

        const messages = chatMessages.querySelectorAll(".user-message, .bot-message");

        messages.forEach(function(message){

            if(message.classList.contains("user-message")){

                chatText += "👤 You:\n";
                chatText += message.innerText + "\n\n";

            }else{

                let botReply = message.innerText.replace("📋 Copy","").trim();

                chatText += "🤖 WowGe AI:\n";
                chatText += botReply + "\n\n";

            }

        });
        // ==========================
// New Chat
// ==========================

        const blob = new Blob([chatText],{
            type:"text/plain"
        });

        const link = document.createElement("a");

        link.href = URL.createObjectURL(blob);

        link.download = "WowGe AI-Chat.txt";

        link.click();

        URL.revokeObjectURL(link.href);

    });

}
if (newChatBtn) {

    newChatBtn.addEventListener("click", function () {

        const confirmNew = confirm("Start a new chat?");

        if (!confirmNew) return;

        localStorage.removeItem("chatHistory");

        chatMessages.innerHTML = `
            <div class="bot-message">
                <div class="message-header">
                    🤖 <strong>WowGe AI</strong>
                </div>

                <div class="message-content">
                    👋 Hello! I'm WowGe AI. Ask me anything.
                </div>
            </div>
        `;

        lastUserMessage = "";

        saveChat();

    });

}
if (regenerateBtn) {

    regenerateBtn.addEventListener("click", async function () {

        console.log("🔄 Regenerate Clicked");

        if (!lastUserMessage || !lastBotMessage) {

            alert("No previous message found!");

            return;

        }

        typingIndicator.style.display = "flex";

        lastBotMessage.innerHTML = "🤖 Thinking...";

        try {

            const response = await fetch("/chat", {

                method: "POST",

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify({

                    message: lastUserMessage

                })

            });

            const data = await response.json();

            typingIndicator.style.display = "none";

            lastBotMessage.innerHTML = `
                <div class="message-header">
                    🤖 <strong>WowGe AI</strong>
                </div>

                <div class="ai-reply"></div>

                <button class="copy-btn">
                    📋 Copy
                </button>
            `;

            const aiReply = lastBotMessage.querySelector(".ai-reply");

            await typeText(aiReply, data.reply);

        } catch (error) {

            typingIndicator.style.display = "none";

            lastBotMessage.textContent =
                "⚠️ Failed to regenerate response.";

        }

    });

}
// ==========================
// Typing Animation
// ==========================

async function typeText(element, text) {

    element.innerHTML = "";

    let currentText = "";

    for (let i = 0; i < text.length; i += 3) {

        currentText += text.substring(i, i + 3);

        element.innerHTML = marked.parse(currentText) + `<span class="typing-cursor">▋</span>`;

        chatMessages.scrollTop = chatMessages.scrollHeight;

        await new Promise(resolve => setTimeout(resolve, 10));

    }

    element.innerHTML = marked.parse(currentText);

}