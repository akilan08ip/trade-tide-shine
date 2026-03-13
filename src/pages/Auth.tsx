import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { lovable } from '@/integrations/lovable/index';
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

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-border/60" />
              <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">or</span>
              <div className="flex-1 h-px bg-border/60" />
            </div>

            {/* Google Sign In */}
            <Button
              type="button"
              variant="outline"
              disabled={loading}
              onClick={async () => {
                setLoading(true);
                const { error } = await lovable.auth.signInWithOAuth("google", {
                  redirect_uri: window.location.origin,
                });
                if (error) {
                  toast({ title: 'Access Denied', description: error.message, variant: 'destructive' });
                  setLoading(false);
                }
              }}
              className="w-full h-12 font-mono text-sm tracking-wide border-border/60 bg-background/80 hover:bg-accent/60 hover:border-primary/40 transition-all group"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Sign in with Google
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
