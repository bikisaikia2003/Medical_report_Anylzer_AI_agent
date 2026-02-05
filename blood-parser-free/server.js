const express = require("express");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs");

const extractText = require("./ocr");
const parseBloodReport = require("./aiParser");

const app = express();
app.use(cors());

const upload = multer({ dest: "uploads/" });

app.post("/parse", upload.single("report"), async (req, res) => {
  try {
    if(!req.file){
        return res.status(400).json({error:"No file uploaded"})
    }
    
    const file = req.file;
    console.log("Uploaded file:", file.originalname, file.mimetype);
    let rawText = await extractText(file.path);
    //rawText = rawText.replace(/[^\x00-\x7F]/g, "");
    rawText = rawText
      .replace(/[^\x00-\x7F]/g, "")
      .replace(/\s+/g, " ")
      .trim();

    const structured = await parseBloodReport(rawText);

    fs.unlinkSync(file.path);

    res.json({
      extractedText: rawText,
      structuredData: structured,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Parsing failed" });
  }
});

app.listen(3000, () =>
  console.log("🚀 Server running → http://localhost:3000")
);
