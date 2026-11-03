import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { mkdtemp, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { minify } from "html-minifier-terser";

const root = process.cwd();
const srcDir = path.join(root, "src");
const outDir = path.join(root, "dist");

const minifyOptions = {
  collapseWhitespace: true,
  conservativeCollapse: true,
  collapseBooleanAttributes: true,
  removeComments: true,
  removeRedundantAttributes: true,
  removeScriptTypeAttributes: true,
  removeStyleLinkTypeAttributes: true,
  useShortDoctype: true,
  minifyCSS: { level: 1 },
  minifyJS: {
    compress: { toplevel: false },
    mangle: { toplevel: false, reserved: ["createCards"] },
  },
};

const files = (await readdir(srcDir)).filter((name) => name.endsWith(".html")).sort();
if (files.length === 0) throw new Error("src 里没有可压缩的 HTML");

await rm(outDir, { recursive: true, force: true });
mkdirSync(outDir);
const checkDir = await mkdtemp(path.join(tmpdir(), "magic-html-"));

let before = 0;
let after = 0;

try {
  for (const name of files) {
    const source = await readFile(path.join(srcDir, name), "utf8");
    const compressed = await minify(source, minifyOptions);
    assertPage(name, source, compressed, checkDir);
    await writeFile(path.join(outDir, name), compressed);

    const sourceBytes = Buffer.byteLength(source);
    const compressedBytes = Buffer.byteLength(compressed);
    before += sourceBytes;
    after += compressedBytes;
    const saved = (100 * (1 - compressedBytes / sourceBytes)).toFixed(1);
    console.log(`${name}: ${sourceBytes} -> ${compressedBytes} bytes (${saved}% smaller)`);
  }
} finally {
  await rm(checkDir, { recursive: true, force: true });
}

const saved = (100 * (1 - after / before)).toFixed(1);
console.log(`total: ${before} -> ${after} bytes (${saved}% smaller)`);

function assertPage(name, source, compressed, checkDir) {
  if (!compressed.trim()) throw new Error(`${name}: 压缩结果为空`);
  if (!/^<!doctype html>/i.test(compressed)) throw new Error(`${name}: 缺少 doctype`);

  for (const id of source.matchAll(/\sid="([^"]+)"/g)) {
    const token = id[1];
    const kept = compressed.includes(`id="${token}"`) || compressed.includes(`id=${token}`) || compressed.includes(`id='${token}'`);
    if (!kept) throw new Error(`${name}: 压缩后丢失 id="${token}"`);
  }

  const inlineScripts = [...compressed.matchAll(/<script\b(?![^>]*\bsrc\b)[^>]*>([\s\S]*?)<\/script>/gi)];
  inlineScripts.forEach((match, index) => {
    const code = match[1];
    if (!code.trim()) return;
    const file = path.join(checkDir, `${name}.${index}.js`);
    writeFileSync(file, code);
    try {
      execFileSync(process.execPath, ["--check", file], { stdio: "pipe" });
    } catch (error) {
      const detail = error.stderr?.toString() || error.message;
      throw new Error(`${name}: 内联脚本压缩后语法无效\n${detail}`);
    }
  });

  if (name === "word-card.html") {
    if (!compressed.includes("createCards()")) {
      throw new Error("word-card.html: 按钮仍需调用 createCards()");
    }
    if (!/function createCards\(/.test(compressed)) {
      throw new Error("word-card.html: createCards 被压缩改名，页面按钮会失效");
    }
  }
}
