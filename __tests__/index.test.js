import { execSync } from 'child_process';
import { readFile, mkdtemp } from 'fs/promises';
import request from 'supertest';
import { existsSync, statSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import formatHtml from '../src/utils/formatHtml';
import { load } from 'cheerio';
import server from '../server/server.js';

let htmlIn, htmlOut;
const pathHtml1 = join(`${__dirname}`, '..', '__fixtures__', 'page-base-link.html');
const pathHtml2 = join(`${__dirname}`, '..', '__fixtures__', 'page-modified-link.html');

beforeAll(async () => {
  // запускается ровно один раз перед всеми тестами
  const htmlInFile = await readFile(pathHtml1, 'utf-8');
  htmlIn = load(htmlInFile).html();

  const htmlOutFile = await readFile(pathHtml2, 'utf-8');
  htmlOut = load(htmlOutFile).html();

  const response = await request(server).get('/courses');
  expect(response.statusCode).toBe(200);
  expect(response.text).toBe(htmlInFile);
});

afterAll(() => {
  server.close();

  /**
   * добавить удаление папок
   */
});

beforeEach(async () => {
  // Запускается перед каждым тестом
  await mkdtemp(join(tmpdir(), 'page-loader-')); //каждая загрузка должна выполняться в своей временной директории
});

describe('page-loader', () => {
  test('version', () => {
    const version = execSync('node ./src/index.js -V').toString().trim();
    expect(version).toBe('0.0.1');
  });

  test('format html', () => {
    expect(formatHtml('http://localhost:3001/courses', htmlIn)).toEqual(htmlOut);
  });

  describe('full create', () => {
    execSync('node ./src/index.js --output /var/tmp https://ru.hexlet.io/courses');

    test('check directory output', () => {
      const isDirectory = existsSync('/var/tmp') && statSync('/var/tmp').isDirectory();
      expect(isDirectory).toBe(true);
    });

    test('check exist file in derictory', () => {
      expect(existsSync('/var/tmp/ru-hexlet-io-courses.html')).toBe(true);
    });

    // test('check exist images in derictory', () => {});
  });
});
