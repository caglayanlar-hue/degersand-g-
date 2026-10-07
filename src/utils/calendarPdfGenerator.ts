import jsPDF from 'jspdf';

export interface MonthDataForPdf {
  index: number;
  month: string;
  value: string;
  quote: string;
  author: string;
  guideline: string;
}

// 12 Distinct High-Contrast Color Palettes for the 12 Months
const MONTH_PALETTES: Record<number, {
  bgTop: string;
  bgBottom: string;
  border: string;
  badgeBg: string;
  badgeText: string;
  title: string;
}> = {
  1: { bgTop: '#881337', bgBottom: '#4c0519', border: '#f43f5e', badgeBg: 'rgba(244,63,94,0.35)', badgeText: '#ffe4e6', title: '#fecdd3' }, // Ocak - Dürüstlük (Rose)
  2: { bgTop: '#064e3b', bgBottom: '#022c22', border: '#10b981', badgeBg: 'rgba(16,185,129,0.35)', badgeText: '#d1fae5', title: '#a7f3d0' }, // Şubat - Yardımlaşma (Emerald)
  3: { bgTop: '#075985', bgBottom: '#082f49', border: '#0284c7', badgeBg: 'rgba(2,132,199,0.35)', badgeText: '#e0f2fe', title: '#bae6fd' }, // Mart - Saygı, Sevgi ve Merhamet (Sky)
  4: { bgTop: '#581c87', bgBottom: '#2e1065', border: '#9333ea', badgeBg: 'rgba(147,51,234,0.35)', badgeText: '#f3e8ff', title: '#e9d5ff' }, // Nisan - Vefa (Purple)
  5: { bgTop: '#78350f', bgBottom: '#451a03', border: '#d97706', badgeBg: 'rgba(217,119,6,0.35)', badgeText: '#fef3c7', title: '#fde68a' }, // Mayıs - Sabır (Amber)
  6: { bgTop: '#831843', bgBottom: '#500724', border: '#db2777', badgeBg: 'rgba(219,39,119,0.35)', badgeText: '#fce7f3', title: '#fbcfe8' }, // Haziran - Sevgi (Pink)
  7: { bgTop: '#1e3a8a', bgBottom: '#172554', border: '#2563eb', badgeBg: 'rgba(37,99,235,0.35)', badgeText: '#dbeafe', title: '#bfdbfe' }, // Temmuz - Adalet (Blue)
  8: { bgTop: '#115e59', bgBottom: '#042f2e', border: '#0d9488', badgeBg: 'rgba(13,148,136,0.35)', badgeText: '#ccfbf1', title: '#99f6e4' }, // Ağustos - Hoşgörü (Teal)
  9: { bgTop: '#881337', bgBottom: '#450a0a', border: '#e11d48', badgeBg: 'rgba(225,29,72,0.35)', badgeText: '#ffe4e6', title: '#fecdd3' }, // Eylül - Cesaret (Red)
  10: { bgTop: '#312e81', bgBottom: '#1e1b4b', border: '#4f46e5', badgeBg: 'rgba(79,70,229,0.35)', badgeText: '#e0e7ff', title: '#c7d2fe' }, // Ekim - Sorumluluk (Indigo)
  11: { bgTop: '#701a75', bgBottom: '#4a044e', border: '#c026d3', badgeBg: 'rgba(192,38,211,0.35)', badgeText: '#fae8ff', title: '#f5d0fe' }, // Kasım - Empati (Fuchsia)
  12: { bgTop: '#155e75', bgBottom: '#083344', border: '#0891b2', badgeBg: 'rgba(8,145,178,0.35)', badgeText: '#cffafe', title: '#a5f3fc' }, // Aralık - Umut (Cyan)
};

// Canvas Helper: Draw Rounded Rectangle
function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
  fill?: string | CanvasGradient,
  stroke?: string,
  lineWidth: number = 1
) {
  ctx.save();
  ctx.beginPath();
  if (typeof ctx.roundRect === 'function') {
    ctx.roundRect(x, y, width, height, radius);
  } else {
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
  }
  ctx.closePath();

  if (fill) {
    ctx.fillStyle = fill;
    ctx.fill();
  }
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
  }
  ctx.restore();
}

// Canvas Helper: Word Wrapping
function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    const testLine = currentLine ? currentLine + ' ' + word : word;
    const width = ctx.measureText(testLine).width;
    if (width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) {
    lines.push(currentLine);
  }
  return lines;
}

/**
 * Generates a razor-sharp, strictly single-page A4 Portrait PDF of the 2027 Values Calendar.
 * Pure Canvas 2D + jsPDF: Zero CSS dependencies, zero oklch issues, guaranteed to download.
 */
