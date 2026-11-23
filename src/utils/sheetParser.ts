import { BookletStatus, DeliveryStatus, MonthPayments, StudentGradeKey, StudentRecord } from '../types';
import { ATTACHED_SHEET_FILES, createEmptyWeeks, MONTH_COLUMNS, WEEK_LABELS_AR } from '../data/studentRecordsData';

export function parsePaymentAmount(val: string): number {
  const cleaned = (val || '').replace(/[^\d.]/g, '');
  if (!cleaned) return 0;
  const num = Number(cleaned);
  return Number.isFinite(num) ? num : 0;
}

export function calculateTotalPaid(payments: MonthPayments): number {
  return (
    parsePaymentAmount(payments.m8) +
    parsePaymentAmount(payments.m9) +
    parsePaymentAmount(payments.m10) +
    parsePaymentAmount(payments.m11) +
    parsePaymentAmount(payments.m12)
  );
}

export function calculateAttendanceCount(weeks: [boolean, boolean][]): {
  attended: number;
  total: number;
  percentage: number;
} {
  let attended = 0;
  const total = weeks.length * 2;
  for (const [s1, s2] of weeks) {
    if (s1) attended++;
    if (s2) attended++;
  }
  return {
    attended,
    total,
    percentage: total > 0 ? Math.round((attended / total) * 100) : 0,
  };
}

export function formatWhatsAppUrl(phone: string): string | null {
  const digits = (phone || '').replace(/\D/g, '');
  if (digits.length < 10) return null;
  const normalized = digits.startsWith('20') ? digits : `2${digits}`;
  return `https://wa.me/+${normalized}`;
}

export function getGradeLabel(grade: StudentGradeKey, short = false): string {
  const file = ATTACHED_SHEET_FILES.find((f) => f.grade === grade);
  if (!file) return grade;
  return short ? file.shortLabelAr : file.labelAr;
}

export function getDefaultFee(grade: StudentGradeKey): number {
  return ATTACHED_SHEET_FILES.find((f) => f.grade === grade)?.defaultFee ?? 150;
}

export function getDefaultBooklet(grade: StudentGradeKey): BookletStatus {
  return ATTACHED_SHEET_FILES.find((f) => f.grade === grade)?.defaultBooklet ?? 'المذكرة';
}

function normalizeBooklet(raw: string): BookletStatus {
  const clean = raw.trim();
  if (clean.includes('سلاح التلميذ') || clean.includes('كتاب')) return 'كتاب سلاح التلميذ';
  if (clean.includes('المذكرة')) return 'المذكرة';
  if (clean.includes('غير')) return 'غير مشترك';
  return '-';
}

function normalizeDelivery(raw: string): DeliveryStatus {
  const clean = raw.trim();
  if (clean.includes('استلم')) return 'استلم';
  if (clean.includes('مطلوب')) return 'مطلوب';
  return '-';
}

function normalizePayment(raw: string): string {
  const clean = raw.replace(/\u200b/g, '').trim();
  if (!clean || clean === '-' || clean === '--') return '--';
  return clean;
}

export function inferGradeFromText(raw: string, fallback: StudentGradeKey): StudentGradeKey {
  const lower = raw.toLowerCase();
  if (lower.includes('prim4') || lower.includes('4prim') || lower.includes('الرابع') || lower.includes('رابعة')) return '4prim';
  if (lower.includes('prim5') || lower.includes('5prim') || lower.includes('الخامس') || lower.includes('خامسة')) return '5prim';
  if (lower.includes('prim6') || lower.includes('6prim') || lower.includes('السادس') || lower.includes('سادسة')) return '6prim';
  if (lower.includes('prep1') || lower.includes('1prep') || lower.includes('الأول') || lower.includes('أولى')) return '1prep';
  if (lower.includes('prep2') || lower.includes('2prep') || lower.includes('الثاني') || lower.includes('تانية')) return '2prep';
  if (lower.includes('prep3') || lower.includes('3prep') || lower.includes('الثالث') || lower.includes('تالتة')) return '3prep';
  return fallback;
}

/**
 * Parses a Google Sheets exported HTML file (same schema as Prim4/5/6 & Prep1/2/3 HTML files)
 * into strongly-typed StudentRecord rows.
 */
