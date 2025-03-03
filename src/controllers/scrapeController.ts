import { Request, Response } from "express";
import { scrapeWithPuppeteer } from "../services/puppeteerService";
import { getOgData } from "../services/scrapeService";

const cache: {
  [url: string]: { ogImage: string; ogTitle: string; ogSiteName: string };
} = {};

export const scrapeController = async (req: Request, res: Response) => {
  const url = req.query.url as string;

  if (cache[url]) return res.json(cache[url]);

  try {
    const result = await getOgData(url);
    cache[url] = result;
    res.json(result);
  } catch (error) {
    console.error(error);
    try {
      const result = await scrapeWithPuppeteer(url);
      cache[url] = result;
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "No se pudo obtener la información" });
    }
  } finally {
    console.log("Scrape finalizado");
  }
};
