const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const mongoUri = process.env.MONGO_URI;
const collectionName = process.env.COLLECTION_NAME || "surveys_customers";

// Koneksi ke MongoDB
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.error("MongoDB connection error:", err));

// Schema dan model
const surveySchema = new mongoose.Schema({
  source: String,
  service: String,
  result: String,
  message: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Survey = mongoose.model("Survey", surveySchema, collectionName);

// Endpoint POST: Kirim data survey
app.post("/survey", async (req, res) => {
  try {
    const survey = new Survey(req.body);
    await survey.save();
    res.status(201).json({ message: "Data survei berhasil disimpan" });
  } catch (error) {
    console.error("Error menyimpan:", error);
    res.status(500).json({ message: "Gagal menyimpan data" });
  }
});

// ✅ Endpoint GET: Ambil semua data survey
app.get("/survey", async (req, res) => {
  try {
    const surveys = await Survey.find().sort({ createdAt: -1 });
    res.status(200).json(surveys);
  } catch (error) {
    console.error("Error mengambil data:", error);
    res.status(500).json({ message: "Gagal mengambil data" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
