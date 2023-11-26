import axios from 'axios';
import { load } from 'cheerio';
import formatLink from './formatLink.js';
import { writeFile } from 'fs/promises';
import fs from 'fs';
import https from 'https';

const axiosInstance = axios.create({
  responseType: 'stream',
  httpsAgent: new https.Agent({
    rejectUnauthorized: false,
  }),
});

const formatHtml = (pageUrl, html) => {
  if (!pageUrl) throw new Error('Не указан url');
  if (!html) throw new Error('Не указан html');

  const { host, pathname, origin } = new URL(pageUrl);
  const nameStart = formatLink(`${host}${pathname}`);

  if (!fs.existsSync(`${nameStart}_files`)) {
    // Cоздаём папку для картинок
    fs.mkdirSync(`${nameStart}_files`, { recursive: true });
  }

  const $ = load(html);
  $('img').each(async (_, el) => {
    try {
      const src = $(el).attr('src');
      const alt = $(el).attr('alt');
      const [path, ext] = src.split('.');

      const nameDirectory = `${nameStart}_files/${nameStart}${formatLink(path)}`;
      const fullNameDirectory = `${nameDirectory}.${ext}`;

      //пока что не работает с абсолютными ссылками
      const typeUrlImage = src.includes('https') ? 'absolute' : 'relative';
      const urlImage = {
        // absolute: src,
        relative: `${origin}${src}`,
      };

      const img = $(`<img src="/${fullNameDirectory}" alt="${alt}"/>`);
      $(el).replaceWith(img);

      const url = urlImage.relative;
      const { data } = await axiosInstance.get(url);
      await data.pipe(fs.createWriteStream(fullNameDirectory));
    } catch (error) {
      throw error;
    }
  });

  return $.html();
};

export default formatHtml;
