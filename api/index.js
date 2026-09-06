import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { translate } from '../src_translator.js';

const jawaPath = fileURLToPath(new URL('../app.jawa', import.meta.url));
const jawaSource = await readFile(jawaPath, 'utf8');
const jsSource = translate(jawaSource);

export default async function handler(req, res) {
  try {
    const run = new Function('req', 'res', jsSource);
    await run(req, res);
    if (!res.writableEnded) {
      res.statusCode = 204;
      res.end();
    }
  } catch (err) {
    if (!res.headersSent) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
    }
    res.end(JSON.stringify({ error: err?.message ?? String(err) }));
  }
}
