require("dotenv").config();
const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

async function parseBloodReport(text) {
  const prompt = `
You are extracting REAL lab test results from OCR text.

Rules:

- Only return measured numeric values
- Ignore reference ranges
- Ignore labels without numbers
- Ignore garbage OCR text
- If unsure → leave field empty

Return clean JSON:

{
  "Hemoglobin": "",
  "WBC": "",
  "Neutrophils": "",
  "Lymphocytes": "",
  "Monocytes": "",
  "Eosinophils": "",
  "ESR": ""
}

OCR TEXT:
${text}
`;
  const completion = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [{ role: "user", content: prompt }],
  });

  return completion.choices[0].message.content;
}

module.exports = parseBloodReport;
