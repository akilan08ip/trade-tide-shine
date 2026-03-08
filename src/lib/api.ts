const BASE_URL = 'https://api.coingecko.com/api/v3';

export interface CoinMarket {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  total_volume: number;
  price_change_percentage_24h: number;
  price_change_percentage_7d_in_currency?: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number | null;
  sparkline_in_7d?: { price: number[] };
  ath: number;
  ath_change_percentage: number;
  high_24h: number;
  low_24h: number;
}

export interface CoinDetail {
  id: string;
  symbol: string;
  name: string;
  image: { large: string; small: string; thumb: string };
  market_data: {
    current_price: { usd: number; inr: number };
    market_cap: { usd: number; inr: number };
    total_volume: { usd: number; inr: number };
    price_change_percentage_24h: number;
    price_change_percentage_7d: number;
    price_change_percentage_30d: number;
    price_change_percentage_1y: number;
    high_24h: { usd: number; inr: number };
    low_24h: { usd: number; inr: number };
    circulating_supply: number;
    total_supply: number | null;
    max_supply: number | null;
    ath: { usd: number; inr: number };
    atl: { usd: number; inr: number };
    market_cap_rank: number;
  };
  description: { en: string };
  links: { homepage: string[]; blockchain_site: string[] };
}

export interface GlobalData {
  data: {
    total_market_cap: { usd: number };
    total_volume: { usd: number };
    market_cap_percentage: Record<string, number>;
    market_cap_change_percentage_24h_usd: number;
    active_cryptocurrencies: number;
  };
}

export interface TrendingCoin {
  item: {
    id: string;
    coin_id: number;
    name: string;
    symbol: string;
    thumb: string;
    small: string;
    price_btc: number;
    data: {
      price: number;
      price_change_percentage_24h: { usd: number };
    };
  };
}

export async function fetchCoins(page = 1, perPage = 100): Promise<CoinMarket[]> {
  const res = await fetch(
    `${BASE_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${perPage}&page=${page}&sparkline=true&price_change_percentage=7d`
  );
  if (!res.ok) throw new Error('Failed to fetch coins');
  return res.json();
}

export async function fetchCoinDetail(id: string): Promise<CoinDetail> {
  const res = await fetch(`${BASE_URL}/coins/${id}?localization=false&tickers=false&community_data=false&developer_data=false`);
  if (!res.ok) throw new Error('Failed to fetch coin detail');
  return res.json();
}

export async function fetchCoinChart(id: string, days: number): Promise<{ prices: [number, number][] }> {
  const res = await fetch(`${BASE_URL}/coins/${id}/market_chart?vs_currency=usd&days=${days}`);
  if (!res.ok) throw new Error('Failed to fetch chart');
  return res.json();
}

export async function fetchGlobalData(): Promise<GlobalData> {
  const res = await fetch(`${BASE_URL}/global`);
  if (!res.ok) throw new Error('Failed to fetch global data');
  return res.json();
}

export async function fetchTrending(): Promise<{ coins: TrendingCoin[] }> {
  const res = await fetch(`${BASE_URL}/search/trending`);
  if (!res.ok) throw new Error('Failed to fetch trending');
  return res.json();
}

export function formatPrice(price: number): string {
  if (price >= 1) return price.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 });
  if (price >= 0.01) return price.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 4, maximumFractionDigits: 4 });
  return price.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 6, maximumFractionDigits: 8 });
}

export function formatINR(price: number): string {
  if (price >= 1) return price.toLocaleString('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2, maximumFractionDigits: 2 });
  if (price >= 0.01) return price.toLocaleString('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 4, maximumFractionDigits: 4 });
  return price.toLocaleString('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 6, maximumFractionDigits: 8 });
}

export function formatMarketCap(value: number): string {
  if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
  if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
  return `$${value.toLocaleString()}`;
}

export function formatMarketCapINR(value: number): string {
  if (value >= 1e12) return `₹${(value / 1e12).toFixed(2)}T`;
  if (value >= 1e9) return `₹${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `₹${(value / 1e6).toFixed(2)}M`;
  return `₹${value.toLocaleString('en-IN')}`;
}

export function formatPercent(value: number | null | undefined): string {
  if (value == null) return 'N/A';
  return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
}
