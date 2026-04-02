import { Link, useLocation, useNavigate } from 'react-router-dom';
import { TrendingUp, BarChart3, Briefcase, Newspaper, Search, Zap, LogIn, LogOut, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useGlobalData } from '@/hooks/useCryptoData';
import { formatMarketCap } from '@/lib/api';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LiveClock from './LiveClock';
import ThemeToggle from './ThemeToggle';
import { supabase } from '@/integrations/supabase/client';

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
  const navigate = useNavigate();
  const { data: globalData } = useGlobalData();
  const [searchValue, setSearchValue] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleSearch = (value: string) => {
    setSearchValue(value);
    onSearch?.(value);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border/30 bg-background/60 backdrop-blur-2xl">
      {/* Animated ticker bar */}
      {globalData && (
        <div className="border-b border-border/20 bg-gradient-to-r from-secondary/30 via-secondary/10 to-secondary/30 px-4 py-1.5 text-xs font-mono overflow-hidden">
          <motion.div
            className="flex items-center gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-1.5">
              <Zap className="h-3 w-3 text-warning" />
              <span className="text-muted-foreground">MCap:</span>
              <motion.span
                key={globalData.data.total_market_cap.usd}
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-foreground font-semibold"
              >
                {formatMarketCap(globalData.data.total_market_cap.usd)}
              </motion.span>
            </div>
            <div className="h-3 w-px bg-border/50" />
            <div className="flex items-center gap-1.5">
              <span className="text-muted-foreground">Vol:</span>
              <motion.span
                key={globalData.data.total_volume.usd}
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.05 }}
                className="text-foreground font-semibold"
              >
                {formatMarketCap(globalData.data.total_volume.usd)}
              </motion.span>
            </div>
            <div className="h-3 w-px bg-border/50" />
            <motion.div
              className={`flex items-center gap-1.5 rounded-full px-2 py-0.5 ${
                globalData.data.market_cap_change_percentage_24h_usd >= 0
                  ? 'bg-gain/10 text-gain'
                  : 'bg-loss/10 text-loss'
              }`}
              whileHover={{ scale: 1.05 }}
            >
              <span className="font-semibold">
                {globalData.data.market_cap_change_percentage_24h_usd >= 0 ? '▲' : '▼'}
                {' '}{Math.abs(globalData.data.market_cap_change_percentage_24h_usd).toFixed(2)}%
              </span>
            </motion.div>
            <div className="h-3 w-px bg-border/50 hidden md:block" />
            <span className="text-muted-foreground hidden md:inline">
              Coins: <span className="text-foreground">{globalData.data.active_cryptocurrencies.toLocaleString()}</span>
            </span>
            <div className="ml-auto flex items-center gap-3">
              <LiveClock />
              <div className="h-3 w-px bg-border/50" />
              <motion.span
                className="flex items-center gap-1.5 text-gain"
                animate={{ opacity: [1, 0.4, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <span className="h-2 w-2 rounded-full bg-gain shadow-[0_0_8px_hsl(142,71%,45%)]" />
                <span className="font-semibold tracking-wider text-[10px]">LIVE</span>
              </motion.span>
            </div>
          </motion.div>
        </div>
      )}

      <div className="flex items-center justify-between px-4 py-3 md:px-6">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2.5 group">
            <motion.div
              className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-primary shadow-[0_0_20px_hsl(142,71%,45%/0.4)]"
              whileHover={{ scale: 1.15, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            >
              <TrendingUp className="h-4.5 w-4.5 text-primary-foreground" />
              <div className="absolute inset-0 rounded-xl bg-primary/50 blur-md -z-10" />
            </motion.div>
            <span className="text-lg font-bold tracking-tight font-display gradient-text">CryptoTerminal</span>
          </Link>

          <nav className="hidden items-center gap-0.5 md:flex">
            {navItems.map(({ to, label, icon: Icon }) => {
              const isActive = location.pathname === to;
              return (
                <Link key={to} to={to} className="relative">
                  <motion.div
                    className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
                      isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Icon className={`h-4 w-4 ${isActive ? 'text-primary' : ''}`} />
                    {label}
                  </motion.div>
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 rounded-lg bg-secondary/80 -z-10"
                      layoutId="activeNav"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {location.pathname === '/' && (
          <motion.div
            className="relative w-40"
            animate={{ width: searchFocused ? 220 : 160 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            <Search className={`absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 transition-colors duration-200 ${searchFocused ? 'text-primary' : 'text-muted-foreground'}`} />
            <Input
              placeholder="Search..."
              value={searchValue}
              onChange={(e) => handleSearch(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              className={`pl-8 h-8 bg-secondary/50 border-border/50 text-xs transition-all duration-300 ${searchFocused ? 'border-primary/50 shadow-[0_0_15px_hsl(142,71%,45%/0.1)]' : ''}`}
            />
          </motion.div>
          )}

          {user ? (
            <div className="flex items-center gap-2">
              <motion.div
                className="flex items-center gap-2 rounded-lg bg-secondary/60 px-3 py-1.5 text-xs font-mono"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <User className="h-3.5 w-3.5 text-primary" />
                <span className="text-foreground max-w-[100px] truncate">
                  {user.user_metadata?.full_name || user.email?.split('@')[0]}
                </span>
              </motion.div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          ) : (
            <Link to="/auth">
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-1.5 text-xs border-primary/30 hover:border-primary/60 hover:bg-primary/10"
              >
                <LogIn className="h-3.5 w-3.5" />
                <span>Login</span>
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Mobile nav */}
      <nav className="flex items-center gap-1 border-t border-border/30 px-4 py-2 md:hidden">
        {navItems.map(({ to, label, icon: Icon }) => {
          const isActive = location.pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className="relative flex-1"
            >
              <motion.div
                className={`flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-medium transition-colors ${
                  isActive ? 'text-foreground' : 'text-muted-foreground'
                }`}
                whileTap={{ scale: 0.95 }}
              >
                <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-primary' : ''}`} />
                {label}
              </motion.div>
              {isActive && (
                <motion.div
                  className="absolute inset-0 rounded-lg bg-secondary/80 -z-10"
                  layoutId="activeMobileNav"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
