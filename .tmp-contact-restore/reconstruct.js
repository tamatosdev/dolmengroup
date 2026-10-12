const fs = require("fs");
const path = "C:/Users/pc/.cursor/projects/d-Dolmen-group/agent-transcripts/ecd1900f-d656-42cd-8442-d5e35d2b7883/ecd1900f-d656-42cd-8442-d5e35d2b7883.jsonl";
const lines = fs.readFileSync(path, "utf8").split(/\n/);
const outDir = "D:/Dolmen-group/.tmp-contact-restore";

function norm(p) { return (p || "").replace(/\\/g, "/"); }

const track = {
  "contact/page.tsx": null,
  "contact-banner.tsx": null,
  "contact-talk.tsx": null,
  "site-footer.tsx": null,
};

const cssPatches = [];
const wiring = [];
const opsLog = [];

for (let i = 0; i < 632; i++) {
  const line = lines[i];
  if (!line) continue;
  let obj;
  try { obj = JSON.parse(line); } catch { continue; }
  const content = obj.message && obj.message.content;
  if (!Array.isArray(content)) continue;
  for (const part of content) {
    if (part.type !== "tool_use") continue;
    const name = part.name;
    const inp = part.input || {};
    const p = norm(inp.path);

    let key = null;
    for (const k of Object.keys(track)) {
      if (p.endsWith(k)) key = k;
    }

    if (key && name === "Write") {
      track[key] = inp.contents;
      opsLog.push({ line: i + 1, op: "Write", key, len: (inp.contents || "").length });
    } else if (key && name === "StrReplace") {
      const oldS = inp.old_string;
      const newS = inp.new_string;
      if (track[key] == null) {
        opsLog.push({ line: i + 1, op: "StrReplace-SKIP-no-base", key });
        continue;
      }
      const replaceAll = !!inp.replace_all;
      if (!track[key].includes(oldS)) {
        opsLog.push({ line: i + 1, op: "StrReplace-FAIL", key, oldPreview: oldS.slice(0, 100) });
      } else {
        track[key] = replaceAll ? track[key].split(oldS).join(newS) : track[key].replace(oldS, newS);
        opsLog.push({ line: i + 1, op: "StrReplace-OK", key });
      }
    }

    if (name === "StrReplace" && p.endsWith("globals.css")) {
      const ns = inp.new_string || "";
      const os = inp.old_string || "";
      if (/contact-banner|contact-talk|contact-page|contact-form|contact-locations|contact-map|enquiry|contact-office/.test(ns + os)) {
        cssPatches.push({ line: i + 1, replace_all: !!inp.replace_all, old: os, new: ns });
        opsLog.push({ line: i + 1, op: "CSS", len: ns.length });
      }
    }

    if (name === "Shell") {
      const cmd = inp.command || "";
      if (/contact|git checkout|git restore|git reset|git clean/.test(cmd)) {
        opsLog.push({ line: i + 1, op: "Shell", detail: cmd.slice(0, 300) });
      }
    }

    if (name === "StrReplace") {
      const ns = inp.new_string || "";
      const os = inp.old_string || "";
      if (/\/contact\//.test(ns) || (/href/.test(ns + os) && /\/contact\//.test(ns + os))) {
        wiring.push({ line: i + 1, path: p, old: os, new: ns });
      }
    }
  }
}

for (const [k, v] of Object.entries(track)) {
  const fname = k.replace(/\//g, "_") + ".FINAL.tsx";
  if (v) {
    fs.writeFileSync(outDir + "/" + fname, v);
    console.log("FINAL", k, "len", v.length);
  } else {
    console.log("MISSING", k);
  }
}
fs.writeFileSync(outDir + "/opsLog.json", JSON.stringify(opsLog, null, 2));
fs.writeFileSync(outDir + "/cssPatches.json", JSON.stringify(cssPatches, null, 2));
fs.writeFileSync(outDir + "/wiring-full.json", JSON.stringify(wiring, null, 2));
console.log("ops", opsLog.length, "css", cssPatches.length, "wiring", wiring.length);
console.log(JSON.stringify(opsLog.filter(o => o.key || o.op === "CSS" || o.op === "Shell"), null, 2));
