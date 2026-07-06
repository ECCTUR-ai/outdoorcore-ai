import React, { useState, useEffect } from 'react';
import { useAuth } from '@/auth/useAuth';
import { Sparkles, Mail, Lock, AlertCircle, CheckCircle2, ChevronRight, HelpCircle } from 'lucide-react';
import { Button } from '@/components/design-system/Button';
import { rememberMe } from '@/auth/rememberMe';

export function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Forgot password state
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotMessage, setForgotMessage] = useState<string | null>(null);

  // Load remember me credentials
  useEffect(() => {
    const creds = rememberMe.getCredentials();
    if (creds) {
      setEmail(creds.email);
      setRemember(true);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Lütfen e-posta ve şifrenizi girin.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await login(email, password, remember);
      setSuccess('Giriş başarılı! Yönlendiriliyorsunuz...');
    } catch (err: any) {
      setError(err.message || 'Giriş yapılamadı. Şifrenizi veya bağlantınızı kontrol edin.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) {
      setError('Lütfen e-posta adresinizi girin.');
      return;
    }

    setForgotLoading(true);
    setForgotMessage(null);

    try {
      // Direct call mock/supabase reset
      console.log('Reset triggered for:', forgotEmail);
      // Wait mock timeout
      await new Promise(r => setTimeout(r, 1000));
      setForgotMessage('Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.');
    } catch (err: any) {
      setError(err.message || 'Şifre sıfırlama işlemi başarısız oldu.');
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#08111f] flex flex-col md:flex-row text-slate-200 select-none overflow-hidden relative">
      
      {/* Background glowing effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-900/10 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-900/10 blur-[150px] pointer-events-none" />

      {/* Left side: Premium branding & features showcase */}
      <div className="flex-1 bg-slate-950/40 border-r border-white/5 p-8 md:p-16 flex flex-col justify-between relative z-10">
        
        {/* Brand Header */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 font-black tracking-tighter text-sm">
            OC
          </div>
          <div className="text-left leading-none">
            <span className="text-sm font-black text-white tracking-widest block">OUTDOORCORE AI</span>
            <span className="text-[8px] text-slate-500 font-bold uppercase tracking-wider mt-0.5 block">Enterprise Platform</span>
          </div>
        </div>

        {/* Feature listings */}
        <div className="max-w-md text-left space-y-8 my-auto pt-12 md:pt-0">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <Sparkles size={11} className="animate-pulse" />
              <span className="text-[8px] font-black uppercase tracking-wider">Production Sprint v2.1</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white leading-tight uppercase tracking-wider">
              Açıkhava Reklam Envanterinizi Yapay Zeka ile Yönetin.
            </h1>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest leading-relaxed">
              Rezervasyon, CRM, Sözleşme, Finans ve AI Copilot süreçlerinin tamamını tek bir güvenli SaaS altyapısında birleştirin.
            </p>
          </div>

          <div className="space-y-4">
            {[
              { title: 'Çoklu Şirket (Multi-Tenant) Desteği', desc: 'Organizasyon bazlı izole veri güvenliği ve RLS politikaları.' },
              { title: 'Yapay Zeka Destekli Copilot', desc: 'Doğal dil sorguları ile anında envanter durumu ve finansal raporlama.' },
              { title: 'SLA & Saha Bakım Takip Sistemi', desc: 'Canlı teknik arıza kayıtları, SLA durum göstergeleri ve teknik koordinasyon.' }
            ].map((feat, idx) => (
              <div key={idx} className="flex gap-3">
                <div className="w-5 h-5 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 text-[10px] font-black shrink-0 mt-0.5">
                  {idx + 1}
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] font-black text-white uppercase tracking-wider block">{feat.title}</span>
                  <p className="text-[9px] text-slate-500 leading-normal">{feat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer info */}
        <div className="flex justify-between items-center text-[8px] text-slate-650 font-black uppercase tracking-widest pt-8 md:pt-0">
          <span>Release v2.0.2</span>
          <span>© 2026 OutdoorCore AI</span>
        </div>
      </div>

      {/* Right side: Login form */}
      <div className="w-full md:w-[500px] p-8 md:p-16 flex flex-col justify-center relative z-10 bg-slate-950/20">
        <div className="max-w-sm w-full mx-auto space-y-6 text-left">
          
          <div className="space-y-2">
            <h2 className="text-xl font-black text-white uppercase tracking-wider">Hesabınıza Giriş Yapın</h2>
            <p className="text-[9px] text-slate-500 uppercase tracking-widest">
              Lütfen kullanıcı bilgilerinizi veya demo modunu kullanarak giriş yapın.
            </p>
          </div>

          {/* Alert messages */}
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-[9.5px] text-rose-400 font-semibold flex items-start gap-2.5">
              <AlertCircle size={14} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[9.5px] text-emerald-450 font-semibold flex items-start gap-2.5">
              <CheckCircle2 size={14} className="shrink-0 mt-0.5" />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            
            {/* Email input */}
            <div className="space-y-1.5">
              <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest block">E-Posta Adresi</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 h-3.5 w-3.5 text-slate-500" />
                <input
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#08111f]/60 border border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-[10px] font-semibold text-white placeholder-slate-600 focus:outline-none focus:border-slate-700"
                />
              </div>
            </div>

            {/* Password input */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest block">Şifre</label>
                <button
                  type="button"
                  onClick={() => setForgotOpen(true)}
                  className="text-[8.5px] text-blue-400 hover:text-blue-300 font-black uppercase tracking-wider cursor-pointer"
                >
                  Şifremi Unuttum?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 h-3.5 w-3.5 text-slate-500" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#08111f]/60 border border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-[10px] font-semibold text-white placeholder-slate-600 focus:outline-none focus:border-slate-700"
                />
              </div>
            </div>

            {/* Remember Me checkbox */}
            <div className="flex items-center gap-2 select-none py-1">
              <input
                type="checkbox"
                id="remember"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="w-3.5 h-3.5 rounded border-white/5 bg-[#08111f] accent-blue-500 focus:ring-0 focus:outline-none cursor-pointer"
              />
              <label htmlFor="remember" className="text-[9px] font-black text-slate-400 uppercase tracking-wider cursor-pointer">
                Beni Hatırla
              </label>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              className="w-full justify-center text-center py-2.5 text-[10px] font-black uppercase tracking-widest mt-2"
              disabled={loading}
            >
              {loading ? 'Bağlantı Kuruluyor...' : 'Giriş Yap'}
            </Button>
          </form>

          {/* Social login placeholders */}
          <div className="space-y-3 pt-4 border-t border-white/5">
            <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest block text-center">Kurumsal Giriş Kanalları</span>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => alert('Google Single Sign-On entegrasyonu placeholder aşamasındadır.')}
                className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-white/3 border border-white/5 hover:border-slate-700 text-slate-400 hover:text-white transition-all text-[8.5px] font-black uppercase cursor-pointer"
              >
                Google SSO
              </button>
              <button
                onClick={() => alert('Microsoft Entra ID (Azure AD) entegrasyonu placeholder aşamasındadır.')}
                className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-white/3 border border-white/5 hover:border-slate-700 text-slate-400 hover:text-white transition-all text-[8.5px] font-black uppercase cursor-pointer"
              >
                Microsoft SSO
              </button>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-indigo-950/20 border border-indigo-500/10 text-left select-none text-[9.5px]">
            <span className="text-indigo-400 font-extrabold block mb-1">💡 Demo Modu Aktif</span>
            <p className="text-slate-450 leading-relaxed font-semibold">
              Kullanıcı adı: <strong className="text-slate-300">demo@outdoorcore.ai</strong><br />
              Şifre: Herhangi bir değer girerek CEO yetkisiyle sistemi test edebilirsiniz.
            </p>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal Overlay */}
      {forgotOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="dark-glass-card border border-white/10 rounded-2xl max-w-sm w-full p-6 space-y-4 text-left relative">
            <div className="space-y-1.5">
              <h3 className="text-sm font-black text-white uppercase tracking-wider">Şifremi Unuttum</h3>
              <p className="text-[9px] text-slate-500 uppercase tracking-widest leading-relaxed">
                E-posta adresinizi girerek şifre sıfırlama yönergelerini içeren e-posta isteyebilirsiniz.
              </p>
            </div>

            {forgotMessage && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[9px] text-emerald-450 font-bold">
                {forgotMessage}
              </div>
            )}

            <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest block">E-Posta Adresi</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
                  <input
                    type="email"
                    placeholder="name@company.com"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="w-full bg-[#08111f]/60 border border-white/5 rounded-xl pl-9 pr-4 py-2 text-[10px] font-semibold text-white placeholder-slate-600 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setForgotOpen(false);
                    setForgotMessage(null);
                    setForgotEmail('');
                  }}
                >
                  Kapat
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  disabled={forgotLoading}
                >
                  {forgotLoading ? 'Gönderiliyor...' : 'Bağlantı Gönder'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
export default Login;
