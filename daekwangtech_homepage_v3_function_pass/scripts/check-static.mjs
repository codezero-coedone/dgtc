import { access, readdir, readFile, stat } from "node:fs/promises";
import { dirname, join, normalize } from "node:path";

const root = process.cwd();
const required = [
  "index.html",
  "styles.css",
  "src/main.jsx",
  "src/App.jsx",
  "src/admin.jsx",
  "src/adminContentSeed.js",
  "src/cmsClient.js",
  "src/designTokens.js",
  "src/panelState.js",
  "src/siteData.js",
  "assets/dk-logo.svg",
  "assets/hero-machine.jpg",
  "public/robots.txt",
  "public/sitemap.xml",
  "public/site.webmanifest",
];

async function exists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

const missing = [];
for (const file of required) {
  if (!(await exists(join(root, file)))) missing.push(file);
}

const sourceFiles = await readdir(root);
const htmlFiles = sourceFiles.filter((file) => file.endsWith(".html"));
const localRefPattern = /\b(?:href|src)=["']([^"']+)["']/g;
const cssUrlPattern = /url\(["']?([^"')]+)["']?\)/g;

function shouldSkip(ref) {
  return (
    ref === "" ||
    ref.startsWith("#") ||
    ref.startsWith("http://") ||
    ref.startsWith("https://") ||
    ref.startsWith("mailto:") ||
    ref.startsWith("tel:") ||
    ref.startsWith("data:")
  );
}

async function checkRef(baseFile, ref) {
  if (shouldSkip(ref)) return;
  const clean = ref.split("#")[0].split("?")[0];
  if (!clean) return;
  const target = clean.startsWith("/")
    ? normalize(join(root, clean.slice(1)))
    : normalize(join(root, dirname(baseFile), clean));
  if (!target.startsWith(root)) {
    missing.push(`${baseFile} -> ${ref} (outside root)`);
    return;
  }
  if (!(await exists(target))) missing.push(`${baseFile} -> ${ref}`);
}

for (const file of htmlFiles) {
  const content = await readFile(join(root, file), "utf8");
  if (content.includes("example.com")) missing.push(`${file} contains example.com`);
  for (const match of content.matchAll(localRefPattern)) {
    await checkRef(file, match[1]);
  }
}

const css = await readFile(join(root, "styles.css"), "utf8");
for (const match of css.matchAll(cssUrlPattern)) {
  await checkRef("styles.css", match[1]);
}

for (const file of ["robots.txt", "sitemap.xml", "public/robots.txt", "public/sitemap.xml"]) {
  const content = await readFile(join(root, file), "utf8");
  if (content.includes("example.com")) missing.push(`${file} contains example.com`);
}

const assetsStat = await stat(join(root, "assets"));
if (!assetsStat.isDirectory()) missing.push("assets directory");

if (missing.length) {
  console.error("Static/Vite source check failed:");
  for (const item of missing) console.error(`- ${item}`);
  process.exit(1);
}

console.log(`Static/Vite source check passed for ${htmlFiles.length} HTML pages.`);
