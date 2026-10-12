const fs = require("fs");
const outDir = "D:/Dolmen-group/.tmp-contact-restore";
const lines = fs
  .readFileSync(
    "C:/Users/pc/.cursor/projects/d-Dolmen-group/agent-transcripts/ecd1900f-d656-42cd-8442-d5e35d2b7883/ecd1900f-d656-42cd-8442-d5e35d2b7883.jsonl",
    "utf8"
  )
  .split(/\n/);

const allCss = [];
for (let i = 507; i < 631; i++) {
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

// Use the working-tree state just before contact? We don't have it.
// Instead: reconstruct CSS purely by applying patches that SUCCEED in sequence,
// and for failures that are contact-related, try fuzzy: if old looks like a contact block,
// find similar selector in css and replace, OR append the new contact portions.

let css = fs.readFileSync("D:/Dolmen-group/src/app/globals.css", "utf8");
const fails = [];
for (const patch of allCss) {
  if (css.includes(patch.old)) {
    css = patch.replace_all
      ? css.split(patch.old).join(patch.new)
      : css.replace(patch.old, patch.new);
  } else {
    fails.push(patch);
  }
}

// For failed contact patches: extract contact-only deltas from new_string
// and apply selector-level last-write-wins
function extractRules(text) {
  const rules = [];
  const re = /([^{}]+)\{([^{}]*)\}/g;
  let m;
  while ((m = re.exec(text))) {
    const sel = m[1].trim();
    if (/contact-banner|contact-talk/.test(sel)) {
      rules.push({ sel, body: m[2], raw: m[0] });
    }
  }
  return rules;
}

const selectorMap = new Map();
// First get rules already in css
for (const r of extractRules(css)) {
  selectorMap.set(r.sel.replace(/\s+/g, " "), r.body);
}

// Walk ALL patches in order - for each, update selector map from full new (and old removals)
for (const patch of allCss) {
  // rules removed/changed: take new version
  for (const r of extractRules(patch.new)) {
    selectorMap.set(r.sel.replace(/\s+/g, " "), r.body);
  }
}

// Also include media-query nested by capturing larger patches - simple approach fails for nested.
// Dump full new_strings of large contact inserts as reference file.

const bigNews = allCss
  .filter((p) => /contact-banner|contact-talk/.test(p.new) && p.new.length > 200)
  .map((p) => "/* PATCH L" + p.line + " */\n" + p.new);

fs.writeFileSync(outDir + "/contact-css-patches-raw.css", bigNews.join("\n\n"));
fs.writeFileSync(outDir + "/contact-css-blocks.css", fs.readFileSync(outDir + "/contact-css-blocks.css", "utf8")); // keep prior

// Better reconstruction: start empty contact sheet, apply sequential full-state for known big blocks
// Take L511 new (first insert), then apply subsequent contact patches as string replace on that virtual sheet + surrounding anchors

let virtual = "";
// Seed: after L511, the contact-banner block was inserted after dolmen-hero-content p
virtual = allCss.find((p) => p.line === 511).new;
// Now apply later patches that modify virtual if old is in virtual OR in a growing doc
let doc = css; // current with successful patches already applied above
// Re-run from scratch on a synthetic approach:

// Get snapshot from Read tool results in transcript that contain contact-talk {
const snapshots = [];
for (let i = 507; i < 631; i++) {
  let o;
  try {
    o = JSON.parse(lines[i]);
  } catch {
    continue;
  }
  const c = o.message && o.message.content;
  if (!Array.isArray(c)) continue;
  for (const p of c) {
    if (p.type === "tool_use" && p.name === "Read" && (p.input.path || "").includes("globals.css")) {
      // Read results are usually in next tool_result - not in same assistant message
    }
  }
}

// Parse tool_result lines for globals reads with contact
for (let i = 507; i < 631; i++) {
  let o;
  try {
    o = JSON.parse(lines[i]);
  } catch {
    continue;
  }
  if (o.role !== "tool" && o.role !== "assistant") {
    // some transcripts nest differently
  }
  const content = o.message && o.message.content;
  if (!Array.isArray(content)) continue;
  for (const p of content) {
    const text = p.text || p.content || "";
    if (typeof text === "string" && text.includes(".contact-talk") && text.includes("{") && text.length > 500) {
      snapshots.push({ line: i + 1, len: text.length });
    }
    if (p.type === "tool_result" || p.type === "tool_use") {
      const r = JSON.stringify(p);
      if (r.includes(".contact-talk {") && r.length > 1000) {
        snapshots.push({ line: i + 1, type: p.type, name: p.name, len: r.length });
      }
    }
  }
}
console.log("snapshots", snapshots);
console.log("fails remaining", fails.length, fails.map((f) => f.line));
console.log("selectorMap size", selectorMap.size);

// Write selector map as CSS
let out = "/* Reconstructed contact CSS (last body per selector, non-media) */\n\n";
for (const [sel, body] of selectorMap) {
  out += sel + " {" + body + "}\n\n";
}
fs.writeFileSync(outDir + "/contact-css-selectors.css", out);
console.log("wrote selectors", out.length);

// Also check role patterns
const roles = {};
for (let i = 507; i < 520; i++) {
  let o;
  try {
    o = JSON.parse(lines[i]);
  } catch {
    continue;
  }
  roles[o.role] = (roles[o.role] || 0) + 1;
}
console.log("roles sample", roles);