export function parseGoogleSheetHtml(html: string, grade: StudentGradeKey): StudentRecord[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const rows = Array.from(doc.querySelectorAll('table tbody tr'));
  if (rows.length === 0) return [];

  let headerRowIndex = -1;
  const colMap = {
    code: 0,
    name: 1,
    booklet: 3,
    delivery: 4,
    phone: 5,
    parentPhone: 7,
    bookingDate: 8,
    m8: 9,
    m9: 10,
    m10: 11,
    m11: 12,
    m12: 13,
  };

  for (let i = 0; i < Math.min(rows.length, 6); i++) {
    const tds = Array.from(rows[i].querySelectorAll('td'));
    const texts = tds.map((td) => (td.textContent || '').replace(/\u200b/g, '').trim());
    const nameIdx = texts.findIndex((t) => t === 'الاسم');
    if (nameIdx !== -1) {
      headerRowIndex = i;
      colMap.name = nameIdx;
      const findCol = (predicate: (t: string) => boolean, fallback: number) => {
        const idx = texts.findIndex(predicate);
        return idx !== -1 ? idx : fallback;
      };
      colMap.booklet = findCol((t) => t.includes('المذكرة'), colMap.booklet);
      colMap.delivery = findCol((t) => t.includes('حالة') || t.includes('الإستلام') || t.includes('الاستلام'), colMap.delivery);
      colMap.phone = findCol((t) => t === 'التليفون', colMap.phone);
      colMap.parentPhone = findCol((t) => t.includes('ولي'), colMap.parentPhone);
      colMap.bookingDate = findCol((t) => t.includes('تاريخ'), colMap.bookingDate);
      colMap.m8 = findCol((t) => t === '8', colMap.m8);
      colMap.m9 = findCol((t) => t === '9', colMap.m9);
      colMap.m10 = findCol((t) => t === '10', colMap.m10);
      colMap.m11 = findCol((t) => t === '11', colMap.m11);
      colMap.m12 = findCol((t) => t === '12', colMap.m12);
      break;
    }
  }

  const records: StudentRecord[] = [];
  const startRow = headerRowIndex >= 0 ? headerRowIndex + 1 : 1;

  for (let i = startRow; i < rows.length; i++) {
    const tds = Array.from(rows[i].querySelectorAll('td'));
    if (tds.length < 10) continue;

    const getCellText = (idx: number) =>
      (tds[idx]?.textContent || '').replace(/\u200b/g, '').trim();

    const name = getCellText(colMap.name);
    if (!name || name === 'الاسم') continue;

    const rawCode = parseInt(getCellText(colMap.code), 10);
    const code = Number.isFinite(rawCode) ? rawCode : records.length + 1;

    const checkboxFlags: boolean[] = [];
    for (const td of tds) {
      const useEl = td.querySelector('use');
      if (useEl) {
        const href = useEl.getAttribute('href') || useEl.getAttribute('xlink:href') || '';
        checkboxFlags.push(href.includes('#checked-checkbox-id') && !href.includes('unchecked'));
      }
    }

    const weeks: [boolean, boolean][] = createEmptyWeeks();
    for (let w = 0; w < 14; w++) {
      weeks[w] = [Boolean(checkboxFlags[w * 2]), Boolean(checkboxFlags[w * 2 + 1])];
    }

    records.push({
      id: `${grade}-${code}-${Date.now()}-${i}`,
      code,
      grade,
      name,
      booklet: normalizeBooklet(getCellText(colMap.booklet)),
      deliveryStatus: normalizeDelivery(getCellText(colMap.delivery)),
      phone: getCellText(colMap.phone),
      parentPhone: getCellText(colMap.parentPhone),
      bookingDate: getCellText(colMap.bookingDate),
      payments: {
        m8: normalizePayment(getCellText(colMap.m8)),
        m9: normalizePayment(getCellText(colMap.m9)),
        m10: normalizePayment(getCellText(colMap.m10)),
        m11: normalizePayment(getCellText(colMap.m11)),
        m12: normalizePayment(getCellText(colMap.m12)),
      },
      weeks,
    });
  }

  return records;
}

/**
 * Fetches and parses all 6 attached HTML files from /assets/aistudio/
 */
