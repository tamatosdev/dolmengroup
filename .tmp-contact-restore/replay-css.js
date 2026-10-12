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
console.log("allCss ops", allCss.length);

let css = fs.readFileSync("D:/Dolmen-group/src/app/globals.css", "utf8");
let ok = 0;
let fail = 0;
const fails = [];
for (const patch of allCss) {
  if (!css.includes(patch.old)) {
    fail++;
    fails.push({
      line: patch.line,
      preview: patch.old.slice(0, 100).replace(/\n/g, "|"),
    });
    continue;
  }
  css = patch.replace_all
    ? css.split(patch.old).join(patch.new)
    : css.replace(patch.old, patch.new);
  ok++;
}
console.log("applied", ok, "failed", fail);
fs.writeFileSync(outDir + "/css-fails.json", JSON.stringify(fails, null, 2));
fs.writeFileSync(outDir + "/globals.replayed.css", css);

const contactOnly = [];
const cssLines = css.split(/\n/);
let collecting = false;
let buf = [];
let depthHint = 0;
for (let i = 0; i < cssLines.length; i++) {
  const l = cssLines[i];
  if (/^\.contact-(banner|talk)/.test(l.trim()) || / \.contact-(banner|talk)/.test(l)) {
    collecting = true;
  }
  if (collecting) {
    buf.push(l);
    if (l.includes("{")) depthHint++;
    if (l.includes("}")) depthHint--;
    if (collecting && depthHint <= 0 && l.includes("}")) {
      contactOnly.push(buf.join("\n"));
      buf = [];
      collecting = false;
      depthHint = 0;
    }
  }
}
fs.writeFileSync(outDir + "/contact-css-blocks.css", contactOnly.join("\n\n") + "\n");
console.log("contact blocks", contactOnly.length);
console.log("contact css chars", contactOnly.join("\n\n").length);
