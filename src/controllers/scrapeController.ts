import { Request, Response } from "express";
import { scrapeWithPuppeteer } from "../services/puppeteerService";
import { getOgData } from "../services/scrapeService";

const cache: {
  [url: string]: { ogImage: string; ogTitle: string; ogSiteName: string };
} = {};

export const scrapeController = async (req: Request, res: Response) => {
  const url = req.query.url as string;

  if (!url) {
    return res.status(400).json({ error: "Debe proveer la URL en la query string con el parámetro 'url'" });
  }

  // Si la URL ya está cacheada, la retornamos
  if (cache[url]) {
    return res.json(cache[url]);
  }

  try {
    const result = await getOgData(url);
    // Transformamos el resultado a la forma esperada
    const transformedResult = {
      ogTitle: result.ogTitle,
      ogImage: result.ogImage,
      ogSiteName: result.ogSiteName,
    };
    cache[url] = transformedResult;
    return res.json(transformedResult);
  } catch (error) {
    console.error("Error en getOgData:", error);
    try {
      const result = await scrapeWithPuppeteer(url);
      const transformedResult = {
        ogTitle: result.title,
        ogImage: result.image,
        ogSiteName: result.description,
      };
      cache[url] = transformedResult;
      return res.json(transformedResult);
    } catch (error) {
      console.error("Error en scrapeWithPuppeteer:", error);
      return res.status(500).json({ error: `No se pudo obtener la información, ${error}` });
    }
  } finally {
    console.log("Scrape finalizado");
  }
};
