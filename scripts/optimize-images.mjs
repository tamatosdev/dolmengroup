import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const roots = [path.resolve("assets"), path.resolve("public")];
const IMAGE_EXT = new Set([".jpg", ".jpeg", ".png", ".webp"]);
const MAX_WIDTH = 2400;

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(full)));
    else if (IMAGE_EXT.has(path.extname(entry.name).toLowerCase())) files.push(full);
  }
  return files;
}

function base(input, width) {
  let pipeline = sharp(input, { failOn: "none" }).rotate();
  if (width && width > MAX_WIDTH) {
    pipeline = pipeline.resize({ width: MAX_WIDTH, withoutEnlargement: true });
  }
  return pipeline;
}

async function optimizeFile(file) {
  const ext = path.extname(file).toLowerCase();
  const before = (await fs.stat(file)).size;
  const input = await fs.readFile(file);
  const meta = await sharp(input, { failOn: "none" }).metadata();

  let output;
  let outPath = file;
  let converted = false;

  if (ext === ".jpg" || ext === ".jpeg") {
    output = await base(input, meta.width)
      .jpeg({ quality: 82, mozjpeg: true, progressive: true })
      .toBuffer();
  } else if (ext === ".webp") {
    output = await base(input, meta.width).webp({ quality: 80 }).toBuffer();
  } else if (ext === ".png") {
    if (meta.hasAlpha) {
      const a = await base(input, meta.width)
        .png({ compressionLevel: 9, effort: 10, adaptiveFiltering: true })
        .toBuffer();
      const b = await base(input, meta.width)
        .png({ compressionLevel: 9, effort: 10, palette: true, quality: 85, colors: 256 })
        .toBuffer();
      output = a.length <= b.length ? a : b;
    } else {
      const jpegBuf = await base(input, meta.width)
        .jpeg({ quality: 82, mozjpeg: true, progressive: true })
        .toBuffer();
      const pngBuf = await base(input, meta.width)
        .png({ compressionLevel: 9, effort: 10, adaptiveFiltering: true })
        .toBuffer();

      if (jpegBuf.length <= pngBuf.length) {
        outPath = file.replace(/\.png$/i, ".jpg");
        output = jpegBuf;
        converted = outPath.toLowerCase() !== file.toLowerCase();
      } else {
        output = pngBuf;
      }
    }
  } else {
    return { file, before, after: before, skipped: true, converted: false, outPath: file };
  }

  if (!converted && output.length >= before * 0.98) {
    return { file, before, after: before, skipped: true, converted: false, outPath: file };
  }

  await fs.writeFile(outPath, output);
  if (converted) {
    await fs.unlink(file);
  }

  return { file, before, after: output.length, skipped: false, converted, outPath };
}

const files = (await Promise.all(roots.map(walk))).flat();
const conversions = [];
let beforeTotal = 0;
let afterTotal = 0;
let optimized = 0;
let skipped = 0;

for (const file of files) {
  try {
    const result = await optimizeFile(file);
    beforeTotal += result.before;
    afterTotal += result.after;
    if (result.skipped) {
      skipped += 1;
      console.log(`skip  ${path.relative(process.cwd(), file)}`);
    } else {
      optimized += 1;
      const saved = ((1 - result.after / result.before) * 100).toFixed(1);
      const label = result.converted
        ? `${path.relative(process.cwd(), file)} -> ${path.relative(process.cwd(), result.outPath)}`
        : path.relative(process.cwd(), file);
      console.log(
        `ok    ${label}  ${(result.before / 1024).toFixed(0)}KB -> ${(result.after / 1024).toFixed(0)}KB (-${saved}%)`,
      );
      if (result.converted) conversions.push({ from: file, to: result.outPath });
    }
  } catch (error) {
    console.error(`fail  ${path.relative(process.cwd(), file)}: ${error.message}`);
  }
}

await fs.writeFile(
  path.resolve("scripts/image-conversions.json"),
  JSON.stringify(
    conversions.map((c) => ({
      from: path.relative(process.cwd(), c.from).replaceAll("\\", "/"),
      to: path.relative(process.cwd(), c.to).replaceAll("\\", "/"),
    })),
    null,
    2,
  ),
);

console.log("\n---");
console.log(`files: ${files.length}, optimized: ${optimized}, skipped: ${skipped}, converted: ${conversions.length}`);
console.log(
  `images: ${(beforeTotal / 1024 / 1024).toFixed(2)} MB -> ${(afterTotal / 1024 / 1024).toFixed(2)} MB (saved ${((beforeTotal - afterTotal) / 1024 / 1024).toFixed(2)} MB)`,
);
