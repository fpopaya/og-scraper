import dotenv from "dotenv";
import express from "express";
import serverless from "serverless-http";
import { scrapeController } from "./controllers/scrapeController";


dotenv.config();

const app = express();
// Agrega el middleware para parsear JSON si es necesario:
app.use(express.json());

const router = express.Router();
router.get("/scrape", scrapeController);

// Se expone la ruta con el prefijo de Netlify Functions:
app.use("/.netlify/functions/server", router);

module.exports.handler = serverless(app);
