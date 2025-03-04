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
    // Transformamos el resultado para que cumpla con la interfaz del caché
    const transformedResult = {
      ogTitle: result.ogTitle,
      ogImage: result.ogImage,
      ogSiteName: result.ogSiteName,
    };
    cache[url] = transformedResult;
    res.json(transformedResult);
  } catch (error) {
    console.error(error);
    try {
      const result = await scrapeWithPuppeteer(url);
      const transformedResult = {
        ogTitle: result.title,
        ogImage: result.image,
        ogSiteName: result.description,
      };
      cache[url] = transformedResult;
      res.json(transformedResult);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: `No se pudo obtener la información, ${error}` });
    }
  } finally {
    console.log("Scrape finalizado");
  }
};
