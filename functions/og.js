const cheerio = require("cheerio");
const chromium = require("chrome-aws-lambda");
const puppeteer = require("puppeteer-core");
const axios = require("axios");

const cache = {};

const scrapeWithPuppeteer = async (url) => {
  console.log("Scrape com puppeteer");
  console.log("CHROME_EXECUTABLE_PATH:", process.env.CHROME_EXECUTABLE_PATH);
  const executablePath = process.env.CHROME_EXECUTABLE_PATH || (await chromium.executablePath);
  console.log("Executable Path:", executablePath);

  const browser = await puppeteer.launch({
    args: chromium.args,
    executablePath: executablePath,
    headless: true,
  });

  console.log("Browser launched");
  const page = await browser.newPage();

  console.log("Page created");

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

const getOgData = async (url) => {
  const { data } = await axios.get(url, {
    headers: { "User-Agent": "Mozilla/5.0" },
  });

  return extractOgData(data);
};

const extractOgData = (html) => {
  const $ = cheerio.load(html);

  const ogImage = $('meta[property="og:image"]').attr("content") || "";
  const ogTitle = $('meta[property="og:title"]').attr("content") || "";
  const ogSiteName = $('meta[property="og:site_name"]').attr("content") || "";

  return { ogImage, ogTitle, ogSiteName };
};

exports.handler = async function (event, context) {
  const url = event.queryStringParameters.url;

  if (cache[url])
    return {
      statusCode: 200,
      body: JSON.stringify({
        status: "Ok",
        ...cache[url],
      }),
    };

  try {
    const result = await getOgData(url);
    cache[url] = result;
    return {
      statusCode: 200,
      body: JSON.stringify({
        status: "Ok",
        ...result,
      }),
    };
  } catch (error) {
    console.error(error);
    console.log("ERROR cheerio");
    try {
      const result = await scrapeWithPuppeteer(url);
      cache[url] = result;
      return {
        statusCode: 200,
        body: JSON.stringify({
          status: "Ok",
          ...result,
        }),
      };
    } catch (error) {
      console.error(error);
      return {
        statusCode: 500,
        body: JSON.stringify({
          status: "Error",
          message: "An error occurred",
        }),
      };
    }
  } finally {
    console.log("Scrape finalizado");
  }
};
