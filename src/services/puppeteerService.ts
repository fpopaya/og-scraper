import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";

export const scrapeWithPuppeteer = async (url: string) => {
  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath:
      process.env.CHROME_EXECUTABLE_PATH ||
      (await chromium.executablePath(
        "/var/task/node_modules/@sparticuz/chromium/bin"
      )),
  });
  const page = await browser.newPage();

  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3"
  );

  await page.setRequestInterception(true);
  page.on("request", (request) => {
    const resourceType = request.resourceType();
    if (
      resourceType === "image" ||
      resourceType === "stylesheet" ||
      resourceType === "font"
    ) {
      request.abort();
    } else {
      request.continue();
    }
  });

  const response = await page.goto(url, {
    waitUntil: "domcontentloaded",
    timeout: 30000,
  });

  const ogImage = await page
    .$eval('meta[property="og:image"]', (el) => el?.content || "")
    .catch(() => "");
  const ogTitle = await page
    .$eval('meta[property="og:title"]', (el) => el?.content || "")
    .catch(() => "");
  const ogSiteName = await page
    .$eval('meta[property="og:site_name"]', (el) => el?.content || "")
    .catch(() => "");

  await browser.close();
  return { ogImage, ogTitle, ogSiteName };
};
