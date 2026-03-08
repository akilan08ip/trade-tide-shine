import { Link, useLocation } from 'react-router-dom';
import { TrendingUp, BarChart3, Briefcase, Newspaper, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useGlobalData } from '@/hooks/useCryptoData';
import { formatMarketCap } from '@/lib/api';
import { useState } from 'react';

const navItems = [
  { to: '/', label: 'Markets', icon: TrendingUp },
  { to: '/dominance', label: 'Dominance', icon: BarChart3 },
  { to: '/portfolio', label: 'Portfolio', icon: Briefcase },
  { to: '/news', label: 'News', icon: Newspaper },
];

interface HeaderProps {
  onSearch?: (query: string) => void;
}

export default function Header({ onSearch }: HeaderProps) {
  const location = useLocation();
  const { data: globalData } = useGlobalData();
  const [searchValue, setSearchValue] = useState('');

  const handleSearch = (value: string) => {
    setSearchValue(value);
    onSearch?.(value);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border/30 bg-background/60 backdrop-blur-2xl">
      {/* Ticker bar */}
      {globalData && (
        <div className="border-b border-border/20 bg-secondary/20 px-4 py-1.5 text-xs font-mono">
          <div className="flex items-center gap-6 overflow-hidden">
            <span className="text-muted-foreground">Market Cap: <span className="text-foreground">{formatMarketCap(globalData.data.total_market_cap.usd)}</span></span>
            <span className="text-muted-foreground">24h Vol: <span className="text-foreground">{formatMarketCap(globalData.data.total_volume.usd)}</span></span>
            <span className="text-muted-foreground">
              24h Change:{' '}
              <span className={globalData.data.market_cap_change_percentage_24h_usd >= 0 ? 'text-gain' : 'text-loss'}>
                {globalData.data.market_cap_change_percentage_24h_usd >= 0 ? '+' : ''}
                {globalData.data.market_cap_change_percentage_24h_usd.toFixed(2)}%
              </span>
            </span>
            <span className="text-muted-foreground">Coins: <span className="text-foreground">{globalData.data.active_cryptocurrencies.toLocaleString()}</span></span>
            <span className="flex items-center gap-1.5 text-gain">
              <span className="h-1.5 w-1.5 rounded-full bg-gain pulse-dot" />
              LIVE
            </span>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between px-4 py-3 md:px-6">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary glow-green transition-all duration-300 group-hover:scale-110">
              <TrendingUp className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold tracking-tight font-display gradient-text">CryptoTerminal</span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  location.pathname === to
                    ? 'bg-secondary text-foreground'
                    : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))}
          </nav>
        </div>

        {location.pathname === '/' && (
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search coins..."
              value={searchValue}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-9 h-9 bg-secondary/50 border-border/50 text-sm"
            />
          </div>
        )}
      </div>

      {/* Mobile nav */}
      <nav className="flex items-center gap-1 border-t border-border/30 px-4 py-2 md:hidden">
        {navItems.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-md py-2 text-xs font-medium transition-colors ${
              location.pathname === to
                ? 'bg-secondary text-foreground'
                : 'text-muted-foreground'
            }`}
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
