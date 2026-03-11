import jsPDF from 'jspdf';

interface PortfolioEntry {
  name: string;
  symbol: string;
  amount: number;
  buyPrice: number;
  currentPrice: number;
  totalValue: number;
  totalCost: number;
  pnl: number;
  pnlPercent: number;
}

interface PortfolioSummary {
  totalValue: number;
  totalCost: number;
  totalPnl: number;
  totalPnlPercent: number;
  holdings: PortfolioEntry[];
}

function fmt(n: number): string {
  return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function generatePortfolioPDF(data: PortfolioSummary) {
  const doc = new jsPDF('p', 'mm', 'a4');
  const W = 210, M = 18, CW = W - M * 2;
  let y = 0;

  const green: [number, number, number] = [16, 185, 129];
  const red: [number, number, number] = [239, 68, 68];
  const dark: [number, number, number] = [15, 23, 42];
  const text: [number, number, number] = [30, 41, 59];
  const muted: [number, number, number] = [100, 116, 139];
  const bg: [number, number, number] = [241, 245, 249];

  // === HEADER BAR ===
  doc.setFillColor(...dark);
  doc.rect(0, 0, W, 45, 'F');
  doc.setFillColor(...green);
  doc.rect(0, 45, W, 2, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('Portfolio Report', M, 22);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(180, 190, 200);
  doc.text(`Generated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}`, M, 32);
  doc.text(`Holdings: ${data.holdings.length} coins`, M, 38);

  y = 58;

  // === SUMMARY CARDS ===
  const cardW = (CW - 8) / 3;
  const cards = [
    { label: 'Total Investment', value: fmt(data.totalCost), color: dark },
    { label: 'Current Value', value: fmt(data.totalValue), color: dark },
    { label: 'Total P&L', value: `${data.totalPnl >= 0 ? '+' : '-'}${fmt(Math.abs(data.totalPnl))} (${data.totalPnlPercent >= 0 ? '+' : ''}${data.totalPnlPercent.toFixed(2)}%)`, color: data.totalPnl >= 0 ? green : red },
  ];

  cards.forEach((card, i) => {
    const cx = M + i * (cardW + 4);
    doc.setFillColor(...bg);
    doc.roundedRect(cx, y, cardW, 28, 3, 3, 'F');

    // Accent top line
    doc.setFillColor(...(card.color as [number, number, number]));
    doc.rect(cx, y, cardW, 1.5, 'F');

    doc.setTextColor(...muted);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text(card.label, cx + 5, y + 10);

    doc.setTextColor(...(card.color as [number, number, number]));
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.text(card.value, cx + 5, y + 22);
  });

  y += 38;

  // === HOLDINGS TABLE ===
  doc.setTextColor(...dark);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Holdings Breakdown', M, y);
  y += 8;

  // Table header
  const cols = [
    { label: '#', x: M, w: 8 },
    { label: 'Coin', x: M + 8, w: 35 },
    { label: 'Amount', x: M + 43, w: 25 },
    { label: 'Buy Price', x: M + 68, w: 28 },
    { label: 'Current Price', x: M + 96, w: 28 },
    { label: 'Investment', x: M + 124, w: 25 },
    { label: 'Value', x: M + 149, w: 25 },
    { label: 'P&L', x: M + 174, w: 25 },
  ];

  // Header row
  doc.setFillColor(...dark);
  doc.rect(M, y, CW, 9, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  cols.forEach(c => doc.text(c.label, c.x + 2, y + 6.5));
  y += 9;

  // Data rows
  data.holdings.forEach((h, i) => {
    if (y > 270) {
      doc.addPage();
      y = 20;
      // Re-draw header
      doc.setFillColor(...dark);
      doc.rect(M, y, CW, 9, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(7.5);
      doc.setFont('helvetica', 'bold');
      cols.forEach(c => doc.text(c.label, c.x + 2, y + 6.5));
      y += 9;
    }

    const fill = i % 2 === 0 ? bg : [255, 255, 255] as [number, number, number];
    doc.setFillColor(...fill);
    doc.rect(M, y, CW, 9, 'F');

    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');

    // #
    doc.setTextColor(...muted);
    doc.text(`${i + 1}`, cols[0].x + 2, y + 6.5);

    // Coin
    doc.setTextColor(...dark);
    doc.setFont('helvetica', 'bold');
    doc.text(`${h.name} (${h.symbol.toUpperCase()})`, cols[1].x + 2, y + 6.5);

    // Amount
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...text);
    doc.text(h.amount.toLocaleString('en-US', { maximumFractionDigits: 6 }), cols[2].x + 2, y + 6.5);

    // Buy Price
    doc.text(fmt(h.buyPrice), cols[3].x + 2, y + 6.5);

    // Current Price
    doc.text(fmt(h.currentPrice), cols[4].x + 2, y + 6.5);

    // Investment
    doc.text(fmt(h.totalCost), cols[5].x + 2, y + 6.5);

    // Value
    doc.text(fmt(h.totalValue), cols[6].x + 2, y + 6.5);

    // P&L
    const pnlColor = h.pnl >= 0 ? green : red;
    doc.setTextColor(...pnlColor);
    doc.setFont('helvetica', 'bold');
    doc.text(`${h.pnl >= 0 ? '+' : ''}${fmt(h.pnl)}`, cols[7].x + 2, y + 6.5);

    y += 9;
  });

  // Bottom border
  doc.setDrawColor(...green);
  doc.setLineWidth(0.5);
  doc.line(M, y, M + CW, y);
  y += 6;

  // Totals row
  doc.setFillColor(...dark);
  doc.roundedRect(M, y, CW, 14, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('TOTAL', M + 5, y + 9);
  doc.text(`Invested: ${fmt(data.totalCost)}`, M + 45, y + 9);
  doc.text(`Value: ${fmt(data.totalValue)}`, M + 100, y + 9);

  const pnlCol = data.totalPnl >= 0 ? green : red;
  doc.setTextColor(...pnlCol);
  doc.text(`P&L: ${data.totalPnl >= 0 ? '+' : ''}${fmt(data.totalPnl)} (${data.totalPnlPercent.toFixed(2)}%)`, M + 145, y + 9);

  y += 24;

  // === DISCLAIMER ===
  if (y > 260) { doc.addPage(); y = 20; }
  doc.setTextColor(...muted);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'italic');
  doc.text('Disclaimer: This report is for informational purposes only. Prices are fetched from CoinGecko and may differ from exchange prices.', M, y);
  doc.text('Past performance does not guarantee future results. This is not financial advice.', M, y + 4);

  // Footer
  y = 285;
  doc.setDrawColor(...bg);
  doc.line(M, y, W - M, y);
  doc.setTextColor(...muted);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.text('CryptoTracker Portfolio Report', M, y + 5);
  doc.text(`Page 1`, W - M, y + 5, { align: 'right' });

  doc.save(`Portfolio-Report-${new Date().toISOString().slice(0, 10)}.pdf`);
}
