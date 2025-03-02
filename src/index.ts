import axios from "axios";
import * as cheerio from "cheerio";
import express from "express";
import puppeteer from "puppeteer";

const app = express();
const PORT = 3000;

app.get("/scrape", async (req, res) => {
  const url = req.query.url as string;

  try {
    const { data } = await axios.get(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
    });

    console.log(data);
    const $ = cheerio.load(data);

    const ogImage = $('meta[property="og:image"]').attr("content");
    const ogTitle = $('meta[property="og:title"]').attr("content");
    const ogSiteName = $('meta[property="og:site_name"]').attr("content");

    res.json({ ogImage, ogTitle, ogSiteName });
  } catch (error) {
    console.error("ERROR 1");
    console.error(error);
    try {
      console.log("Intentando con Puppeteer");
      const { ogImage, ogTitle, ogSiteName } = await scrapeWithPuppeteer(url);
      res.json({ ogImage, ogTitle, ogSiteName });
    } catch (error) {
      console.error("ERROR 2");
      console.error(error);
      res.status(500).json({ error: "No se pudo obtener la información" });
    }
  } finally {
    console.log("Scrape finalizado");
  }
});

const scrapeWithPuppeteer = async (url: string) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "domcontentloaded" });
  console.log("Puppeteer: Página cargada");
  console.log(page);

  const ogImage = await page.$eval(
    'meta[property="og:image"]',
    (el) => el.content
  );
  const ogTitle = await page.$eval(
    'meta[property="og:title"]',
    (el) => el.content
  );

  const ogSiteName = await page.$eval(
    'meta[property="og:site_name"]',
    (el) => el.content
  );

  await browser.close();
  return { ogImage, ogTitle, ogSiteName };
};

app.listen(PORT, () =>
  console.log(`Servidor corriendo en http://localhost:${PORT}`)
);