export async function generateAndDownloadCalendarPdf(
  studentName: string,
  months: MonthDataForPdf[]
): Promise<void> {
  // A4 Portrait Aspect Ratio: 1600 x 2263 px
  const width = 1600;
  const height = 2263;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Canvas 2D context oluşturulamadı');
  }

  // 1. Page Background (Deep Sapphire Navy)
  ctx.fillStyle = '#090d1a';
  ctx.fillRect(0, 0, width, height);

  // Outer Decorative Double Border
  drawRoundedRect(ctx, 16, 16, width - 32, height - 32, 18, undefined, '#1e3a8a', 2);
  drawRoundedRect(ctx, 24, 24, width - 48, height - 48, 14, undefined, '#3b82f6', 1);

  // 2. Top Header Area (Height: 140px)
  const headerY = 40;

  // Title: "2027 YILI DEĞERLER VE BİLGELİK TAKVİMİ"
  ctx.save();
  ctx.font = '900 32px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = '#fbbf24'; // Warm Gold
  ctx.fillText('2027 YILI DEĞERLER VE BİLGELİK TAKVİMİ', 42, headerY + 36);

  // Subtitle
  ctx.font = '700 16px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = '#67e8f9'; // Cyan
  ctx.fillText('Kriptoloji ve Algoritma Hazinesi • 12 Erdem & Bilgelik Rehberi', 42, headerY + 68);
  ctx.restore();

  // Right Side Badges
  const cleanOwner = studentName.trim();
  let rightOffset = width - 42;

  // Year Badge: "🌟 2027 • 12 Erdem"
  const yearBadgeText = '🌟 2027 • 12 Erdem';
  ctx.font = '900 14px system-ui, -apple-system, sans-serif';
  const yearBadgeWidth = ctx.measureText(yearBadgeText).width + 24;
  rightOffset -= yearBadgeWidth;
  drawRoundedRect(ctx, rightOffset, headerY + 16, yearBadgeWidth, 32, 16, '#fbbf24');
  ctx.fillStyle = '#090d1a';
  ctx.fillText(yearBadgeText, rightOffset + 12, headerY + 37);

  // Student Owner Badge (if present)
  if (cleanOwner) {
    const ownerText = `🎓 Sahibi: ${cleanOwner.toUpperCase()}`;
    ctx.font = '800 14px system-ui, -apple-system, sans-serif';
    const ownerBadgeWidth = ctx.measureText(ownerText).width + 24;
    rightOffset -= (ownerBadgeWidth + 12);
    drawRoundedRect(ctx, rightOffset, headerY + 16, ownerBadgeWidth, 32, 16, 'rgba(245, 158, 11, 0.2)', '#f59e0b', 1.5);
    ctx.fillStyle = '#fef08a';
    ctx.fillText(ownerText, rightOffset + 12, headerY + 37);
  }

  // Header Divider
  ctx.beginPath();
  ctx.moveTo(40, headerY + 95);
  ctx.lineTo(width - 40, headerY + 95);
  ctx.strokeStyle = '#2563eb';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // 3. Grid: 3 Columns x 4 Rows = 12 Month Cards
  const gridStartX = 40;
  const gridStartY = 152;
  const colCount = 3;
  const rowCount = 4;
  const gapX = 16;
  const gapY = 14;

  const totalGridWidth = width - 80;
  const cardWidth = (totalGridWidth - (colCount - 1) * gapX) / colCount; // ~496px
  const totalGridHeight = height - gridStartY - 65; // leaves 65px for footer
  const cardHeight = (totalGridHeight - (rowCount - 1) * gapY) / rowCount; // ~498px

  for (let i = 0; i < months.length && i < 12; i++) {
    const m = months[i];
    const col = i % colCount;
    const row = Math.floor(i / colCount);

    const x = gridStartX + col * (cardWidth + gapX);
    const y = gridStartY + row * (cardHeight + gapY);

    const palette = MONTH_PALETTES[m.index] || MONTH_PALETTES[1];

    // Card Background Gradient
    const cardGrad = ctx.createLinearGradient(x, y, x, y + cardHeight);
    cardGrad.addColorStop(0, palette.bgTop);
    cardGrad.addColorStop(1, palette.bgBottom);

    drawRoundedRect(ctx, x, y, cardWidth, cardHeight, 14, cardGrad, palette.border, 1.5);

    // Card Inner Content
    const innerX = x + 16;
    const innerW = cardWidth - 32;

    // Line 1: Month Name (e.g. "OCAK 2027") & Value Badge Tag
    ctx.save();
    ctx.font = '900 16px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = '#fde047'; // Bright Yellow
    ctx.fillText(m.month.toUpperCase(), innerX, y + 26);

    // Value Pill Badge on right
    ctx.font = '800 11px system-ui, -apple-system, sans-serif';
    const badgeStr = m.value.length > 20 ? m.value.substring(0, 18) + '...' : m.value;
    const badgeTextW = ctx.measureText(badgeStr).width;
    const badgeW = badgeTextW + 16;
    const badgeX = x + cardWidth - 16 - badgeW;
    drawRoundedRect(ctx, badgeX, y + 12, badgeW, 22, 11, palette.badgeBg, palette.border, 1);
    ctx.fillStyle = palette.badgeText;
    ctx.fillText(badgeStr, badgeX + 8, y + 27);
    ctx.restore();

    // Horizontal Card Divider
    ctx.beginPath();
    ctx.moveTo(innerX, y + 38);
    ctx.lineTo(innerX + innerW, y + 38);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Line 2: Prominent Value Title
    ctx.save();
    ctx.font = '900 20px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = palette.title;
    ctx.fillText(m.value, innerX, y + 64);
    ctx.restore();

    // Line 3: Quote (Italic Wrapped Text)
    ctx.save();
    ctx.font = 'italic 500 13.5px Georgia, serif';
    ctx.fillStyle = '#ffffff';
    const quoteLines = wrapText(ctx, `"${m.quote}"`, innerW);
    let quoteY = y + 88;
    for (let l = 0; l < Math.min(quoteLines.length, 4); l++) {
      ctx.fillText(quoteLines[l], innerX, quoteY);
      quoteY += 19;
    }
    ctx.restore();

    // Line 4: Guideline Box
    const guideBoxY = y + 185;
    const guideBoxH = cardHeight - 240;
    drawRoundedRect(ctx, innerX, guideBoxY, innerW, guideBoxH, 10, 'rgba(0, 0, 0, 0.45)', palette.border, 1);

    ctx.save();
    // Guideline Header
    ctx.font = '900 12.5px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = '#fde047';
    ctx.fillText('📌 2027 Rehber İlke:', innerX + 12, guideBoxY + 22);

    // Guideline Text
    ctx.font = '600 13px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = '#f1f5f9';
    const guideLines = wrapText(ctx, m.guideline, innerW - 24);
    let gLineY = guideBoxY + 44;
    for (let gl = 0; gl < Math.min(guideLines.length, 4); gl++) {
      ctx.fillText(guideLines[gl], innerX + 12, gLineY);
      gLineY += 19;
    }
    ctx.restore();

    // Card Footer: Author & Year
    const cardFootY = y + cardHeight - 16;
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(innerX, cardFootY - 18);
    ctx.lineTo(innerX + innerW, cardFootY - 18);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.font = '800 13px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = '#fef08a';
    ctx.fillText(`— ${m.author}`, innerX, cardFootY);

    ctx.font = '800 13px monospace';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('2027', x + cardWidth - 52, cardFootY);
    ctx.restore();
  }

  // 4. Bottom Footer (Strictly single line, owner attribution, values list)
  const footerY = height - 28;
  ctx.beginPath();
  ctx.moveTo(40, footerY - 20);
  ctx.lineTo(width - 40, footerY - 20);
  ctx.strokeStyle = '#2563eb';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.save();
  ctx.font = '700 13px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = '#67e8f9';
  const footerLeft = `Değer Sandığı • 2027 Değerler Takvimi${cleanOwner ? ` • Takvim Sahibi: ${cleanOwner}` : ''}`;
  ctx.fillText(footerLeft, 42, footerY);

  ctx.font = '700 13px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = '#fde047';
  const footerRight = 'Dürüstlük · Yardımlaşma · Saygı, Sevgi ve Merhamet · Vefa · Sabır';
  const footerRightW = ctx.measureText(footerRight).width;
  ctx.fillText(footerRight, width - 42 - footerRightW, footerY);
  ctx.restore();

  // 5. Generate high-quality JPEG image data
  const imgData = canvas.toDataURL('image/jpeg', 0.96);

  // 6. Strict Single-Page A4 Portrait jsPDF
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true
  });

  // Exactly fits 1 full A4 page (210mm x 297mm)
  pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297, undefined, 'FAST');

  const cleanFileName = cleanOwner
    ? cleanOwner.replace(/[^a-zA-Z0-9ğüşıöçĞÜŞİÖÇ_ ]/g, '').replace(/\s+/g, '_')
    : 'Kisisel';
  const fileName = `2027_Tek_Sayfa_Degerler_Takvimi_${cleanFileName}.pdf`;

  // Method 1: Standard jsPDF file save
  pdf.save(fileName);

  // Method 2: Dual-trigger blob link click to guarantee download in iframe sandbox
  try {
    const blob = pdf.output('blob');
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = fileName;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    }, 1500);
  } catch (err) {
    console.log('Blob download fallback executed:', err);
  }
}
