import express from "express";
import { scrapeController } from "./controllers/scrapeController";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/scrape", scrapeController);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
