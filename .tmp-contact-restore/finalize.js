const fs = require("fs");
const outDir = "D:/Dolmen-group/.tmp-contact-restore";

// Fix copyright in footer final
let footer = fs.readFileSync(outDir + "/site-footer.tsx.FINAL.tsx", "utf8");
footer = footer.replace(/Ac 2026/g, "© 2026");
if (!footer.includes("© 2026")) {
  // restore from Write
  const lines = fs
    .readFileSync(
      "C:/Users/pc/.cursor/projects/d-Dolmen-group/agent-transcripts/ecd1900f-d656-42cd-8442-d5e35d2b7883/ecd1900f-d656-42cd-8442-d5e35d2b7883.jsonl",
      "utf8"
    )
    .split(/\n/);
  const o = JSON.parse(lines[507]);
  for (const p of o.message.content) {
    if (p.name === "Write" && (p.input.path || "").includes("site-footer")) {
      footer = p.input.contents;
    }
  }
}
fs.writeFileSync(outDir + "/site-footer.tsx.FINAL.tsx", footer);

// Build clean contact-only CSS
const desktop = fs
  .readFileSync(outDir + "/contact-css-FINAL.css", "utf8")
  .split(/\n@media/)[0]
  .trim();

const mobileBanner = `
@media (max-width: 640px) {
.contact-banner-content {
  align-items: flex-start;
  bottom: 120px;
  flex-direction: column;
  gap: 24px;
  left: 30px;
  right: 30px;
}

.contact-banner-content h1 {
  font-size: 48px;
}

.contact-banner-content p {
  font-size: 16px;
  max-width: none;
  text-align: left;
}

.contact-banner-scroll {
  bottom: 40px;
  right: 30px;
}

.contact-talk {
  gap: 40px;
  grid-template-columns: 1fr;
}

.contact-talk-intro {
  font-size: 16px;
  margin-bottom: 32px;
  max-width: none;
}

.contact-talk-details {
  grid-template-columns: 1fr;
  margin-bottom: 28px;
}

.contact-talk-form-row {
  grid-template-columns: 1fr;
}

.contact-talk-submit {
  font-size: 16px;
  padding: 16px 18px;
  width: 100%;
  justify-content: center;
}
}
`.trim();

const fluid = `
@media (min-width: 541px) and (max-width: 1920px) {
  .contact-banner-content {
    left: clamp(37.5px, 3.125vw, 60px);
    right: clamp(37.5px, 3.125vw, 60px);
    gap: clamp(28px, 2.5vw, 48px);
  }

  .contact-banner-content h1 {
    font-size: clamp(52px, 4.6vw, 88px);
  }

  .contact-banner-scroll {
    right: clamp(37.5px, 3.125vw, 60px);
  }

  .contact-talk {
    padding: clamp(100px, 10.416667vw, 200px) clamp(37.5px, 3.125vw, 60px);
  }

  .contact-talk-info h2 {
    font-size: clamp(40px, 3.333333vw, 64px);
  }

  .contact-talk-detail h3 {
    font-size: clamp(20px, 1.666667vw, 32px);
  }
}
`.trim();

const breakpoints = `
@media (max-width: 1440px) {
  .contact-talk-info h2 { font-size: 48px; }
  .contact-talk-detail h3 { font-size: 24px; }
}

@media (max-width: 1366px) {
  .contact-talk-info h2 { font-size: 45.12px; }
  .contact-talk-detail h3 { font-size: 22px; }
}

@media (max-width: 1280px) {
  .contact-talk-info h2 { font-size: 41.96px; }
}

@media (max-width: 1200px) {
  .contact-talk { padding: 150px 30px; }
}

@media (max-width: 1140px) {
  .contact-talk-info h2 { font-size: 37.34px; }
}

@media (max-width: 1024px) {
  .contact-talk-info h2 { font-size: 33.23px; }
}

@media (max-width: 768px) {
  .contact-talk-info h2 { font-size: 24.9px; }
  .contact-talk-detail h3 { font-size: 20px; }
  .contact-talk {
    gap: 48px;
    grid-template-columns: 1fr;
  }
  .contact-talk-intro { max-width: none; }
  .contact-talk-details { gap: 28px; }
  .contact-talk { padding: 100px 30px; }
}

@media (max-width: 640px) {
  .contact-talk { padding: 60px 16px; }
}
`.trim();

const clean =
  desktop +
  "\n\n" +
  fluid +
  "\n\n" +
  breakpoints +
  "\n\n" +
  mobileBanner +
  "\n";
fs.writeFileSync(outDir + "/contact-css-CLEAN.css", clean);

// page.tsx full change
const lines = fs
  .readFileSync(
    "C:/Users/pc/.cursor/projects/d-Dolmen-group/agent-transcripts/ecd1900f-d656-42cd-8442-d5e35d2b7883/ecd1900f-d656-42cd-8442-d5e35d2b7883.jsonl",
    "utf8"
  )
  .split(/\n/);
const o = JSON.parse(lines[508]);
for (const p of o.message.content) {
  if (p.name === "StrReplace" && (p.input.path || "").includes("page.tsx")) {
    fs.writeFileSync(outDir + "/page.tsx.NEW.tsx", p.input.new_string);
    console.log("page new len", p.input.new_string.length);
  }
}

console.log("clean css", clean.length);
console.log("footer has copyright", footer.includes("©"));
