import fs from "fs";
import { brotliDecompressSync, gunzipSync } from "zlib";
import { Bench } from "tinybench";

const JSON_FILE = "pageinfo-en.json";
const BROTLI_JSON_FILE = "pageinfo-en.json.br";
const GZ_JSON_FILE = "pageinfo-en.json.gz";
const LARGE_JSON_FILE = "pageinfo-en-ja-es.json";
const BROTLI_LARGE_JSON_FILE = "pageinfo-en-ja-es.json.br";
const GZ_LARGE_JSON_FILE = "pageinfo-en-ja-es.json.gz";

function f1() {
  const data = fs.readFileSync(JSON_FILE, "utf8");
  return Object.keys(JSON.parse(data)).length;
}

function f2() {
  const data = brotliDecompressSync(fs.readFileSync(BROTLI_JSON_FILE));
  return Object.keys(JSON.parse(data)).length;
}

function f3() {
  const data = gunzipSync(fs.readFileSync(GZ_JSON_FILE));
  return Object.keys(JSON.parse(data)).length;
}

function f4() {
  const data = fs.readFileSync(LARGE_JSON_FILE, "utf8");
  return Object.keys(JSON.parse(data)).length;
}

function f5() {
  const data = brotliDecompressSync(fs.readFileSync(BROTLI_LARGE_JSON_FILE));
  return Object.keys(JSON.parse(data)).length;
}

function f6() {
  const data = gunzipSync(fs.readFileSync(GZ_LARGE_JSON_FILE));
  return Object.keys(JSON.parse(data)).length;
}

console.assert(f1() === 2633);
console.assert(f2() === 2633);
console.assert(f3() === 2633);
console.assert(f4() === 7767);
console.assert(f5() === 7767);
console.assert(f6() === 7767);

const bench = new Bench({ time: 100 });
bench
  .add("f1", f1)
  .add("f2", f2)
  .add("f3", f3)
  .add("f4", f4)
  .add("f5", f5)
  .add("f6", f6);
// await bench.warmup(); // make results more reliable, ref: https://github.com/tinylibs/tinybench/pull/50
await bench.run();

console.table(bench.table());
