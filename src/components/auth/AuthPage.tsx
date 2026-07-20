import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Loader2, ChevronLeft } from 'lucide-react';

const logoUrl = 'https://miaoda-conversation-file.s3cdn.medo.dev/user-cc0cvmcrcxkw/app-cdkoojeqtu69/20260706/mayuresh.jpeg';

export type AuthView = 'login' | 'register' | 'forgot';

interface AuthPageProps {
  view: AuthView;
  setView: (view: AuthView) => void;
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  showPassword: boolean;
  setShowPassword: (value: boolean) => void;
  authLoading: boolean;
  googleLoading: boolean;
  onLogin: () => void;
  onRegister: () => void;
  onForgot: () => void;
  onGoogle: () => void;
}

const GoogleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.19 3.32v2.77h3.55c2.08-1.92 3.27-4.74 3.27-8.1z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.55-2.77c-.98.66-2.23 1.06-3.73 1.06-2.87 0-5.3-1.94-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.86-2.59 3.29-4.53 6.16-4.53z" />
  </svg>
);

const PeacockFeather: React.FC = () => (
  <svg className="w-24 h-24 md:w-32 md:h-32" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M50 90C50 90 20 70 20 45C20 25 35 10 50 10C65 10 80 25 80 45C80 70 50 90 50 90Z" fill="#1E3A8A" opacity="0.15" />
    <circle cx="50" cy="42" r="14" fill="#1E3A8A" opacity="0.25" />
    <circle cx="50" cy="42" r="8" fill="#34D399" opacity="0.6" />
    <circle cx="50" cy="42" r="3" fill="#1E3A8A" />
    <path d="M50 28L52 18L50 20L48 18L50 28Z" fill="#1E3A8A" opacity="0.3" />
    <path d="M64 42H74L72 44L74 46H64" fill="#1E3A8A" opacity="0.3" />
    <path d="M36 42H26L28 44L26 46H36" fill="#1E3A8A" opacity="0.3" />
    <path d="M60 30L68 22L66 28L72 26L60 30Z" fill="#1E3A8A" opacity="0.25" />
    <path d="M40 30L32 22L34 28L28 26L40 30Z" fill="#1E3A8A" opacity="0.25" />
  </svg>
);

