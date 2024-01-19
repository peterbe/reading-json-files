import fs from "fs";
import { readFile } from "fs/promises";

import { brotliDecompressSync, brotliDecompress } from "zlib";

import { Bench } from "tinybench";

const bench = new Bench({ time: 100 });

const JSON_FILE = "pageinfo-en.json";
const BROTLI_JSON_FILE = "pageinfo-en.json.br";
const LARGE_JSON_FILE = "pageinfo-en-ja-es.json";
const BROTLI_LARGE_JSON_FILE = "pageinfo-en-ja-es.json.br";

function f1() {
  const data = fs.readFileSync(JSON_FILE, "utf8");
  return Object.keys(JSON.parse(data)).length;
}

function f2() {
  const data = brotliDecompressSync(fs.readFileSync(BROTLI_JSON_FILE));
  return Object.keys(JSON.parse(data)).length;
}

function f3() {
  const data = fs.readFileSync(LARGE_JSON_FILE, "utf8");
  return Object.keys(JSON.parse(data)).length;
}

function f4() {
  const data = brotliDecompressSync(fs.readFileSync(BROTLI_LARGE_JSON_FILE));
  return Object.keys(JSON.parse(data)).length;
}

async function f5() {
  const data = await readFile(LARGE_JSON_FILE, "utf8");
  return Object.keys(JSON.parse(data)).length;
}

async function f6() {
  const data = await brotliDecompressPromise(
    await readFile(BROTLI_LARGE_JSON_FILE)
  );
  return Object.keys(JSON.parse(data)).length;
}

function brotliDecompressPromise(data) {
  return new Promise((resolve, reject) => {
    brotliDecompress(data, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
}

console.assert(f1() === 2633);
console.assert(f2() === 2633);
console.assert(f3() === 7767);
console.assert(f4() === 7767);
console.assert((await f5()) === 7767);
console.assert((await f6()) === 7767);

bench
  .add("f1", f1)
  .add("f2", f2)
  .add("f3", f3)
  .add("f4", f4)
  .add("f5", f5)
  .add("f6", f6);

await bench.warmup(); // make results more reliable, ref: https://github.com/tinylibs/tinybench/pull/50
await bench.run();

console.table(bench.table());
