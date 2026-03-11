import jsPDF from 'jspdf';

export function generateProjectPDF() {
  const doc = new jsPDF('p', 'mm', 'a4');
  const pageWidth = 210;
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let y = 20;

  const colors = {
    primary: [16, 185, 129] as [number, number, number],    // emerald
    dark: [15, 23, 42] as [number, number, number],          // slate-900
    text: [30, 41, 59] as [number, number, number],          // slate-800
    muted: [100, 116, 139] as [number, number, number],      // slate-500
    accent: [5, 150, 105] as [number, number, number],       // emerald-600
    bg: [241, 245, 249] as [number, number, number],         // slate-100
  };

  function addPage() {
    doc.addPage();
    y = 20;
  }

  function checkPage(needed: number) {
    if (y + needed > 275) addPage();
  }

  // === COVER PAGE ===
  doc.setFillColor(...colors.dark);
  doc.rect(0, 0, 210, 297, 'F');

  // Accent bar
  doc.setFillColor(...colors.primary);
  doc.rect(0, 0, 210, 6, 'F');

  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(36);
  doc.setFont('helvetica', 'bold');
  doc.text('CryptoTracker', pageWidth / 2, 100, { align: 'center' });

  doc.setFontSize(16);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...colors.primary);
  doc.text('Real-Time Cryptocurrency Portfolio Dashboard', pageWidth / 2, 115, { align: 'center' });

  // Divider
  doc.setDrawColor(...colors.primary);
  doc.setLineWidth(0.5);
  doc.line(60, 125, 150, 125);

  doc.setTextColor(200, 200, 200);
  doc.setFontSize(12);
  doc.text('Project Documentation', pageWidth / 2, 140, { align: 'center' });
  doc.text(`Generated: ${new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}`, pageWidth / 2, 150, { align: 'center' });

  // Tech stack badges
  const techs = ['React', 'TypeScript', 'Tailwind CSS', 'Vite', 'CoinGecko API'];
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  let bx = 40;
  techs.forEach(t => {
    const tw = doc.getTextWidth(t) + 10;
    doc.setFillColor(40, 55, 75);
    doc.roundedRect(bx, 170, tw, 10, 3, 3, 'F');
    doc.text(t, bx + 5, 177);
    bx += tw + 5;
  });

  // === PAGE 2: TABLE OF CONTENTS ===
  addPage();
  doc.setFillColor(...colors.bg);
  doc.rect(0, 0, 210, 297, 'F');

  doc.setTextColor(...colors.dark);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('Table of Contents', margin, y + 10);
  y += 25;

  doc.setDrawColor(...colors.primary);
  doc.setLineWidth(1);
  doc.line(margin, y, margin + 40, y);
  y += 15;

  const toc = [
    '1. Project Overview',
    '2. Key Features',
    '3. Technology Stack',
    '4. System Architecture',
    '5. Pages & Modules',
    '6. API Integration',
    '7. Data Flow',
    '8. Future Enhancements',
  ];

  doc.setFontSize(13);
  doc.setFont('helvetica', 'normal');
  toc.forEach((item, i) => {
    doc.setTextColor(...colors.text);
    doc.text(item, margin + 5, y);
    doc.setTextColor(...colors.muted);
    doc.text(`${i + 3}`, pageWidth - margin, y, { align: 'right' });
    y += 10;
  });

  // === PAGE 3: PROJECT OVERVIEW ===
  addPage();
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, 210, 297, 'F');

  // Section header
  function sectionHeader(title: string) {
    checkPage(25);
    doc.setFillColor(...colors.primary);
    doc.rect(margin, y, 4, 12, 'F');
    doc.setTextColor(...colors.dark);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text(title, margin + 10, y + 10);
    y += 20;
    doc.setDrawColor(...colors.bg);
    doc.setLineWidth(0.3);
    doc.line(margin, y, pageWidth - margin, y);
    y += 8;
  }

  function bodyText(text: string) {
    checkPage(10);
    doc.setTextColor(...colors.text);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    const lines = doc.splitTextToSize(text, contentWidth);
    doc.text(lines, margin, y);
    y += lines.length * 6 + 4;
  }

  function bulletPoint(text: string) {
    checkPage(10);
    doc.setFillColor(...colors.primary);
    doc.circle(margin + 3, y - 1.5, 1.5, 'F');
    doc.setTextColor(...colors.text);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    const lines = doc.splitTextToSize(text, contentWidth - 12);
    doc.text(lines, margin + 10, y);
    y += lines.length * 6 + 3;
  }

  function subHeader(text: string) {
    checkPage(15);
    doc.setTextColor(...colors.accent);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(text, margin, y);
    y += 10;
  }

  sectionHeader('1. Project Overview');
  bodyText(
    'CryptoTracker is a modern, real-time cryptocurrency portfolio monitoring dashboard built with React and TypeScript. It enables users to browse live market data for hundreds of cryptocurrencies, track price movements, manage a personal portfolio of purchased coins, and monitor profit/loss — all from a single, unified interface.'
  );
  bodyText(
    'The application fetches live data from the CoinGecko API, providing up-to-date pricing, market capitalization, trading volumes, and historical charts. The design features a sleek dark theme with glassmorphism effects, interactive animations via Framer Motion, and a fully responsive layout.'
  );

  // === KEY FEATURES ===
  sectionHeader('2. Key Features');

  subHeader('2.1 Live Market Dashboard');
  bulletPoint('Real-time prices for top 100+ cryptocurrencies updated every 30 seconds');
  bulletPoint('Search and filter coins by name or symbol');
  bulletPoint('Pagination to browse the full market');
  bulletPoint('7-day sparkline mini-charts for each coin');
  bulletPoint('Color-coded price change indicators (green for gain, red for loss)');

  subHeader('2.2 Portfolio Management');
  bulletPoint('Add coins to your portfolio with purchase amount and buy price');
  bulletPoint('Track total portfolio value in real-time');
  bulletPoint('View profit/loss (P&L) per coin and overall');
  bulletPoint('Remove coins from portfolio with one click');
  bulletPoint('Data persisted in localStorage — no account required');

  subHeader('2.3 Coin Detail Page');
  bulletPoint('Detailed view for each cryptocurrency with price, market cap, volume');
  bulletPoint('Interactive price charts with 1D, 7D, 30D, 90D, 1Y timeframes');
  bulletPoint('24h high/low, ATH, ATL, circulating supply, and max supply');
  bulletPoint('Animated stat tiles with hover effects and gradient overlays');

  subHeader('2.4 Market Dominance');
  bulletPoint('Visual breakdown of market share by top cryptocurrencies');
  bulletPoint('Global market statistics including total market cap and 24h volume');

  subHeader('2.5 Top Movers & Trending');
  bulletPoint('Trending coins section powered by CoinGecko trending API');
  bulletPoint('Quick-access cards showing price and 24h change');

  subHeader('2.6 News Section');
  bulletPoint('Dedicated page for crypto market news and updates');

  // === TECHNOLOGY STACK ===
  addPage();
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, 210, 297, 'F');
  y = 20;

  sectionHeader('3. Technology Stack');

  // Tech table
  const techStack = [
    ['Frontend Framework', 'React 18 with TypeScript'],
    ['Build Tool', 'Vite 5 (SWC plugin for fast HMR)'],
    ['Styling', 'Tailwind CSS 3 + custom design tokens'],
    ['UI Components', 'shadcn/ui (Radix UI primitives)'],
    ['Animations', 'Framer Motion 12'],
    ['State Management', 'TanStack React Query v5'],
    ['Routing', 'React Router DOM v6'],
    ['Charts', 'Recharts 2'],
    ['API Source', 'CoinGecko Free API v3'],
    ['Form Handling', 'React Hook Form + Zod validation'],
    ['Local Storage', 'Portfolio data persistence'],
  ];

  doc.setFillColor(...colors.dark);
  doc.rect(margin, y, contentWidth, 10, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Category', margin + 4, y + 7);
  doc.text('Technology', margin + 65, y + 7);
  y += 10;

  techStack.forEach((row, i) => {
    checkPage(10);
    const fill = i % 2 === 0 ? colors.bg : [255, 255, 255] as [number, number, number];
    doc.setFillColor(...fill);
    doc.rect(margin, y, contentWidth, 9, 'F');
    doc.setTextColor(...colors.text);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(row[0], margin + 4, y + 6.5);
    doc.setFont('helvetica', 'normal');
    doc.text(row[1], margin + 65, y + 6.5);
    y += 9;
  });
  y += 10;

  // === SYSTEM ARCHITECTURE ===
  sectionHeader('4. System Architecture');
  bodyText(
    'The application follows a component-based architecture with clear separation of concerns:'
  );
  bulletPoint('Pages Layer: Index, CoinDetail, Portfolio, Dominance, News — each a route-level component');
  bulletPoint('Components Layer: Reusable UI components like CoinRow, Header, MarketStats, SparklineChart, TopMovers');
  bulletPoint('Hooks Layer: Custom hooks (useCryptoData, usePortfolio) encapsulate data fetching and state logic');
  bulletPoint('API Layer: Centralized API functions in lib/api.ts with TypeScript interfaces');
  bulletPoint('UI Library: shadcn/ui components providing accessible, themeable primitives');

  // === PAGES & MODULES ===
  sectionHeader('5. Pages & Modules');

  const pages = [
    ['/ (Home)', 'Main dashboard with market stats, trending coins, and paginated coin table with search functionality'],
    ['/coin/:id', 'Detailed coin view with interactive charts, price statistics, supply data, and animated metric tiles'],
    ['/portfolio', 'Personal portfolio tracker — add coins, view holdings, track P&L with real-time price updates'],
    ['/dominance', 'Market dominance visualization showing percentage share of top cryptocurrencies'],
    ['/news', 'Crypto news and market updates section'],
  ];

  pages.forEach(([page, desc]) => {
    checkPage(18);
    doc.setTextColor(...colors.accent);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(page, margin + 5, y);
    y += 6;
    doc.setTextColor(...colors.text);
    doc.setFont('helvetica', 'normal');
    const lines = doc.splitTextToSize(desc, contentWidth - 10);
    doc.text(lines, margin + 5, y);
    y += lines.length * 6 + 5;
  });

  // === API INTEGRATION ===
  addPage();
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, 210, 297, 'F');
  y = 20;

  sectionHeader('6. API Integration');
  bodyText('The application integrates with the CoinGecko API v3 (free tier) through the following endpoints:');

  const apis = [
    ['GET /coins/markets', 'Fetches paginated list of coins with market data, sparklines, and 7-day price changes'],
    ['GET /coins/{id}', 'Retrieves detailed information for a specific cryptocurrency'],
    ['GET /coins/{id}/market_chart', 'Gets historical price data for chart rendering (1D to 1Y)'],
    ['GET /global', 'Fetches global market statistics (total market cap, volume, dominance)'],
    ['GET /search/trending', 'Returns currently trending cryptocurrencies'],
  ];

  apis.forEach(([endpoint, desc]) => {
    checkPage(15);
    doc.setFillColor(240, 245, 250);
    doc.roundedRect(margin, y - 4, contentWidth, 18, 2, 2, 'F');
    doc.setTextColor(...colors.dark);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(endpoint, margin + 4, y + 2);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...colors.muted);
    const lines = doc.splitTextToSize(desc, contentWidth - 8);
    doc.text(lines, margin + 4, y + 8);
    y += 22;
  });

  y += 5;
  bodyText('Data is cached and auto-refreshed using TanStack React Query with configurable stale times (15-60 seconds) to balance freshness with API rate limits.');

  // === DATA FLOW ===
  sectionHeader('7. Data Flow');
  bodyText('1. User navigates to a page → React Router renders the corresponding page component');
  bodyText('2. Page component calls custom hooks (useCoins, useCoinDetail, etc.)');
  bodyText('3. Hooks use TanStack React Query to fetch data from CoinGecko API');
  bodyText('4. Data is cached and auto-refreshed at configured intervals');
  bodyText('5. Components receive data via props and render with Framer Motion animations');
  bodyText('6. Portfolio data is stored in localStorage via usePortfolio hook');
  bodyText('7. Price updates merge with portfolio holdings to calculate live P&L');

  // === FUTURE ENHANCEMENTS ===
  sectionHeader('8. Future Enhancements');
  bulletPoint('Price Alerts: Notify users when a coin reaches a target price');
  bulletPoint('Multi-Currency Support: Display prices in INR, EUR, GBP alongside USD');
  bulletPoint('Advanced Charts: Candlestick charts, technical indicators (RSI, MACD)');
  bulletPoint('Cloud Sync: Backend database to sync portfolio across devices');
  bulletPoint('Watchlist: Save favorite coins for quick access');
  bulletPoint('Dark/Light Theme Toggle: User-selectable theme preferences');
  bulletPoint('Export Portfolio: Download portfolio data as CSV');
  bulletPoint('Mobile App: Progressive Web App (PWA) support for mobile installation');

  // Footer on last page
  y += 15;
  doc.setDrawColor(...colors.primary);
  doc.setLineWidth(0.5);
  doc.line(margin, y, pageWidth - margin, y);
  y += 8;
  doc.setTextColor(...colors.muted);
  doc.setFontSize(9);
  doc.text('CryptoTracker — Built with React, TypeScript & CoinGecko API', pageWidth / 2, y, { align: 'center' });
  doc.text(`Document generated on ${new Date().toLocaleString()}`, pageWidth / 2, y + 5, { align: 'center' });

  doc.save('CryptoTracker-Project-Documentation.pdf');
}
