import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import BinaryRain from '@/components/BinaryRain';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, Shield, Lock, Mail, User, ArrowRight, Zap } from 'lucide-react';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [glitchText, setGlitchText] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check if already logged in
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate('/');
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate('/');
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  // Glitch effect interval
  useEffect(() => {
    const interval = setInterval(() => {
      setGlitchText(true);
      setTimeout(() => setGlitchText(false), 150);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    if (!isLogin && !fullName.trim()) return;

    setLoading(true);
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast({ title: 'Access Granted', description: 'Welcome back, operator.' });
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName },
            emailRedirectTo: window.location.origin,
          },
        });
        if (error) throw error;
        toast({
          title: 'Identity Created',
          description: 'Check your email to verify your identity.',
        });
      }
    } catch (error: any) {
      toast({
        title: 'Access Denied',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Binary rain background */}
      <div className="absolute inset-0 z-0">
        <BinaryRain />
      </div>

      {/* Scan line overlay */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, hsl(142 71% 45% / 0.015) 2px, hsl(142 71% 45% / 0.015) 4px)',
        }}
      />

      {/* Vignette */}
      <div
        className="absolute inset-0 z-[2] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, hsl(0 0% 2% / 0.8) 100%)',
        }}
      />

      {/* Auth card */}
      <div className="relative z-10 w-full max-w-md mx-4">
        {/* Terminal header */}
        <div className="flex items-center gap-2 mb-2 px-1">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-destructive/80" />
            <div className="w-3 h-3 rounded-full" style={{ background: 'hsl(38 92% 50% / 0.8)' }} />
            <div className="w-3 h-3 rounded-full bg-primary/80" />
          </div>
          <span className="font-mono text-xs text-muted-foreground ml-2">
            secure_terminal_v3.2.1 — {isLogin ? 'authenticate' : 'register'}
          </span>
        </div>

        <div className="glass-card rounded-xl overflow-hidden border border-primary/20">
          {/* Header strip */}
          <div className="border-b border-primary/20 px-6 py-4 flex items-center gap-3">
            <div className="relative">
              <Shield className="w-8 h-8 text-primary" />
              <div className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-primary animate-pulse" />
            </div>
            <div>
              <h1
                className={`font-display text-xl font-bold tracking-wider text-foreground transition-all ${
                  glitchText ? 'translate-x-[2px] text-primary' : ''
                }`}
              >
                {isLogin ? 'AUTHENTICATE' : 'CREATE IDENTITY'}
              </h1>
              <p className="font-mono text-xs text-muted-foreground mt-0.5">
                {isLogin ? '> verify credentials...' : '> initializing new profile...'}
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="fullName" className="font-mono text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <User className="w-3 h-3 text-primary" />
                  Operator Name
                </Label>
                <div className="relative">
                  <Input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your callsign"
                    className="bg-background/80 border-border/60 font-mono text-sm pl-4 focus:border-primary/60 focus:ring-primary/30 h-11"
                    maxLength={100}
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="font-mono text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <Mail className="w-3 h-3 text-primary" />
                Secure Channel
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="operator@network.io"
                className="bg-background/80 border-border/60 font-mono text-sm pl-4 focus:border-primary/60 focus:ring-primary/30 h-11"
                maxLength={255}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="font-mono text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <Lock className="w-3 h-3 text-primary" />
                Access Key
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••"
                  className="bg-background/80 border-border/60 font-mono text-sm pl-4 pr-10 focus:border-primary/60 focus:ring-primary/30 h-11"
                  minLength={6}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 font-display text-sm tracking-widest uppercase bg-primary/90 hover:bg-primary text-primary-foreground relative overflow-hidden group"
            >
              {loading ? (
                <span className="font-mono animate-pulse">PROCESSING...</span>
              ) : (
                <>
                  <Zap className="w-4 h-4 mr-2 group-hover:animate-pulse" />
                  {isLogin ? 'INITIATE LOGIN' : 'REGISTER IDENTITY'}
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </>
              )}
              {/* Scan line on button */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-foreground/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            </Button>
          </form>

          {/* Footer toggle */}
          <div className="border-t border-border/40 px-6 py-4 text-center">
            <p className="font-mono text-xs text-muted-foreground">
              {isLogin ? '> no identity found?' : '> already registered?'}{' '}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-primary hover:text-primary/80 underline underline-offset-4 transition-colors"
              >
                {isLogin ? 'create new identity' : 'authenticate'}
              </button>
            </p>
          </div>

          {/* Status bar */}
          <div className="bg-primary/5 border-t border-primary/10 px-6 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary pulse-dot" />
              <span className="font-mono text-[10px] text-primary/70 uppercase">Encrypted Connection</span>
            </div>
            <span className="font-mono text-[10px] text-muted-foreground">TLS 1.3 • AES-256</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