const MobileAuth: React.FC<AuthPageProps> = (props) => {
  const navigate = useNavigate();
  const {
    view, setView, email, setEmail, password, setPassword,
    showPassword, setShowPassword, authLoading, googleLoading,
    onLogin, onRegister, onForgot, onGoogle,
  } = props;

  return (
    <div className="md:hidden min-h-screen bg-background">
      <div className="bg-background border-b border-border px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-muted rounded-lg transition-colors" aria-label="Go back">
          <ChevronLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="text-base font-bold text-foreground flex-1">
          {view === 'login' ? 'Login' : view === 'register' ? 'Register' : 'Forgot Password'}
        </h1>
      </div>

      <div className="px-4 py-6 pb-6 max-w-sm mx-auto">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <img
            src={logoUrl}
            alt="Mayuresh Enterprises"
            className="w-20 h-20 rounded-2xl object-contain bg-white border border-border shadow-sm mb-3"
          />
          <h2 className="text-xl font-bold text-foreground">
            Mayuresh <span className="text-primary">Enterprises</span>
          </h2>
          <p className="text-xs text-muted-foreground mt-1">Print Your Imagination</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">Email Address</label>
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-border bg-background focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
              <Mail className="w-4 h-4 text-muted-foreground shrink-0" />
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
            </div>
          </div>

          {view !== 'forgot' && (
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Password</label>
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-border bg-background focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
                <Lock className="w-4 h-4 text-muted-foreground shrink-0" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder={view === 'register' ? 'Min 6 characters' : 'Enter your password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                />
                <button onClick={() => setShowPassword(!showPassword)} className="shrink-0" aria-label="Toggle password">
                  {showPassword ? <EyeOff className="w-4 h-4 text-muted-foreground" /> : <Eye className="w-4 h-4 text-muted-foreground" />}
                </button>
              </div>
            </div>
          )}

          {view === 'login' && (
            <button onClick={() => setView('forgot')} className="text-xs text-primary font-medium">
              Forgot Password?
            </button>
          )}

          <button
            onClick={view === 'login' ? onLogin : view === 'register' ? onRegister : onForgot}
            disabled={authLoading || googleLoading}
            className="w-full flex items-center justify-center gap-2 bg-primary text-white font-semibold py-3 rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-60"
          >
            {authLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {view === 'login' ? 'Login' : view === 'register' ? 'Register' : 'Send Reset Link'}
          </button>

          {view !== 'forgot' && (
            <>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-border" />
                <span className="text-[10px] text-muted-foreground uppercase tracking-wide">or</span>
                <div className="flex-1 h-px bg-border" />
              </div>
              <button
                onClick={onGoogle}
                disabled={authLoading || googleLoading}
                className="w-full flex items-center justify-center gap-2 bg-card border border-border text-foreground font-semibold py-3 rounded-xl hover:bg-muted transition-colors disabled:opacity-60"
              >
                <GoogleIcon className="w-5 h-5" />
                {view === 'login' ? 'Login with Google' : 'Register with Google'}
              </button>
            </>
          )}

          <div className="text-center">
            {view === 'login' ? (
              <p className="text-xs text-muted-foreground">
                Don&apos;t have an account?{' '}
                <button onClick={() => setView('register')} className="text-primary font-medium">Register</button>
              </p>
            ) : view === 'register' ? (
              <p className="text-xs text-muted-foreground">
                Already have an account?{' '}
                <button onClick={() => setView('login')} className="text-primary font-medium">Login</button>
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">
                Remember your password?{' '}
                <button onClick={() => setView('login')} className="text-primary font-medium">Login</button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const DesktopAuth: React.FC<AuthPageProps> = (props) => {
  const {
    view, setView, email, setEmail, password, setPassword,
    showPassword, setShowPassword, authLoading, googleLoading,
    onLogin, onRegister, onForgot, onGoogle,
  } = props;

  const heading = view === 'login' ? 'Welcome Back!' : view === 'register' ? 'Create Account' : 'Reset Password';
  const subheading = view === 'login'
    ? 'Login to continue to your account'
    : view === 'register'
      ? 'Register to start printing with us'
      : 'Enter your email to receive a reset link';
  const ctaText = view === 'login' ? 'Login' : view === 'register' ? 'Register' : 'Send Reset Link';
  const googleText = view === 'login' ? 'Continue with Google' : 'Register with Google';

  return (
    <div className="hidden md:flex min-h-screen w-full relative overflow-hidden bg-[#FAFAFA]">
      {/* Decorative background shapes */}
      <div className="absolute -top-10 -left-10 w-64 h-64 lg:w-80 lg:h-80 bg-[#FF6B00]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-20 right-10 w-40 h-40 lg:w-56 lg:h-56 bg-[#1E3A8A]/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-40 lg:h-56 bg-[#1E3A8A] pointer-events-none" style={{ clipPath: 'ellipse(80% 100% at 50% 100%)' }} />
      <div className="absolute bottom-0 right-0 opacity-40 pointer-events-none">
        <PeacockFeather />
      </div>
      <div className="absolute top-8 left-8 w-32 h-10 border border-[#E5E7EB] rounded-lg rotate-[-12deg] opacity-40 pointer-events-none" />
      <div className="absolute bottom-48 right-12 w-24 h-24 border border-dashed border-[#E5E7EB] rounded-full opacity-50 pointer-events-none" />

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 z-10">
        {/* Logo and brand */}
        <div className="flex flex-col items-center mb-8">
          <img
            src={logoUrl}
            alt="Mayuresh Enterprises"
            className="w-20 h-20 lg:w-24 lg:h-24 rounded-2xl object-contain bg-white border border-[#E5E7EB] shadow-md mb-4"
          />
          <h2 className="text-2xl lg:text-3xl font-bold text-[#111827]">
            Mayuresh <span className="text-[#FF6B00]">Enterprises</span>
          </h2>
          <p className="text-sm text-[#6B7280] mt-1">Print Your Imagination</p>
        </div>

        {/* Card */}
        <div className="w-full max-w-md bg-white rounded-[20px] shadow-[0_20px_60px_rgba(0,0,0,0.08)] px-8 py-10 lg:px-10 lg:py-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h1 className="text-2xl lg:text-3xl font-bold text-center text-[#111827] mb-2">
            {heading}
            {view === 'login' && <span className="inline-block ml-2">👋</span>}
          </h1>
          <p className="text-sm text-center text-[#6B7280] mb-8">{subheading}</p>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-[#111827] mb-2">Email Address</label>
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-[#E5E7EB] bg-white focus-within:border-[#FF6B00] focus-within:ring-1 focus-within:ring-[#FF6B00] transition-all">
                <Mail className="w-5 h-5 text-[#6B7280] shrink-0" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-transparent text-sm outline-none placeholder:text-[#9CA3AF] text-[#111827]"
                />
              </div>
            </div>

            {view !== 'forgot' && (
              <div>
                <label className="block text-sm font-medium text-[#111827] mb-2">Password</label>
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-[#E5E7EB] bg-white focus-within:border-[#FF6B00] focus-within:ring-1 focus-within:ring-[#FF6B00] transition-all">
                  <Lock className="w-5 h-5 text-[#6B7280] shrink-0" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder={view === 'register' ? 'Min 6 characters' : 'Enter your password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="flex-1 bg-transparent text-sm outline-none placeholder:text-[#9CA3AF] text-[#111827]"
                  />
                  <button onClick={() => setShowPassword(!showPassword)} className="shrink-0" aria-label="Toggle password">
                    {showPassword ? <EyeOff className="w-5 h-5 text-[#6B7280]" /> : <Eye className="w-5 h-5 text-[#6B7280]" />}
                  </button>
                </div>
              </div>
            )}

            {view === 'login' && (
              <div className="flex justify-end">
                <button onClick={() => setView('forgot')} className="text-sm text-[#FF6B00] font-medium hover:text-[#E05A00] transition-colors">
                  Forgot Password?
                </button>
              </div>
            )}

            <button
              onClick={view === 'login' ? onLogin : view === 'register' ? onRegister : onForgot}
              disabled={authLoading || googleLoading}
              className="w-full flex items-center justify-center gap-2 bg-[#FF6B00] text-white font-semibold py-3.5 rounded-full hover:bg-[#E05A00] hover:-translate-y-0.5 transition-all disabled:opacity-60 shadow-lg shadow-[#FF6B00]/25"
            >
              {authLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
              <span>{ctaText}</span>
              {!authLoading && (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              )}
            </button>

            {view !== 'forgot' && (
              <>
                <div className="flex items-center gap-4">
                  <div className="flex-1 h-px bg-[#E5E7EB]" />
                  <span className="text-xs text-[#6B7280] uppercase tracking-wide">or</span>
                  <div className="flex-1 h-px bg-[#E5E7EB]" />
                </div>
                <button
                  onClick={onGoogle}
                  disabled={authLoading || googleLoading}
                  className="w-full flex items-center justify-center gap-2 bg-white border border-[#E5E7EB] text-[#111827] font-medium py-3.5 rounded-xl hover:bg-[#F9FAFB] transition-colors disabled:opacity-60"
                >
                  <GoogleIcon className="w-5 h-5" />
                  {googleText}
                </button>
              </>
            )}
          </div>

          <div className="text-center mt-8">
            {view === 'login' ? (
              <p className="text-sm text-[#6B7280]">
                Don&apos;t have an account?{' '}
                <button onClick={() => setView('register')} className="text-[#FF6B00] font-semibold hover:text-[#E05A00] transition-colors">
                  Register
                </button>
              </p>
            ) : view === 'register' ? (
              <p className="text-sm text-[#6B7280]">
                Already have an account?{' '}
                <button onClick={() => setView('login')} className="text-[#FF6B00] font-semibold hover:text-[#E05A00] transition-colors">
                  Login
                </button>
              </p>
            ) : (
              <p className="text-sm text-[#6B7280]">
                Remember your password?{' '}
                <button onClick={() => setView('login')} className="text-[#FF6B00] font-semibold hover:text-[#E05A00] transition-colors">
                  Login
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const AuthPage: React.FC<AuthPageProps> = (props) => (
  <>
    <MobileAuth {...props} />
    <DesktopAuth {...props} />
  </>
);

export { MobileAuth, DesktopAuth };
export default AuthPage;