export async function fetchAllAttachedSheets(): Promise<StudentRecord[]> {
  const all: StudentRecord[] = [];
  for (const sheet of ATTACHED_SHEET_FILES) {
    const res = await fetch(sheet.url);
    if (!res.ok) continue;
    const html = await res.text();
    const parsed = parseGoogleSheetHtml(html, sheet.grade);
    all.push(...parsed);
  }
  return all;
}

/**
 * Parses an imported CSV file (UTF-8) back into StudentRecord[]
 */
export function parseCsvRecords(csvText: string, defaultGrade: StudentGradeKey): StudentRecord[] {
  const lines = csvText
    .replace(/^\uFEFF/, '')
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  if (lines.length < 2) return [];

  const splitCsvLine = (line: string): string[] => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (ch === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += ch;
      }
    }
    result.push(current.trim());
    return result;
  };

  const records: StudentRecord[] = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = splitCsvLine(lines[i]);
    const name = cols[1] || cols[0];
    if (!name) continue;

    const grade = inferGradeFromText(cols[2] || '', defaultGrade);
    const code = parseInt(cols[0], 10) || records.length + 1;
    records.push({
      id: `${grade}-csv-${Date.now()}-${i}`,
      code,
      grade,
      name,
      booklet: normalizeBooklet(cols[3] || getDefaultBooklet(grade)),
      deliveryStatus: normalizeDelivery(cols[4] || 'مطلوب'),
      phone: cols[5] || '',
      parentPhone: cols[6] || '',
      bookingDate: cols[7] || '',
      payments: {
        m8: normalizePayment(cols[8] || '--'),
        m9: normalizePayment(cols[9] || '--'),
        m10: normalizePayment(cols[10] || '--'),
        m11: normalizePayment(cols[11] || '--'),
        m12: normalizePayment(cols[12] || '--'),
      },
      weeks: createEmptyWeeks(),
    });
  }
  return records;
}

