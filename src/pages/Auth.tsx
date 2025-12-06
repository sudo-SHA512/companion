import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Mail, Lock, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().trim().email('Bitte geben Sie eine gültige E-Mail-Adresse ein').max(255, 'E-Mail darf maximal 255 Zeichen haben'),
  password: z.string().min(1, 'Bitte geben Sie Ihr Passwort ein').max(128, 'Passwort darf maximal 128 Zeichen haben'),
});

const Auth: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  const { signIn, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const validateForm = (): boolean => {
    setFieldErrors({});
    
    const result = loginSchema.safeParse({ email, password });
    
    if (!result.success) {
      const errors: { email?: string; password?: string } = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as string;
        if (field === 'email' || field === 'password') {
          errors[field] = err.message;
        }
      });
      setFieldErrors(errors);
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);

    try {
      const { error } = await signIn(email.trim(), password);
      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          toast({
            title: 'Anmeldung fehlgeschlagen',
            description: 'E-Mail oder Passwort ist falsch.',
            variant: 'destructive'
          });
        } else {
          toast({
            title: 'Fehler',
            description: error.message,
            variant: 'destructive'
          });
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-violet-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
      </div>

      {/* Left Side - Branding (Desktop only) */}
      <div className="hidden lg:flex flex-1 items-center justify-center p-12 relative">
        <div className="max-w-lg space-y-8 animate-fade-in">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
              <Shield className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-white/80">ISO 27001 • TISAX • NIS2</span>
            </div>
            
            <h1 className="text-5xl font-bold text-white tracking-tight leading-tight">
              Audit Companion
              <span className="block text-gradient bg-gradient-to-r from-primary via-violet-400 to-primary bg-clip-text text-transparent">
                für Berater
              </span>
            </h1>
            
            <p className="text-lg text-slate-400 leading-relaxed">
              Professionelles internes Audit-Management. Strukturiert, effizient und auf Zertifizierung vorbereitet.
            </p>
          </div>

          {/* Features */}
          <div className="space-y-4">
            {[
              'Zertifizierungsreife-Score in Echtzeit',
              'Berater-Wissensdatenbank für Best Practices',
              'Strukturierte Audit-Planung & Zeiterfassung',
            ].map((feature, idx) => (
              <div 
                key={idx} 
                className="flex items-center gap-3 text-slate-300 animate-fade-in"
                style={{ animationDelay: `${0.2 + idx * 0.1}s` }}
              >
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                </div>
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 relative">
        <div className="w-full max-w-md animate-scale-in">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-violet-600 rounded-2xl mb-4 shadow-lg shadow-primary/30">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">Audit Companion</h1>
          </div>

          {/* Form Card */}
          <div className="relative">
            {/* Glow effect behind card */}
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/50 via-violet-500/50 to-primary/50 rounded-3xl blur-xl opacity-30" />
            
            <div className="relative bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl p-8">
              {/* Desktop Logo inside card */}
              <div className="hidden lg:flex items-center gap-3 mb-8">
                <div className="p-2.5 bg-gradient-to-br from-primary to-violet-600 rounded-xl shadow-lg shadow-primary/30">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-white">Willkommen zurück</h2>
                  <p className="text-sm text-slate-400">Melden Sie sich an, um fortzufahren</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-slate-300">
                    E-Mail-Adresse
                  </Label>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-violet-500/20 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition-opacity" />
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-primary transition-colors" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="name@firma.de"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`pl-11 h-12 bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500 
                                   focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl transition-all
                                   ${fieldErrors.email ? 'border-rose-500 focus:border-rose-500' : ''}`}
                        required
                        maxLength={255}
                      />
                    </div>
                  </div>
                  {fieldErrors.email && (
                    <p className="text-sm text-rose-400 flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-rose-400" />
                      {fieldErrors.email}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-slate-300">
                    Passwort
                  </Label>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-violet-500/20 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition-opacity" />
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-primary transition-colors" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={`pl-11 h-12 bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500 
                                   focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl transition-all
                                   ${fieldErrors.password ? 'border-rose-500 focus:border-rose-500' : ''}`}
                        required
                        maxLength={128}
                      />
                    </div>
                  </div>
                  {fieldErrors.password && (
                    <p className="text-sm text-rose-400 flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-rose-400" />
                      {fieldErrors.password}
                    </p>
                  )}
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-12 bg-gradient-to-r from-primary to-violet-600 hover:from-primary/90 hover:to-violet-600/90 
                             text-white font-semibold rounded-xl shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30
                             transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]
                             disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <span className="flex items-center gap-2">
                      Anmelden
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  )}
                </Button>
              </form>

              <div className="mt-8 pt-6 border-t border-slate-700/50">
                <p className="text-center text-sm text-slate-500">
                  Zugangsdaten erhalten Sie von Ihrem Administrator
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <p className="mt-8 text-center text-xs text-slate-600">
            © {new Date().getFullYear()} Audit Companion. Alle Rechte vorbehalten.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
