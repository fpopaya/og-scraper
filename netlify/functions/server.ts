import dotenv from "dotenv";
import express from "express";
import serverless from "serverless-http";
import { scrapeController } from "../../src/controllers/scrapeController";

dotenv.config();

const app = express();
const router = express.Router();

router.get("/scrape", scrapeController);

app.use("/.netlify/functions/server", router);

module.exports.handler = serverless(app);
