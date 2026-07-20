const generateBtn = document.getElementById("generate-resume-btn");
const output = document.getElementById("resume-output");
const copyBtn = document.getElementById("copy-resume-btn");
const downloadPdfBtn = document.getElementById("download-pdf-btn");

generateBtn.addEventListener("click", async () => {

    const name = document.getElementById("full-name").value.trim();
const email = document.getElementById("email").value.trim();

if (name === "" || email === "") {

    alert("Please enter at least your Name and Email.");

    return;

}
    const phone = document.getElementById("phone").value;
    const address = document.getElementById("address").value;
    const education = document.getElementById("education").value;
    const skills = document.getElementById("skills").value;
    const experience = document.getElementById("experience").value;
    const projects = document.getElementById("projects").value;

output.innerHTML = `
<div class="resume-output">
    <h2>⏳ Generating Resume...</h2>
    <p>Please wait while WowGe AI creates your ATS-friendly resume.</p>
</div>
`;
copyBtn.style.display = "none";

try {

    const response = await fetch("/resume", {

        method: "POST",

        headers: {

            "Content-Type": "application/json"

        },

        body: JSON.stringify({

            name,
            email,
            phone,
            address,
            education,
            skills,
            experience,
            projects

        })

    });

    const data = await response.json();
    copyBtn.style.display = "block";

   output.innerHTML = `
<div class="resume-output">
    <h2>📄 Resume Preview</h2>
    <pre>${data.resume}</pre>
</div>
`;

} catch (error) {

  output.innerHTML = `
<div class="resume-output">
    <h2>❌ Error</h2>
    <p>Failed to generate resume. Please try again.</p>
</div>
`;

copyBtn.style.display = "none";

}

});
copyBtn.addEventListener("click", async () => {

    const text = output.innerText;

    if (!text.trim()) {

        alert("No resume available to copy.");

        return;

    }

    await navigator.clipboard.writeText(text);

    alert("✅ Resume copied successfully!");

});
downloadPdfBtn.addEventListener("click", () => {

    const resumeText = output.innerText.trim();

    if (!resumeText) {

        alert("Please generate a resume first.");

        return;

    }

    const { jsPDF } = window.jspdf;

    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
doc.setFontSize(22);
doc.text("WowGe AI Professional Resume", 15, 20);

doc.setDrawColor(0, 102, 204);
doc.setLineWidth(0.6);
doc.line(15, 24, 195, 24);

    let y = 35;

doc.setFont("helvetica", "normal");
doc.setFontSize(11);

const lines = doc.splitTextToSize(resumeText, 180);

lines.forEach((line) => {

    const text = line.trim();

    if (
        text.startsWith("Name") ||
        text.startsWith("Email") ||
        text.startsWith("Phone") ||
        text.startsWith("Address") ||
        text.startsWith("Education") ||
        text.startsWith("Skills") ||
        text.startsWith("Experience") ||
        text.startsWith("Projects")
    ) {

        doc.setFont("helvetica", "bold");

    } else {

        doc.setFont("helvetica", "normal");

    }

    doc.text(text, 15, y);

    y += 7;

});

    const userName = document
    .getElementById("full-name")
    .value
    .trim()
    .replace(/\s+/g, "_");

const fileName = userName
    ? `${userName}_Resume.pdf`
    : "WowGe_AI_Resume.pdf";

doc.save(fileName);

});