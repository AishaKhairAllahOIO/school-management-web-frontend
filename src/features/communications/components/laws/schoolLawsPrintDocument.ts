import { createPrintableHtml, escapePrintHtml } from "@/features/printing";
import type { SchoolLaw } from "../../types/school-laws.types";

const themes = [
  ["#fff0f3", "#f5b9c5", "#9c3651"],
  ["#eef6ff", "#bcd8fa", "#315f9a"],
  ["#f0f8ec", "#c5e1b5", "#426d31"],
  ["#fff8e8", "#efd397", "#8c621f"],
  ["#f6f0ff", "#d5c3f2", "#634594"],
  ["#ecfbfa", "#b8e2dd", "#286b66"],
];

export function buildSchoolLawsPosterDocument(laws: SchoolLaw[]) {
  const useTwoColumns = laws.length > 6;
  const items = laws.map((law, index) => {
    const [background, border, ink] = themes[index % themes.length];
    return `<article class="law" style="--bg:${background};--border:${border};--ink:${ink}">
      <span class="number">${String(index + 1).padStart(2, "0")}</span>
      <div><h2 dir="auto">${escapePrintHtml(law.title)}</h2>${law.description ? `<p dir="auto">${escapePrintHtml(law.description)}</p>` : ""}</div>
    </article>`;
  }).join("");

  const body = `<main class="print-page poster">
    <div class="decor decor-a"></div><div class="decor decor-b"></div>
    <header><div class="badge">A</div><div class="heading"><p class="eyebrow">A safe school starts with us</p><h1>School Laws & Shared Values</h1><p class="subtitle">Kind choices, respectful words, and responsible actions help everyone learn and belong.</p></div><div class="spark">✦</div></header>
    <div class="values"><span>Respect</span><i></i><span>Responsibility</span><i></i><span>Safety</span><i></i><span>Kindness</span><i></i><span>Excellence</span></div>
    <section class="content"><div class="section-title"><span>Our community promises</span></div><div class="laws ${useTwoColumns ? "two" : "one"}">${items}</div></section>
    <footer><strong>We learn better when we care for one another.</strong><span>Read it · Live it · Share it</span></footer>
  </main>`;

  const styles = `
    html,body{overflow:hidden;background:#fff9fc}.poster{position:relative;height:297mm;overflow:hidden;padding:8mm;background:radial-gradient(circle at 7% 6%,#ffd9e2 0,transparent 18%),radial-gradient(circle at 94% 10%,#d9eaff 0,transparent 20%),radial-gradient(circle at 89% 94%,#dff3d3 0,transparent 22%),linear-gradient(145deg,#fffafd,#fbfdff 52%,#fffdf6)}
    .poster:before{content:"";position:absolute;inset:7mm;border:.45mm solid rgba(96,74,138,.13);border-radius:7mm;background:rgba(255,255,255,.9);box-shadow:0 3mm 10mm rgba(73,54,110,.08)}
    header,.values,.content,footer{position:relative;z-index:2}header{display:grid;grid-template-columns:17mm 1fr 17mm;align-items:center;gap:4mm;padding:8mm 8mm 5mm}.badge,.spark{display:grid;width:14mm;height:14mm;place-items:center;border-radius:5mm;background:#fff;border:.4mm solid #d9d2e8;color:#6d4ca4;font-size:6mm;font-weight:900;box-shadow:0 1.5mm 4mm rgba(83,64,123,.08)}.spark{color:#e87b98}.heading{text-align:center}.eyebrow{margin:0;color:#8054ae;font-size:2.4mm;font-weight:900;letter-spacing:.18em;text-transform:uppercase}h1{margin:1.5mm 0 0;color:#302a44;font-size:7.2mm;line-height:1.02;letter-spacing:-.035em}.subtitle{max-width:140mm;margin:2mm auto 0;color:#716b81;font-size:2.75mm;line-height:1.45}.values{display:flex;align-items:center;justify-content:center;gap:2.3mm;margin:0 8mm;padding:2.8mm;border-radius:4mm;background:linear-gradient(90deg,#fff0f3,#eef6ff,#f6f0ff,#eff9ed,#fff8e8);color:#655f73;font-size:2.35mm;font-weight:800}.values i{width:1.7mm;height:1.7mm;border-radius:50%;background:linear-gradient(135deg,#f399ad,#86b9f3)}.content{padding:5mm 9mm 3mm}.section-title{display:flex;align-items:center;gap:3mm;margin-bottom:3mm;color:#6c6579;font-size:2.4mm;font-weight:900;letter-spacing:.12em;text-transform:uppercase}.section-title:after{content:"";height:.35mm;flex:1;background:linear-gradient(90deg,#f1a8b6,#93bff0,#bda1e5,#a9d395,#edca87)}.laws{display:grid;align-content:start;gap:2.5mm}.laws.two{grid-template-columns:repeat(2,minmax(0,1fr))}.laws.one{grid-template-columns:1fr}.law{display:grid;grid-template-columns:9mm minmax(0,1fr);gap:2.7mm;align-items:start;padding:3.1mm;border:.35mm solid var(--border);border-radius:4.2mm;background:var(--bg);box-shadow:0 1mm 2.5mm rgba(70,58,102,.045);break-inside:avoid}.number{display:grid;width:8mm;height:8mm;place-items:center;border-radius:2.8mm;background:var(--border);color:var(--ink);font-size:2.5mm;font-weight:900}.law h2{margin:0;color:var(--ink);font-size:3.15mm;line-height:1.25}.law p{margin:1mm 0 0;color:#625e6c;font-size:2.55mm;line-height:1.38;white-space:pre-wrap}.poster.compact .law{padding:2.4mm}.poster.compact .law p{font-size:2.3mm}footer{display:flex;justify-content:space-between;align-items:center;margin:2mm 9mm 0;padding:3.4mm 4mm;border-radius:4mm;background:#332d49;color:#fff}footer strong{font-size:2.8mm}footer span{color:#ded8ef;font-size:2.35mm;font-weight:750;letter-spacing:.06em}
  `;

  return createPrintableHtml({ title: "School laws poster", body, styles, orientation: "portrait" });
}
