import { DocKey, DOC_KEYS, CATEGORIES } from "@/lib/types";

const DOC_LABELS: Record<DocKey, string> = {
  executiveSummary: "Executive Summary",
  prd: "Product Requirement Document",
  userFlow: "User Flow",
  architecture: "Architecture",
  workflow: "Development Workflow",
  sprintPlan: "Sprint Plan",
  riskMatrix: "Risk Matrix",
  successMetrics: "Success Metrics",
};

function markdownToHtml(md: string): string {
  return md
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>\n?)+/g, (match) => `<ul>${match}</ul>`)
    .replace(/^\|(.+)\|$/gm, (match) => {
      const cells = match.split('|').filter(Boolean).map((c) => c.trim());
      if (cells.every((c) => /^[-:]+$/.test(c))) return '';
      return '<tr>' + cells.map((c) => `<td>${c}</td>`).join('') + '</tr>';
    })
    .replace(/(<tr>.*<\/tr>\n?)+/g, (match) => `<table>${match}</table>`)
    .replace(/^---+$/gm, '<hr>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/^(?!<[hulo]|<\/|<hr|<str|<em|<cod|<a|<tab)(.+)$/gm, '<p>$1</p>');
}

export function generatePDF(docs: Record<DocKey, string>, title: string): void {
  const date = new Date().toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  let tocHtml = '';
  for (const cat of Object.keys(CATEGORIES)) {
    const catInfo = CATEGORIES[cat as keyof typeof CATEGORIES];
    const hasAny = catInfo.tabs.some((t) => docs[t.key]?.length > 0);
    if (!hasAny) continue;

    tocHtml += `<div class="toc-category">${catInfo.icon} ${catInfo.label}</div>`;
    for (const tab of catInfo.tabs) {
      if (docs[tab.key]?.length > 0) {
        tocHtml += `<div class="toc-item">${DOC_LABELS[tab.key]}</div>`;
      }
    }
  }

  let contentHtml = '';
  for (const docKey of DOC_KEYS) {
    const content = docs[docKey];
    if (!content || content.length === 0) continue;

    contentHtml += `
      <div class="doc-section">
        <div class="doc-title">${DOC_LABELS[docKey]}</div>
        <div class="doc-content">${markdownToHtml(content)}</div>
      </div>
    `;
  }

  const html = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>FlowPRD — ${title}</title>
  <style>
    @media print {
      @page { margin: 2cm; }
      .no-print { display: none !important; }
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      max-width: 800px;
      margin: 0 auto;
      padding: 40px 20px;
      color: #1a1a2e;
      line-height: 1.7;
      font-size: 14px;
    }
    .cover {
      text-align: center;
      padding: 80px 0 40px;
      page-break-after: always;
    }
    .cover h1 {
      font-size: 36px;
      font-weight: 800;
      color: #f97316;
      margin-bottom: 8px;
      letter-spacing: -1px;
    }
    .cover h2 {
      font-size: 20px;
      font-weight: 400;
      color: #666;
      margin-bottom: 24px;
    }
    .cover .date {
      font-size: 13px;
      color: #999;
    }
    .toc {
      page-break-after: always;
      padding: 20px 0;
    }
    .toc h2 {
      font-size: 18px;
      margin-bottom: 16px;
      border-bottom: 2px solid #f97316;
      padding-bottom: 8px;
    }
    .toc-category {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #999;
      margin-top: 16px;
      margin-bottom: 4px;
    }
    .toc-item {
      font-size: 14px;
      color: #333;
      padding: 4px 0 4px 16px;
    }
    .doc-section {
      page-break-before: always;
      padding-top: 20px;
    }
    .doc-title {
      font-size: 22px;
      font-weight: 700;
      color: #f97316;
      border-bottom: 2px solid #f97316;
      padding-bottom: 8px;
      margin-bottom: 20px;
    }
    .doc-content h1 {
      font-size: 18px;
      font-weight: 700;
      margin-top: 24px;
      margin-bottom: 8px;
    }
    .doc-content h2 {
      font-size: 16px;
      font-weight: 600;
      margin-top: 20px;
      margin-bottom: 8px;
      border-bottom: 1px solid #eee;
      padding-bottom: 4px;
    }
    .doc-content h3 {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #f97316;
      margin-top: 16px;
      margin-bottom: 6px;
    }
    .doc-content p {
      margin-bottom: 8px;
      color: #444;
    }
    .doc-content ul {
      margin-bottom: 8px;
      padding-left: 20px;
    }
    .doc-content li {
      margin-bottom: 4px;
      color: #444;
    }
    .doc-content table {
      width: 100%;
      border-collapse: collapse;
      margin: 12px 0;
      font-size: 13px;
    }
    .doc-content td {
      padding: 6px 10px;
      border: 1px solid #ddd;
      vertical-align: top;
    }
    .doc-content tr:first-child td {
      background: #f5f5f5;
      font-weight: 600;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }
    .doc-content code {
      background: #f5f5f5;
      padding: 2px 6px;
      border-radius: 3px;
      font-size: 13px;
      font-family: 'SF Mono', Monaco, monospace;
    }
    .doc-content strong { color: #1a1a2e; }
    .doc-content hr { border: none; border-top: 1px solid #eee; margin: 16px 0; }
    .footer {
      margin-top: 40px;
      padding-top: 12px;
      border-top: 1px solid #eee;
      text-align: center;
      font-size: 11px;
      color: #999;
    }
    .print-btn {
      position: fixed;
      bottom: 24px;
      right: 24px;
      padding: 12px 24px;
      background: #f97316;
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(249,115,22,0.3);
    }
    .print-btn:hover { background: #c2410c; }
  </style>
</head>
<body>
  <div class="cover">
    <h1>FlowPRD</h1>
    <h2>${title}</h2>
    <div class="date">${date}</div>
  </div>

  <div class="toc">
    <h2>Daftar Isi</h2>
    ${tocHtml}
  </div>

  ${contentHtml}

  <div class="footer">Generated by FlowPRD — ${date}</div>

  <button class="print-btn no-print" onclick="window.print()">Save as PDF (Ctrl+P)</button>
  <button class="print-btn no-print" style="right: 200px; background: #22d3ee;" onclick="download()">Download HTML</button>
  <script>
    function download() {
      const blob = new Blob([document.documentElement.outerHTML], {type: 'text/html'});
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'flowprd-${(title || "document").toLowerCase().replace(/\\s+/g, "-")}.html';
      a.click();
    }
  </script>
</body>
</html>`;

  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  window.open(url, "_blank");
}
