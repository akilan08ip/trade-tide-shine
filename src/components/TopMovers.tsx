import { CoinMarket, formatPrice, formatPercent } from '@/lib/api';
import { Link } from 'react-router-dom';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface TopMoversProps {
  coins: CoinMarket[];
}

export default function TopMovers({ coins }: TopMoversProps) {
  const sorted = [...coins].sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h);
  const gainers = sorted.slice(0, 5);
  const losers = sorted.slice(-5).reverse();

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div className="glass-card rounded-lg p-4">
        <div className="mb-3 flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-gain" />
          <h3 className="text-sm font-semibold">Top Gainers (24h)</h3>
        </div>
        <div className="space-y-2">
          {gainers.map(coin => (
            <Link key={coin.id} to={`/coin/${coin.id}`} className="flex items-center justify-between rounded-md px-3 py-2 transition-colors hover:bg-secondary/50">
              <div className="flex items-center gap-2.5">
                <img src={coin.image} alt={coin.name} className="h-5 w-5 rounded-full" />
                <span className="text-sm font-medium">{coin.symbol.toUpperCase()}</span>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono text-muted-foreground">{formatPrice(coin.current_price)}</span>
                <span className="ml-2 text-xs font-mono font-semibold text-gain">{formatPercent(coin.price_change_percentage_24h)}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="glass-card rounded-lg p-4">
        <div className="mb-3 flex items-center gap-2">
          <TrendingDown className="h-4 w-4 text-loss" />
          <h3 className="text-sm font-semibold">Top Losers (24h)</h3>
        </div>
        <div className="space-y-2">
          {losers.map(coin => (
            <Link key={coin.id} to={`/coin/${coin.id}`} className="flex items-center justify-between rounded-md px-3 py-2 transition-colors hover:bg-secondary/50">
              <div className="flex items-center gap-2.5">
                <img src={coin.image} alt={coin.name} className="h-5 w-5 rounded-full" />
                <span className="text-sm font-medium">{coin.symbol.toUpperCase()}</span>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono text-muted-foreground">{formatPrice(coin.current_price)}</span>
                <span className="ml-2 text-xs font-mono font-semibold text-loss">{formatPercent(coin.price_change_percentage_24h)}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
