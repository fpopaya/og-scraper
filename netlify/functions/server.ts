// src/netlify/functions/server.ts
import { APIGatewayProxyHandler } from 'aws-lambda';
import { scrapeWithPuppeteer } from '../../src/services/puppeteerService';

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const { url } = JSON.parse(event.body || '{}');

    if (!url) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "No se proporcionó la URL" }),
      };
    }

    const data = await scrapeWithPuppeteer(url);
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
