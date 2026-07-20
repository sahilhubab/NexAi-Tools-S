import express from "express";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.static("."));
app.use((req, res, next) => {
    console.log("Request:", req.originalUrl);
    next();
});

const PORT = 3000;

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

  let response;

try {

    response = await ai.models.generateContent({
        model: "gemini-flash-latest",
        contents: message,
    });

} catch (err) {

    console.log("⚠️ Flash model busy. Trying Flash Lite...");

    response = await ai.models.generateContent({
        model: "gemini-flash-lite-latest",
        contents: message,
    });

}
    res.json({
      reply: response.text,
    });

  } catch (error) {

    console.error(error);

    if (error.status === 429) {
      return res.status(429).json({
        reply: "⚠️ Daily Gemini API limit reached. Please try again tomorrow."
      });
    }
if (error.status === 503) {

    return res.status(503).json({
        reply: "⚠️ Gemini AI is busy right now. Please try again in a few minutes."
    });

}
    res.status(500).json({
      reply: "❌ Server Error. Please try again."
    });
  }
});

app.post("/resume", async (req, res) => {

    try {

        const {

            name,
            email,
            phone,
            address,
            education,
            skills,
            experience,
            projects

        } = req.body;

        const prompt = `
Create a professional ATS-friendly resume.

Name: ${name}
Email: ${email}
Phone: ${phone}
Address: ${address}

Education:
${education}

Skills:
${skills}

Work Experience:
${experience}

Projects:
${projects}

Write the resume in a clean and professional format.
`;

        let response;

        try {

            response = await ai.models.generateContent({

                model: "gemini-flash-latest",

                contents: prompt,

            });

        } catch {

            response = await ai.models.generateContent({

                model: "gemini-flash-lite-latest",

                contents: prompt,

            });

        }

        res.json({

            resume: response.text,

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({

            resume: "❌ Failed to generate resume."

        });

    }

});

app.listen(PORT, () => {
  console.log(`✅ Server Running: http://localhost:${PORT}`);
});