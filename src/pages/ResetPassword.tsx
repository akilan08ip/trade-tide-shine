import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import BinaryRain from '@/components/BinaryRain';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, Shield, Lock, KeyRound, ArrowRight } from 'lucide-react';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isRecovery, setIsRecovery] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    if (hashParams.get('type') === 'recovery') {
      setIsRecovery(true);
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setIsRecovery(true);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({ title: 'Error', description: 'Passwords do not match.', variant: 'destructive' });
      return;
    }
    if (password.length < 6) {
      toast({ title: 'Error', description: 'Password must be at least 6 characters.', variant: 'destructive' });
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) {
      toast({ title: 'Reset Failed', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Access Key Updated', description: 'Your password has been reset successfully.' });
      navigate('/');
    }
  };

  if (!isRecovery) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 z-0"><BinaryRain /></div>
        <div className="relative z-10 text-center space-y-4">
          <Shield className="w-12 h-12 text-primary mx-auto" />
          <p className="font-mono text-sm text-muted-foreground">Invalid or expired recovery link.</p>
          <Button onClick={() => navigate('/auth')} variant="outline" className="font-mono">
            Return to Terminal
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 z-0"><BinaryRain /></div>
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{ background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, hsl(142 71% 45% / 0.015) 2px, hsl(142 71% 45% / 0.015) 4px)' }}
      />
      <div
        className="absolute inset-0 z-[2] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, transparent 40%, hsl(0 0% 2% / 0.8) 100%)' }}
      />

      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="flex items-center gap-2 mb-2 px-1">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-destructive/80" />
            <div className="w-3 h-3 rounded-full" style={{ background: 'hsl(38 92% 50% / 0.8)' }} />
            <div className="w-3 h-3 rounded-full bg-primary/80" />
          </div>
          <span className="font-mono text-xs text-muted-foreground ml-2">
            secure_terminal_v3.2.1 — reset_access_key
          </span>
        </div>

        <div className="glass-card rounded-xl overflow-hidden border border-primary/20">
          <div className="border-b border-primary/20 px-6 py-4 flex items-center gap-3">
            <div className="relative">
              <KeyRound className="w-8 h-8 text-primary" />
              <div className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-primary animate-pulse" />
            </div>
            <div>
              <h1 className="font-display text-xl font-bold tracking-wider text-foreground">
                RESET ACCESS KEY
              </h1>
              <p className="font-mono text-xs text-muted-foreground mt-0.5">
                {'> enter new access credentials...'}
              </p>
            </div>
          </div>

          <form onSubmit={handleReset} className="p-6 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="password" className="font-mono text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <Lock className="w-3 h-3 text-primary" />
                New Access Key
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

            <div className="space-y-2">
              <Label htmlFor="confirm" className="font-mono text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <Lock className="w-3 h-3 text-primary" />
                Confirm Access Key
              </Label>
              <Input
                id="confirm"
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••••"
                className="bg-background/80 border-border/60 font-mono text-sm pl-4 pr-10 focus:border-primary/60 focus:ring-primary/30 h-11"
                minLength={6}
                required
              />
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
                  <KeyRound className="w-4 h-4 mr-2" />
                  UPDATE ACCESS KEY
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
          </form>

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
}