function escapeCsvCell(value: string | number): string {
  const s = String(value ?? '');
  if (s.includes(',') || s.includes('"') || s.includes('\n')) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

function escapeHtml(str: string): string {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function exportRecordsToCsv(records: StudentRecord[], fileName = 'student-records.csv'): void {
  const headers = [
    'الكود',
    'الاسم',
    'الصف',
    'المذكرة',
    'حالة الإستلام',
    'التليفون',
    'تليفون ولي الأمر',
    'تاريخ الحجز',
    ...MONTH_COLUMNS.map((m) => m.labelAr),
    'إجمالي المدفوع',
    'عدد الحصص المحضورة',
  ];

  const rows = records.map((r) => {
    const totalPaid = calculateTotalPaid(r.payments);
    const { attended, total } = calculateAttendanceCount(r.weeks);
    return [
      r.code,
      r.name,
      getGradeLabel(r.grade),
      r.booklet,
      r.deliveryStatus,
      r.phone,
      r.parentPhone,
      r.bookingDate,
      r.payments.m8,
      r.payments.m9,
      r.payments.m10,
      r.payments.m11,
      r.payments.m12,
      totalPaid,
      `${attended}/${total}`,
    ]
      .map(escapeCsvCell)
      .join(',');
  });

  const csvContent = '\uFEFF' + [headers.map(escapeCsvCell).join(','), ...rows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportRecordsToJson(records: StudentRecord[], fileName = 'student-records.json'): void {
  const blob = new Blob([JSON.stringify(records, null, 2)], { type: 'application/json;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Exports records back into the exact Google Sheets HTML table structure
 * matching Prim4/5/6 & Prep1/2/3 attached files so it can be re-imported or opened in Excel/Browser.
 */
export function exportRecordsToSheetHtml(
  records: StudentRecord[],
  sheetTitle = 'سجل الطلاب',
  fileName = 'student-sheet.html'
): void {
  const headerWeeks = WEEK_LABELS_AR.map((w) => `<th colspan="2">${escapeHtml(w)}</th>`).join('');
  const bodyRows = records
    .map((r) => {
      const wa = formatWhatsAppUrl(r.phone || r.parentPhone) || 'https://wa.me/+2';
      const deliveryBg =
        r.deliveryStatus === 'استلم'
          ? 'background:#11734b;color:#d4edbc;'
          : r.deliveryStatus === 'مطلوب'
          ? 'background:#5a3286;color:#e5cff2;'
          : 'background:#e8eaed;color:#000000;';
      const bookletBg =
        r.booklet !== '-' && r.booklet !== 'غير مشترك'
          ? 'background:#11734b;color:#d4edbc;'
          : 'background:#e8eaed;color:#000000;';

      const monthCells = MONTH_COLUMNS.map((m) => {
        const val = r.payments[m.key] || '--';
        const paid = parsePaymentAmount(val) > 0;
        const style = paid ? 'background:#ffcfc9;color:#b10202;' : 'background:#e8eaed;color:#000000;';
        return `<td dir="ltr"><span class="badge" style="${style}">${escapeHtml(val)}</span></td>`;
      }).join('');

      const weekCells = r.weeks
        .map(([s1, s2]) => {
          const icon = (checked: boolean) =>
            `<svg width="16" height="16" viewBox="0 0 16 16" style="display:inline;"><use href="#${
              checked ? 'checked-checkbox-id' : 'unchecked-checkbox-id'
            }" fill="#000000"/></svg>`;
          return `<td dir="ltr">${icon(s1)}</td><td dir="ltr">${icon(s2)}</td>`;
        })
        .join('');

      return `<tr>
        <td dir="ltr">${r.code}</td>
        <td>${escapeHtml(r.name)}</td>
        <td></td>
        <td><span class="badge" style="${bookletBg}">${escapeHtml(r.booklet)}</span></td>
        <td><span class="badge" style="${deliveryBg}">${escapeHtml(r.deliveryStatus)}</span></td>
        <td dir="ltr">${escapeHtml(r.phone)}</td>
        <td dir="ltr"><a target="_blank" href="${escapeHtml(wa)}">📞</a></td>
        <td dir="ltr">${escapeHtml(r.parentPhone)}</td>
        <td dir="ltr">${escapeHtml(r.bookingDate)}</td>
        ${monthCells}
        ${weekCells}
      </tr>`;
    })
    .join('\n');

  const html = `<!doctype html>
<html lang="ar" dir="rtl">
<head>
<meta charset="utf-8">
<title>${escapeHtml(sheetTitle)}</title>
<style>
  body { font-family: Calibri, Arial, sans-serif; margin: 16px; background: #fff; color: #000; }
  table { border-collapse: collapse; width: max-content; }
  th, td { border: 1px solid #000; padding: 4px 6px; text-align: center; font-weight: bold; font-size: 12pt; white-space: nowrap; }
  thead th { background: #000; color: #fff; }
  .badge { display: inline-block; border-radius: 8px; padding: 1px 8px; min-width: 44px; }
</style>
</head>
<body>
<svg style="display:none;" width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <path id="checked-checkbox-id" d="M17,3 L4.75,3 C3.77875,3 3,3.7875 3,4.75 L3,17 C3,17.9625 3.77875,18.75 4.75,18.75 L17,18.75 C17.97125,18.75 18.75,17.9625 18.75,17 L18.75,4.75 C18.75,3.7875 17.97125,3 17,3 Z M9.125,15.25 L4.75,10.875 L5.98375,9.64125 L9.125,12.77375 L15.76625,6.1325 L17,7.375 L9.125,15.25 Z" transform="translate(-3,-3)"/>
    <path id="unchecked-checkbox-id" d="M17,3.75 L17,16 L4.75,16 L4.75,3.75 L17,3.75 Z M17,2 L4.75,2 C3.7875,2 3,2.7875 3,3.75 L3,16 C3,16.9625 3.7875,17.75 4.75,17.75 L17,17.75 C17.9625,17.75 18.75,16.9625 18.75,16 L18.75,3.75 C18.75,2.7875 17.9625,2 17,2 Z" transform="translate(-3,-2)"/>
  </defs>
</svg>
<table>
  <thead>
    <tr>
      <th>0</th><th>الاسم</th><th></th><th>المذكرة</th><th>حالة الإستلام</th><th>التليفون</th><th>واتساب</th><th>تليفون ولي الامر</th><th>تاريخ الحجز</th>
      <th>8</th><th>9</th><th>10</th><th>11</th><th>12</th>
      ${headerWeeks}
    </tr>
  </thead>
  <tbody>
    ${bodyRows}
  </tbody>
</table>
</body>
</html>`;

  const blob = new Blob([html], { type: 'text/html;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
