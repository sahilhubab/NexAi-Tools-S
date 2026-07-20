const translateBtn = document.querySelector("#translate-btn");

const translatorInput = document.querySelector("#translator-input");

const translatorOutput = document.querySelector("#translator-output");

const fromLanguage = document.querySelector("#from-language");

const toLanguage = document.querySelector("#to-language");

const swapLanguages = document.querySelector("#swap-languages");

const clearTranslationBtn = document.querySelector("#clear-translation-btn");

if (swapLanguages) {

    swapLanguages.addEventListener("click", function () {

        if (fromLanguage.value === "auto") {

            alert("Auto Detect can't be swapped.");

            return;

        }

        const temp = fromLanguage.value;

        fromLanguage.value = toLanguage.value;

        toLanguage.value = temp;

        const translatedText = translatorOutput.querySelector(".writer-result");

if (translatedText) {

    translatorInput.value = translatedText.innerText;

    translatorOutput.innerHTML = `
        <p>Your translation will appear here...</p>
    `;

}

    });

}
if (translateBtn) {

    translateBtn.addEventListener("click", async function () {

        const text = translatorInput.value.trim();

        const from = fromLanguage.value;
        const to = toLanguage.value;

        if (text === "") {

            alert("Please enter text to translate.");

            return;

        }

        translatorOutput.innerHTML = "<p>🌍 Translating...</p>";

        try {

            const response = await fetch("/chat", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    message: `
Translate the following text.

Source Language: ${from}

Target Language: ${to}

Text:
${text}

Only return the translated text.
`

                })

            });

            const data = await response.json();

          translatorOutput.innerHTML = `
    <div class="writer-header">

        <h3>🌍 Translation</h3>

        <button id="copy-translation-btn">
            📋 Copy
        </button>

    </div>

    <div class="writer-result">
        ${marked.parse(data.reply)}
    </div>
`;

const copyTranslationBtn = document.querySelector("#copy-translation-btn");

copyTranslationBtn.addEventListener("click", function () {

    navigator.clipboard.writeText(data.reply);

    copyTranslationBtn.textContent = "✅ Copied!";

    setTimeout(() => {

        copyTranslationBtn.textContent = "📋 Copy";

    }, 2000);

});

        } catch (error) {

            translatorOutput.innerHTML = `
                <p>❌ Translation failed.</p>
            `;

            console.error(error);

        }

    });

}
if (clearTranslationBtn) {

    clearTranslationBtn.addEventListener("click", function () {

        const confirmClear = confirm("Clear translation?");

        if (!confirmClear) return;

        translatorInput.value = "";

        translatorOutput.innerHTML = `
            <p>Your translation will appear here...</p>
        `;

        fromLanguage.value = "auto";
        toLanguage.value = "hi";

    });

}