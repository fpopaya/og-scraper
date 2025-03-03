# OG Scraper

OG Scraper es un servicio de scraping que extrae datos Open Graph (OG) de páginas web. Utiliza Express para manejar las solicitudes HTTP y Puppeteer y Cheerio para realizar el scraping.

## Estructura del Proyecto

og-scraper/
├── tsconfig.json
├── package.json
├── .env
├── .gitignore
├── .env-example
├── src/
│   ├── index.ts
│   ├── controllers/
│   │   └── scrapeController.ts
│   ├── services/
│   │   ├── puppeteerService.ts
│   │   └── scrapeService.ts
│   ├── utils/
│   │   └── cheerioUtils.ts

## Instalación

1. Clona el repositorio:

   ```sh
   git clone <URL_DEL_REPOSITORIO>
   cd og-scraper
   ```

2. Instala las dependencias:

   ```sh
   npm install
   ```

3. Crea un archivo [.env](http://_vscodecontentref_/7) basado en el archivo [.env-example](http://_vscodecontentref_/8):

   ```sh
   cp .env-example .env
   ```

4. Configura el puerto en el archivo [.env](http://_vscodecontentref_/9) si es necesario:
   ```env
   PORT=3001
   ```

## Uso

1. Inicia el servidor:

   ```sh
   npm start
   ```

2. Realiza una solicitud GET a `/scrape` con el parámetro [url](http://_vscodecontentref_/10):
   ```sh
   curl "http://localhost:3001/scrape?url=https://example.com"
   ```

## Estructura del Código

- **`src/index.ts`**: Configura y arranca el servidor Express.
- **`src/controllers/scrapeController.ts`**: Controlador que maneja las solicitudes de scraping.
- **`src/services/puppeteerService.ts`**: Servicio que utiliza Puppeteer para realizar el scraping.
- **`src/services/scrapeService.ts`**: Servicio que utiliza Axios y Cheerio para realizar el scraping.
- **`src/utils/cheerioUtils.ts`**: Utilidad que extrae datos OG del HTML utilizando Cheerio.

## Dependencias

- **Express**: Framework para aplicaciones web.
- **Puppeteer**: Librería para controlar un navegador web.
- **Cheerio**: Librería para manipular HTML en el servidor.
- **Axios**: Cliente HTTP basado en promesas.
- **dotenv**: Carga variables de entorno desde un archivo [.env](http://_vscodecontentref_/11).

## Licencia

Este proyecto está licenciado bajo la Licencia MIT.
