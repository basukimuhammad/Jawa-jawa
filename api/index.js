import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
import { translate } from '../src_translator.js';

const root = fileURLToPath(new URL('..', import.meta.url));
let sourcePromise;

async function source() {
  sourcePromise ??= readFile(root + '/app.jawa', 'utf8');
  return sourcePromise;
}

function json(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(body));
}

async function body(req) {
  let raw = '';
  for await (const chunk of req) raw += chunk;
  if (raw.length > 64 * 1024) throw new Error('Kode terlalu besar. Maksimal 64 KB.');
  return JSON.parse(raw || '{}');
}

export default async function handler(req, res) {
  if (req.method === 'GET' && (req.url === '/' || req.url === '')) {
    const jawa = await source();
    const start = jawa.indexOf('const html = `');
    const end = jawa.lastIndexOf('`;');
    if (start < 0 || end < 0) return json(res, 500, { ok: false, error: 'Template aplikasi tidak valid.' });
    const html = jawa.slice(start + 'const html = `'.length, end).replace(/\\`/g, '`');
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'no-store');
    return res.end(html);
  }

  if (req.method === 'POST' && req.url === '/api/run') {
    try {
      const data = await body(req);
      const code = String(data.code ?? '');
      if (!code.trim()) return json(res, 400, { ok: false, error: 'Kode kosong.' });

      const js = translate(code);
      const logs = [];
      const sandbox = {
        console: {
          log: (...args) => logs.push(args.map(formatValue).join(' ')),
          error: (...args) => logs.push('[error] ' + args.map(formatValue).join(' ')),
          warn: (...args) => logs.push('[warn] ' + args.map(formatValue).join(' '))
        },
        Math, JSON, Array, Object, String, Number, Boolean, Date, RegExp, Map, Set,
        parseInt, parseFloat, isNaN, isFinite
      };

      const context = vm.createContext(sandbox);
      const script = new vm.Script(`'use strict';\n${js}`);
      script.runInContext(context, { timeout: 1500 });
      return json(res, 200, { ok: true, output: logs.join('\n') });
    } catch (error) {
      return json(res, 200, { ok: false, error: error?.message || String(error) });
    }
  }

  json(res, 404, { ok: false, error: 'Route tidak ditemukan.' });
}

function formatValue(value) {
  if (typeof value === 'string') return value;
  try { return JSON.stringify(value); } catch { return String(value); }
}
