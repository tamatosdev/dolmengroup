const fs = require("fs");
const outDir = "D:/Dolmen-group/.tmp-contact-restore";
const lines = fs
  .readFileSync(
    "C:/Users/pc/.cursor/projects/d-Dolmen-group/agent-transcripts/ecd1900f-d656-42cd-8442-d5e35d2b7883/ecd1900f-d656-42cd-8442-d5e35d2b7883.jsonl",
    "utf8"
  )
  .split(/\n/);

const allCss = [];
for (let i = 507; i < 576; i++) {
  // stop before unrelated hero/nav changes; include contact work through L575
  let o;
  try {
    o = JSON.parse(lines[i]);
  } catch {
    continue;
  }
  const c = o.message && o.message.content;
  if (!Array.isArray(c)) continue;
  for (const p of c) {
    if (
      p.type === "tool_use" &&
      p.name === "StrReplace" &&
      (p.input.path || "").replace(/\\/g, "/").endsWith("globals.css")
    ) {
      allCss.push({
        line: i + 1,
        replace_all: !!p.input.replace_all,
        old: p.input.old_string,
        new: p.input.new_string,
      });
    }
  }
}

let css = fs.readFileSync("D:/Dolmen-group/src/app/globals.css", "utf8");
const fails = [];
for (const patch of allCss) {
  if (!css.includes(patch.old)) {
    fails.push({ line: patch.line, old: patch.old, new: patch.new });
    continue;
  }
  css = patch.replace_all
    ? css.split(patch.old).join(patch.new)
    : css.replace(patch.old, patch.new);
}
console.log("ops", allCss.length, "fails", fails.map((f) => f.line));

// Manually apply failed contact patches by replacing closest existing contact rules
function replaceRule(cssText, selectorHint, newBlock) {
  // Try to find selector and replace until matching closing brace at depth 0
  const idx = cssText.indexOf(selectorHint);
  if (idx === -1) return { css: cssText, ok: false };
  let i = cssText.indexOf("{", idx);
  if (i === -1) return { css: cssText, ok: false };
  let depth = 0;
  let end = i;
  for (; end < cssText.length; end++) {
    if (cssText[end] === "{") depth++;
    else if (cssText[end] === "}") {
      depth--;
      if (depth === 0) {
        end++;
        break;
      }
    }
  }
  // include selectors before {
  return {
    css: cssText.slice(0, idx) + newBlock.trim() + cssText.slice(end),
    ok: true,
  };
}

for (const f of fails) {
  if (!/contact-banner|contact-talk/.test(f.old + f.new)) continue;
  // If new is a full replacement of old-shaped content, try inserting new if old not found
  // Prefer: if new contains contact rules, and old was supposed to exist, apply new's contact portion
  if (css.includes(f.new.trim())) continue;
  // try replace first selector in old
  const m = f.old.match(/(\.contact-[a-z0-9-]+(?:\s*[^{,]*)*)\s*\{/i);
  if (m) {
    const blockMatch = f.new.match(
      new RegExp(
        m[1].replace(/[.*+?^${}()|[\]\\]/g, "\\$&") +
          "[\\s\\S]*?\\n\\}",
      )
    );
    // simpler: if f.new looks like complete rules replacing f.old, and f.old not in css,
    // find first contact selector from old in css and replace with corresponding from new
  }
}

fs.writeFileSync(outDir + "/globals.replayed.css", css);

// Extract all contact-related CSS including media query lines
const outLines = [];
const arr = css.split(/\n/);
let mode = null; // null | rule | media
let brace = 0;
let mediaBrace = 0;
let buf = [];
let inMedia = false;
let mediaHasContact = false;
let mediaBuf = [];

for (let i = 0; i < arr.length; i++) {
  const line = arr[i];
  if (/^@media/.test(line.trim())) {
    inMedia = true;
    mediaHasContact = false;
    mediaBuf = [line];
    mediaBrace = 0;
    for (const ch of line) {
      if (ch === "{") mediaBrace++;
      if (ch === "}") mediaBrace--;
    }
    continue;
  }
  if (inMedia) {
    mediaBuf.push(line);
    for (const ch of line) {
      if (ch === "{") mediaBrace++;
      if (ch === "}") mediaBrace--;
    }
    if (/contact-banner|contact-talk/.test(line)) mediaHasContact = true;
    if (mediaBrace <= 0) {
      if (mediaHasContact) {
        // filter media block to only contact rules + wrapper
        const filtered = [];
        filtered.push(mediaBuf[0]);
        let keep = false;
        let b = 0;
        let chunk = [];
        for (let j = 1; j < mediaBuf.length - 1; j++) {
          const L = mediaBuf[j];
          if (b === 0 && /contact-banner|contact-talk/.test(L)) {
            keep = true;
          }
          if (keep) chunk.push(L);
          for (const ch of L) {
            if (ch === "{") b++;
            if (ch === "}") b--;
          }
          if (keep && b === 0 && L.includes("}")) {
            filtered.push(...chunk);
            chunk = [];
            keep = false;
          }
        }
        filtered.push(mediaBuf[mediaBuf.length - 1]);
        outLines.push(filtered.join("\n"));
      }
      inMedia = false;
      mediaBuf = [];
    }
    continue;
  }

  if (/^\.contact-(banner|talk)/.test(line.trim()) || /^  \.contact-(banner|talk)/.test(line)) {
    buf = [line];
    brace = 0;
    for (const ch of line) {
      if (ch === "{") brace++;
      if (ch === "}") brace--;
    }
    mode = "rule";
    if (brace === 0 && line.includes("}")) {
      outLines.push(buf.join("\n"));
      mode = null;
      buf = [];
    }
    continue;
  }
  if (mode === "rule") {
    buf.push(line);
    for (const ch of line) {
      if (ch === "{") brace++;
      if (ch === "}") brace--;
    }
    if (brace <= 0) {
      outLines.push(buf.join("\n"));
      mode = null;
      buf = [];
    }
  }
}

const contactCss = outLines.join("\n\n") + "\n";
fs.writeFileSync(outDir + "/contact-css-FINAL.css", contactCss);
console.log("contact css chars", contactCss.length);
console.log("blocks", outLines.length);
console.log(contactCss.slice(0, 2500));
console.log("\n...\n");
console.log(contactCss.slice(-2000));

// Dump failed patches that are contact-related for manual merge
const contactFails = fails.filter((f) =>
  /contact-banner|contact-talk/.test(f.old + f.new)
);
fs.writeFileSync(
  outDir + "/contact-css-fails.json",
  JSON.stringify(
    contactFails.map((f) => ({
      line: f.line,
      old: f.old,
      new: f.new,
    })),
    null,
    2
  )
);
console.log("contact fails", contactFails.map((f) => f.line));
