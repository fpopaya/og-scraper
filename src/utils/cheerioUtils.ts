import * as cheerio from "cheerio";

export const extractOgData = (html: string) => {
  const $ = cheerio.load(html);

  const ogImage = $('meta[property="og:image"]').attr("content") || '';
  const ogTitle = $('meta[property="og:title"]').attr("content") || '';
  const ogSiteName = $('meta[property="og:site_name"]').attr("content") || '';

  return { ogImage, ogTitle, ogSiteName };
};