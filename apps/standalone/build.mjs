import { build } from "esbuild";
import { readFile, writeFile, mkdir } from "node:fs/promises";

const entry = "apps/standalone/main.tsx";
const buildDir = "apps/standalone/.build";
const outHtml = "dist/fight-simulator.html";

await build({
  entryPoints: [entry],
  bundle: true,
  minify: true,
  format: "iife",
  target: ["es2018"],
  jsx: "automatic",
  outfile: `${buildDir}/app.js`,
  define: { "process.env.NODE_ENV": '"production"' },
  logLevel: "warning",
});

const js = await readFile(`${buildDir}/app.js`, "utf8");
const css = await readFile(`${buildDir}/app.css`, "utf8");
const template = await readFile("apps/standalone/template.html", "utf8");

const safeJs = js.replace(/<\/script>/g, "<\\/script>");

const html = template
  .replace("<!-- INLINE_CSS -->", () => `<style>\n${css}</style>`)
  .replace("<!-- INLINE_JS -->", () => `<script>\n${safeJs}</script>`);

await mkdir("dist", { recursive: true });
await writeFile(outHtml, html);

const written = await readFile(outHtml, "utf8");
const inlined = written.match(/<script>\n([\s\S]*)<\/script>/);
if (!inlined || inlined[1] !== safeJs) {
  console.error("FAIL: inline JS integrity check failed");
  process.exit(1);
}

const kb = Math.round(html.length / 1024);
console.log(`OK: ${outHtml} (${kb} KB)`);
