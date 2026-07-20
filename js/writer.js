const generateBtn = document.querySelector("#generate-btn");
const writerPrompt = document.querySelector("#writer-prompt");
const writerOutput = document.querySelector("#writer-output");

const writingType = document.querySelector("#writing-type");
const writingTone = document.querySelector("#writing-tone");
const wordCount = document.querySelector("#word-count");

const wordCounter = document.querySelector("#word-counter");
const charCounter = document.querySelector("#char-counter");
const downloadWriterBtn = document.querySelector("#download-writer-btn");
const clearWriterBtn = document.querySelector("#clear-writer-btn");

if (generateBtn) {

    generateBtn.addEventListener("click", async function () {

        const prompt = writerPrompt.value.trim();
        const type = writingType.value;
        const tone = writingTone.value;
        const words = wordCount.value;

        if (prompt === "") {

            alert("Please enter a prompt.");

            return;

        }

        writerOutput.innerHTML = "<p>🤖 Generating...</p>";
        try {

    const response = await fetch("/chat", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({

    message: `
Write a ${tone} ${type} of approximately ${words} words.

Topic:

${prompt}
`

})

    });

    const data = await response.json();

   writerOutput.innerHTML = `
    <div class="writer-header">

        <h3>✨ Generated Content</h3>

        <button id="copy-writer-btn">
            📋 Copy
        </button>

    </div>

   <div class="writer-result">

    ${marked.parse(data.reply)}

</div>
`;
const copyWriterBtn = document.querySelector("#copy-writer-btn");

copyWriterBtn.addEventListener("click", function () {

    navigator.clipboard.writeText(data.reply);

    copyWriterBtn.textContent = "✅ Copied!";

    setTimeout(() => {

        copyWriterBtn.textContent = "📋 Copy";

    }, 2000);

});

} catch (error) {

    writerOutput.innerHTML = `
        <p>❌ Failed to generate content.</p>
    `;

    console.error(error);

}

    });

}
if (writerPrompt) {

    writerPrompt.addEventListener("input", function () {

        const text = writerPrompt.value.trim();

        const words = text === "" ? 0 : text.split(/\s+/).length;

        const chars = writerPrompt.value.length;

        wordCounter.textContent = `Words: ${words}`;

        charCounter.textContent = `Characters: ${chars}`;

    });

}
if (downloadWriterBtn) {

    downloadWriterBtn.addEventListener("click", function () {

        const writerResult = document.querySelector(".writer-result");

        if (!writerResult) {

            alert("Please generate content first.");

            return;

        }

        const text = writerResult.innerText;

        const blob = new Blob([text], {

            type: "text/plain"

        });

        const link = document.createElement("a");

        link.href = URL.createObjectURL(blob);

        link.download = "NexAI-Writer.txt";

        link.click();

        URL.revokeObjectURL(link.href);

    });

}
if (clearWriterBtn) {

    clearWriterBtn.addEventListener("click", function () {

        console.log("Clear button clicked");
        const confirmClear = confirm("Are you sure you want to clear the generated content?");

        if (!confirmClear) return;

        writerOutput.innerHTML = `
            <p>Your AI-generated content will appear here...</p>
        `;

        writerPrompt.value = "";

        wordCounter.textContent = "Words: 0";
        charCounter.textContent = "Characters: 0";

    });

}