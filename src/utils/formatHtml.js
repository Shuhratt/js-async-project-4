import axios from 'axios';
import { load } from 'cheerio';
import fs from 'fs';
import https from 'https';
import formatLink from './formatLink.js';

const axiosInstance = axios.create({
  responseType: 'stream',
  httpsAgent: new https.Agent({
    rejectUnauthorized: false,
  }),
});

const formatHtml = (pageUrl, html) => {
  if (!pageUrl) throw new Error('Не указан url');
  if (!html) throw new Error('Не указан html');

  const base = new URL('/', pageUrl).origin; // базовый url
  const { host, pathname } = new URL(pageUrl, base); // 

  const nameStartDirectory = formatLink(`${host}${pathname}`);
  const nameStartFile = formatLink(`${host}`);

  if (!fs.existsSync(`${nameStartDirectory}_files`)) {
    // Cоздаём папку для картинок
    fs.mkdirSync(`${nameStartDirectory}_files`, { recursive: true });
  }

  const $ = load(html);
  $('img').each(async (_, el) => {
    try {
      const src = $(el).attr('src');
      const alt = $(el).attr('alt');
      const [path, ext] = src.split('.');
      const isRelativeLink = new URL(src, base).origin === base;

      if (isRelativeLink) {
        const nameDirectory = `${nameStartDirectory}_files/${nameStartFile}${formatLink(path)}`;
        const fullNameDirectory = `${nameDirectory}.${ext}`;

        const img = $(`<img src="/${fullNameDirectory}" alt="${alt}"/>`);
        $(el).replaceWith(img);

        const url = new URL(src, base).toString();
        const { data } = await axiosInstance.get(url); //скачивание картинок
        await data.pipe(fs.createWriteStream(fullNameDirectory)); // загрузка картинок в папку
      }
    } catch (error) {
      throw error;
    }
  });

  return $.html();
};

export default formatHtml;
