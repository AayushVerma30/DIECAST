/**
 * Export data to CSV file and trigger browser download
 */
export function exportToCSV({ filename, headers, rows }) {
  const csvContent = "data:text/csv;charset=utf-8," + [
    headers.map(h => `"${h}"`).join(","),
    ...rows.map(row => row.map(cell => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(","))
  ].join("\n")

  const encodedUri = encodeURI(csvContent)
  const link = document.createElement("a")
  link.setAttribute("href", encodedUri)
  link.setAttribute("download", filename.endsWith('.csv') ? filename : `${filename}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

/**
 * Generate a styled PDF report ready for printing or saving as PDF
 */
export function exportToPDF({
  title,
  subtitle,
  category = "Report",
  kpis = [],
  headers = [],
  rows = [],
  notes = "",
  footerText = "Diecast Vault • High-Octane Diecast Collectibles & Financial Suite"
}) {
  const printWindow = window.open('', '_blank', 'width=1100,height=800')
  if (!printWindow) {
    alert("Please allow popups to export the PDF report.")
    return
  }

  const currentDate = new Date().toLocaleString('en-IN', {
    dateStyle: 'full',
    timeStyle: 'short'
  })

  const kpisHTML = kpis.length > 0 ? `
    <div class="kpi-grid">
      ${kpis.map(kpi => `
        <div class="kpi-card">
          <div class="kpi-label">${kpi.label}</div>
          <div class="kpi-value" style="color: ${kpi.color || '#111827'};">${kpi.value}</div>
          ${kpi.sub ? `<div class="kpi-sub">${kpi.sub}</div>` : ''}
        </div>
      `).join('')}
    </div>
  ` : ''

  const tableHTML = `
    <table class="report-table">
      <thead>
        <tr>
          ${headers.map(h => `<th>${h}</th>`).join('')}
        </tr>
      </thead>
      <tbody>
        ${rows.map((row, idx) => `
          <tr class="${idx % 2 === 0 ? 'even' : 'odd'}">
            ${row.map(cell => `<td>${cell ?? '-'}</td>`).join('')}
          </tr>
        `).join('')}
      </tbody>
    </table>
  `

  const notesHTML = notes ? `
    <div class="notes-box">
      <strong>Special Instructions / Notes:</strong>
      <p>${notes}</p>
    </div>
  ` : ''

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>${title} - Diecast Vault</title>
      <style>
        @page {
          size: A4 portrait;
          margin: 14mm;
        }
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        }
        body {
          color: #1f2937;
          background: #ffffff;
          padding: 24px;
          line-height: 1.5;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          border-bottom: 2px solid #e5e7eb;
          padding-bottom: 16px;
          margin-bottom: 20px;
        }
        .brand-title {
          font-size: 22px;
          font-weight: 900;
          color: #111827;
          letter-spacing: -0.5px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .brand-badge {
          background: #f59e0b;
          color: #000;
          font-size: 11px;
          font-weight: 800;
          padding: 3px 8px;
          border-radius: 4px;
          text-transform: uppercase;
        }
        .report-title {
          font-size: 18px;
          font-weight: 800;
          color: #1f2937;
          margin-top: 6px;
        }
        .report-subtitle {
          font-size: 13px;
          color: #6b7280;
          margin-top: 2px;
        }
        .meta-box {
          text-align: right;
          font-size: 12px;
          color: #6b7280;
        }
        .meta-box strong {
          color: #111827;
          font-size: 13px;
        }
        .kpi-grid {
          display: grid;
          grid-template-columns: repeat(${Math.min(kpis.length || 1, 4)}, 1fr);
          gap: 12px;
          margin-bottom: 24px;
        }
        .kpi-card {
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 12px 14px;
        }
        .kpi-label {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          color: #6b7280;
          letter-spacing: 0.05em;
        }
        .kpi-value {
          font-size: 20px;
          font-weight: 800;
          margin: 4px 0 2px;
        }
        .kpi-sub {
          font-size: 11px;
          color: #9ca3af;
        }
        .report-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 24px;
          font-size: 12px;
        }
        .report-table th {
          background: #111827;
          color: #ffffff;
          text-align: left;
          padding: 10px 12px;
          font-weight: 700;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }
        .report-table td {
          padding: 10px 12px;
          border-bottom: 1px solid #e5e7eb;
        }
        .report-table tr.even td {
          background: #f9fafb;
        }
        .report-table tr:hover td {
          background: #f3f4f6;
        }
        .notes-box {
          background: #fffbeb;
          border: 1px solid #fef3c7;
          border-left: 4px solid #f59e0b;
          padding: 12px 16px;
          border-radius: 6px;
          margin-bottom: 20px;
          font-size: 12px;
          color: #92400e;
        }
        .footer {
          border-top: 1px solid #e5e7eb;
          padding-top: 12px;
          display: flex;
          justify-content: space-between;
          font-size: 11px;
          color: #9ca3af;
        }
        .print-btn-bar {
          background: #111827;
          color: #fff;
          padding: 12px 20px;
          margin: -24px -24px 24px -24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .print-btn {
          background: #10b981;
          color: #000;
          border: none;
          font-weight: 700;
          padding: 8px 16px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 13px;
        }
        .print-btn:hover {
          background: #34d399;
        }
        @media print {
          .print-btn-bar {
            display: none !important;
          }
          body {
            padding: 0;
          }
          .kpi-card {
            border: 1px solid #ccc !important;
          }
        }
      </style>
    </head>
    <body>
      <div class="print-btn-bar">
        <span>📄 <strong>PDF Export Ready</strong> — Click button to Print or Save as PDF</span>
        <button class="print-btn" onclick="window.print()">🖨️ Save as PDF / Print</button>
      </div>

      <div class="header">
        <div>
          <div class="brand-title">
            🏎️ DIECAST VAULT <span class="brand-badge">${category}</span>
          </div>
          <h1 class="report-title">${title}</h1>
          ${subtitle ? `<p class="report-subtitle">${subtitle}</p>` : ''}
        </div>
        <div class="meta-box">
          <div>Generated: <strong>${currentDate}</strong></div>
          <div>Status: <strong style="color: #10b981;">Verified Authentic</strong></div>
          <div>Location: <strong>Mumbai HQ Hub</strong></div>
        </div>
      </div>

      ${kpisHTML}
      ${notesHTML}
      ${tableHTML}

      <div class="footer">
        <span>${footerText}</span>
        <span>Confidential Official Document</span>
      </div>

      <script>
        window.addEventListener('load', () => {
          setTimeout(() => {
            window.print()
          }, 350)
        })
      </script>
    </body>
    </html>
  `

  printWindow.document.open()
  printWindow.document.write(html)
  printWindow.document.close()
}

/**
 * Generate a comprehensive multi-section Master PDF report containing all business pages and tables
 */
export function exportMultiSectionPDF({
  title = "Diecast Vault • Complete Business Master Dossier",
  subtitle = "Executive financial statement, unit profit analysis, payment settlements, customer fulfillment, VIP directory, and warehouse stock valuation.",
  category = "Master Business Dossier",
  kpis = [],
  sections = [],
  notes = "",
  footerText = "Diecast Vault • Complete Business Intelligence & Management Suite • Confidential"
}) {
  const printWindow = window.open('', '_blank', 'width=1100,height=850')
  if (!printWindow) {
    alert("Please allow popups to export the PDF report.")
    return
  }

  const currentDate = new Date().toLocaleString('en-IN', {
    dateStyle: 'full',
    timeStyle: 'short'
  })

  const kpisHTML = kpis.length > 0 ? `
    <div class="kpi-grid">
      ${kpis.map(kpi => `
        <div class="kpi-card">
          <div class="kpi-label">${kpi.label}</div>
          <div class="kpi-value" style="color: ${kpi.color || '#111827'};">${kpi.value}</div>
          ${kpi.sub ? `<div class="kpi-sub">${kpi.sub}</div>` : ''}
        </div>
      `).join('')}
    </div>
  ` : ''

  const sectionsHTML = sections.map((sec, secIdx) => {
    const tableHTML = sec.rows && sec.rows.length > 0 ? `
      <table class="report-table">
        <thead>
          <tr>
            ${(sec.headers || []).map(h => `<th>${h}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${sec.rows.map((row, idx) => `
            <tr class="${idx % 2 === 0 ? 'even' : 'odd'}">
              ${row.map(cell => `<td>${cell ?? '-'}</td>`).join('')}
            </tr>
          `).join('')}
        </tbody>
      </table>
    ` : '<p style="color:#6b7280; font-size:12px; margin-bottom:16px;">No records available for this section.</p>'

    const secKpis = sec.kpis && sec.kpis.length > 0 ? `
      <div class="kpi-grid" style="grid-template-columns: repeat(${Math.min(sec.kpis.length, 4)}, 1fr); margin-bottom: 14px;">
        ${sec.kpis.map(k => `
          <div class="kpi-card" style="padding: 8px 10px;">
            <div class="kpi-label" style="font-size: 10px;">${k.label}</div>
            <div class="kpi-value" style="font-size: 15px; color: ${k.color || '#111827'};">${k.value}</div>
            ${k.sub ? `<div class="kpi-sub" style="font-size: 10px;">${k.sub}</div>` : ''}
          </div>
        `).join('')}
      </div>
    ` : ''

    const secNote = sec.notes ? `
      <div class="notes-box" style="margin-top: 10px; margin-bottom: 16px;">
        <strong>Section Note:</strong>
        <p>${sec.notes}</p>
      </div>
    ` : ''

    return `
      <div class="section-container">
        <div class="section-header">
          <div class="section-title-row">
            <span class="section-number">0${secIdx + 1}</span>
            <h2 class="section-title">${sec.title}</h2>
          </div>
          ${sec.subtitle ? `<p class="section-subtitle">${sec.subtitle}</p>` : ''}
        </div>
        ${secKpis}
        ${tableHTML}
        ${secNote}
      </div>
    `
  }).join('')

  const notesHTML = notes ? `
    <div class="notes-box">
      <strong>Executive Summary Notes:</strong>
      <p>${notes}</p>
    </div>
  ` : ''

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>${title} - Diecast Vault</title>
      <style>
        @page {
          size: A4 portrait;
          margin: 12mm;
        }
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        }
        body {
          color: #1f2937;
          background: #ffffff;
          padding: 24px;
          line-height: 1.5;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          border-bottom: 2px solid #111827;
          padding-bottom: 16px;
          margin-bottom: 20px;
        }
        .brand-title {
          font-size: 24px;
          font-weight: 900;
          color: #111827;
          letter-spacing: -0.5px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .brand-badge {
          background: #f59e0b;
          color: #000;
          font-size: 11px;
          font-weight: 800;
          padding: 3px 8px;
          border-radius: 4px;
          text-transform: uppercase;
        }
        .report-title {
          font-size: 18px;
          font-weight: 800;
          color: #1f2937;
          margin-top: 6px;
        }
        .report-subtitle {
          font-size: 13px;
          color: #6b7280;
          margin-top: 2px;
          max-width: 650px;
        }
        .meta-box {
          text-align: right;
          font-size: 12px;
          color: #6b7280;
        }
        .meta-box strong {
          color: #111827;
          font-size: 13px;
        }
        .kpi-grid {
          display: grid;
          grid-template-columns: repeat(${Math.min(kpis.length || 1, 4)}, 1fr);
          gap: 12px;
          margin-bottom: 24px;
        }
        .kpi-card {
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 12px 14px;
        }
        .kpi-label {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          color: #6b7280;
          letter-spacing: 0.05em;
        }
        .kpi-value {
          font-size: 20px;
          font-weight: 800;
          margin: 4px 0 2px;
        }
        .kpi-sub {
          font-size: 11px;
          color: #9ca3af;
        }
        .section-container {
          margin-bottom: 28px;
          page-break-inside: avoid;
        }
        .section-header {
          border-bottom: 1.5px solid #e5e7eb;
          padding-bottom: 8px;
          margin-bottom: 14px;
        }
        .section-title-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .section-number {
          background: #111827;
          color: #fff;
          font-size: 11px;
          font-weight: 800;
          padding: 2px 7px;
          border-radius: 4px;
        }
        .section-title {
          font-size: 16px;
          font-weight: 800;
          color: #111827;
        }
        .section-subtitle {
          font-size: 12px;
          color: #6b7280;
          margin-top: 2px;
        }
        .report-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 14px;
          font-size: 11.5px;
        }
        .report-table th {
          background: #111827;
          color: #ffffff;
          text-align: left;
          padding: 8px 10px;
          font-weight: 700;
          font-size: 10.5px;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }
        .report-table td {
          padding: 8px 10px;
          border-bottom: 1px solid #e5e7eb;
        }
        .report-table tr.even td {
          background: #f9fafb;
        }
        .notes-box {
          background: #fffbeb;
          border: 1px solid #fef3c7;
          border-left: 4px solid #f59e0b;
          padding: 10px 14px;
          border-radius: 6px;
          margin-bottom: 18px;
          font-size: 11.5px;
          color: #92400e;
        }
        .footer {
          border-top: 1px solid #e5e7eb;
          padding-top: 12px;
          margin-top: 24px;
          display: flex;
          justify-content: space-between;
          font-size: 11px;
          color: #9ca3af;
        }
        .print-btn-bar {
          background: #111827;
          color: #fff;
          padding: 12px 20px;
          margin: -24px -24px 24px -24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .print-btn {
          background: #10b981;
          color: #000;
          border: none;
          font-weight: 700;
          padding: 8px 16px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 13px;
        }
        .print-btn:hover {
          background: #34d399;
        }
        @media print {
          .print-btn-bar {
            display: none !important;
          }
          body {
            padding: 0;
          }
          .kpi-card {
            border: 1px solid #ccc !important;
          }
          .section-container {
            page-break-inside: avoid;
          }
        }
      </style>
    </head>
    <body>
      <div class="print-btn-bar">
        <span>📄 <strong>Master Business Dossier Ready</strong> — All 6 Owner pages compiled. Click to Print or Save as PDF</span>
        <button class="print-btn" onclick="window.print()">🖨️ Save as PDF / Print All</button>
      </div>

      <div class="header">
        <div>
          <div class="brand-title">
            🏎️ DIECAST VAULT <span class="brand-badge">${category}</span>
          </div>
          <h1 class="report-title">${title}</h1>
          ${subtitle ? `<p class="report-subtitle">${subtitle}</p>` : ''}
        </div>
        <div class="meta-box">
          <div>Generated: <strong>${currentDate}</strong></div>
          <div>Audited By: <strong>Store Owner System</strong></div>
          <div>Hub: <strong>Central Warehouse</strong></div>
        </div>
      </div>

      ${kpisHTML}
      ${notesHTML}
      ${sectionsHTML}

      <div class="footer">
        <span>${footerText}</span>
        <span>Confidential • Store Owner Copy</span>
      </div>

      <script>
        window.addEventListener('load', () => {
          setTimeout(() => {
            window.print()
          }, 400)
        })
      </script>
    </body>
    </html>
  `

  printWindow.document.open()
  printWindow.document.write(html)
  printWindow.document.close()
}

