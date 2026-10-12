const fs = require("fs");
const outDir = "D:/Dolmen-group/.tmp-contact-restore";
const css = fs.readFileSync(outDir + "/globals.replayed.css", "utf8");
const fails = JSON.parse(fs.readFileSync(outDir + "/contact-css-fails.json", "utf8"));

// Get contiguous desktop contact CSS: from .contact-banner { to just before .about-section {
const start = css.indexOf("\n.contact-banner {");
const about = css.indexOf("\n.about-section,", start);
const about2 = css.indexOf("\n.about-section {", start);
const endDesktop = Math.min(
  ...[about, about2].filter((n) => n > 0)
);
let desktop = css.slice(start + 1, endDesktop);
console.log("desktop start", start, "end", endDesktop, "len", desktop.length);

// Also get contact-banner mobile rules that may sit near .dolmen-hero-content flex
const idxs = [];
let pos = 0;
while ((pos = css.indexOf(".contact-banner", pos)) !== -1) {
  idxs.push(pos);
  pos++;
}
const talkIdxs = [];
pos = 0;
while ((pos = css.indexOf(".contact-talk", pos)) !== -1) {
  talkIdxs.push(pos);
  pos++;
}
console.log("banner idxs", idxs.length, "talk idxs", talkIdxs.length);

// Apply failed patches' new strings into a dedicated additions file
let additions = "";
for (const f of fails) {
  additions += "\n/* from failed patch L" + f.line + " */\n" + f.new + "\n";
}
fs.writeFileSync(outDir + "/contact-css-failed-news.css", additions);

// Build best FINAL: desktop block + scan media queries from replayed for contact
function extractMediaContact(cssText) {
  const parts = [];
  const re = /@media[^{]+\{/g;
  let m;
  while ((m = re.exec(cssText))) {
    const startMq = m.index;
    let i = m.index + m[0].length - 1;
    let depth = 0;
    for (; i < cssText.length; i++) {
      if (cssText[i] === "{") depth++;
      else if (cssText[i] === "}") {
        depth--;
        if (depth === 0) {
          i++;
          break;
        }
      }
    }
    const block = cssText.slice(startMq, i);
    if (/contact-banner|contact-talk/.test(block)) {
      parts.push(block);
    }
  }
  return parts;
}

const mediaParts = extractMediaContact(css);
fs.writeFileSync(
  outDir + "/contact-css-FINAL.css",
  desktop + "\n\n" + mediaParts.join("\n\n") + "\n"
);
console.log("FINAL len", desktop.length + mediaParts.join("\n\n").length);
console.log("---DESKTOP HEAD---");
console.log(desktop.slice(0, 1500));
console.log("---DESKTOP TAIL---");
console.log(desktop.slice(-800));
console.log("---MEDIA COUNT---", mediaParts.length);

// page.tsx wiring for SiteFooter
const lines = fs
  .readFileSync(
    "C:/Users/pc/.cursor/projects/d-Dolmen-group/agent-transcripts/ecd1900f-d656-42cd-8442-d5e35d2b7883/ecd1900f-d656-42cd-8442-d5e35d2b7883.jsonl",
    "utf8"
  )
  .split(/\n/);
const o = JSON.parse(lines[508]);
for (const p of o.message.content) {
  if (p.type === "tool_use" && p.name === "StrReplace" && (p.input.path || "").includes("page.tsx")) {
    console.log("---PAGE.TSX CHANGE---");
    console.log("OLD:\n", p.input.old_string.slice(0, 400));
    console.log("NEW:\n", p.input.new_string.slice(0, 400));
    fs.writeFileSync(
      outDir + "/page-tsx-contact-change.json",
      JSON.stringify({ old: p.input.old_string, new: p.input.new_string }, null, 2)
    );
  }
}
