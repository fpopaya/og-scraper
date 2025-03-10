export const scrapeWithPuppeteer = async (url: string) => {
  let puppeteerLib: any;
  let executablePath: string | undefined;
  let args: string[];
  let defaultViewport: any;

  if (process.env.NODE_ENV === 'production') {
    puppeteerLib = require('puppeteer-core');
    const chromium = require('@sparticuz/chromium');
    // Usa el fallback de variable de entorno, si está definido
    executablePath = process.env.CHROME_EXECUTABLE_PATH || await chromium.executablePath();
    if (!executablePath || typeof executablePath !== "string") {
      throw new Error(`No se encontró un ejecutable válido de Chromium. Valor obtenido: ${executablePath}`);
    }
    args = [...chromium.args, '--disable-dev-shm-usage'];
    defaultViewport = chromium.defaultViewport;
  } else {
    puppeteerLib = require('puppeteer');
    executablePath = undefined;
    args = ['--no-sandbox', '--disable-setuid-sandbox'];
    defaultViewport = null;
  }
  

  const browser = await puppeteerLib.launch({
    args,
    executablePath,
    defaultViewport,
    headless: true,
  });

  const page = await browser.newPage();

  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3"
  );

  await page.setRequestInterception(true);
  page.on("request", (request: { resourceType: () => any; abort: () => void; continue: () => void; }) => {
    const resourceType = request.resourceType();
    if (["image", "stylesheet", "font"].includes(resourceType)) {
      request.abort();
    } else {
      request.continue();
    }
  });

  await page.goto(url, {
    waitUntil: "domcontentloaded",
    timeout: 30000,
  });

  // Esperar un poco si es necesario (opcional)
  // await page.waitForTimeout(1000);

  // Extraer los meta tags de forma segura
  const ogImageElement = await page.$('meta[property="og:image"]');
  const ogTitleElement = await page.$('meta[property="og:title"]');
  const ogDescriptionElement = await page.$('meta[property="og:description"]');

  const ogImage = ogImageElement
    ? await ogImageElement.evaluate((el: { getAttribute: (arg0: string) => any; }) => el.getAttribute("content"))
    : null;
  const ogTitle = ogTitleElement
    ? await ogTitleElement.evaluate((el: { getAttribute: (arg0: string) => any; }) => el.getAttribute("content"))
    : null;
  const ogDescription = ogDescriptionElement
    ? await ogDescriptionElement.evaluate((el: { getAttribute: (arg0: string) => any; }) => el.getAttribute("content"))
    : null;

  await browser.close();

  return {
    title: ogTitle,
    image: ogImage,
    description: ogDescription,
  };
};
