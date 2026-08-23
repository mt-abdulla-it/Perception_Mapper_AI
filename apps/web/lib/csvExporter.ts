/**
 * Safe client-side CSV/Excel spreadsheet generation and trigger utility.
 */

interface ExportRow {
  timestamp: string;
  originalText: string;
  detectedLanguage: string;
  sentimentScore: number;
  objectiveRephrasing: string;
}

export function exportToCSV(data: ExportRow[], filename = "perception_audit_report.csv") {
  const headers = ["Timestamp", "Original Text", "Detected Language", "Sentiment Score (%)", "Objective Rephrasing"];
  
  const escapeField = (val: string | number) => {
    const str = String(val ?? "").replace(/"/g, '""');
    return str.includes(",") || str.includes("\n") || str.includes('"') ? `"${str}"` : str;
  };

  const csvRows = [
    headers.join(","),
    ...data.map((row) =>
      [
        escapeField(row.timestamp),
        escapeField(row.originalText),
        escapeField(row.detectedLanguage.toUpperCase()),
        escapeField(`${Math.round(row.sentimentScore * 100)}%`),
        escapeField(row.objectiveRephrasing)
      ].join(",")
    )
  ];

  const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
