import React, { useState } from 'react';
import { User, Certificate } from '../types';
import { Award, Mail, Lock, User as UserIcon, Globe, Moon, Sun, CheckCircle2, LogOut, LogIn } from 'lucide-react';

interface ProfileSettingsProps {
  currentUser: User | null;
  certificates: Certificate[];
  onUpdateUser: (updated: User) => void;
  lang: 'ar' | 'en';
  setLang: (lang: 'ar' | 'en') => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  onViewCertificate: (cert: Certificate) => void;
  onLogout: () => void;
  onOpenAuth?: () => void;
}

export const ProfileSettings: React.FC<ProfileSettingsProps> = ({
  currentUser,
  certificates,
  onUpdateUser,
  lang,
  setLang,
  darkMode,
  setDarkMode,
  onViewCertificate,
  onLogout,
  onOpenAuth,
}) => {
  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [successMsg, setSuccessMsg] = useState(false);

  if (!currentUser) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-20 text-center space-y-6">
        <div className="w-20 h-20 bg-[#0EA5E9]/10 text-[#0EA5E9] rounded-3xl mx-auto flex items-center justify-center">
          <UserIcon className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black text-[#0F172A] dark:text-white">أنت غير مسجل حالياً</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
          يرجى تسجيل الدخول إلى حسابك لتتمكن من تعديل بياناتك الشخصية، إدارة التفضيلات، وعرض شهاداتك المكتسبة.
        </p>
        {onOpenAuth && (
          <button
            onClick={onOpenAuth}
            className="px-6 py-3 bg-[#0EA5E9] hover:bg-[#0284C7] text-white text-xs font-bold rounded-xl shadow-lg shadow-[#0EA5E9]/30 inline-flex items-center gap-2 transition-all cursor-pointer"
          >
            <LogIn className="w-4 h-4" />
            <span>تسجيل الدخول الآن</span>
          </button>
        )}
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({ ...currentUser, name, email });
    setSuccessMsg(true);
    setTimeout(() => setSuccessMsg(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 space-y-10">
      
      {/* Header */}
      <div className="bg-[#0F172A] text-white p-8 rounded-3xl shadow-xl flex items-center gap-6">
        <img src={currentUser.avatar} alt={currentUser.name} className="w-20 h-20 rounded-2xl object-cover border-4 border-[#0EA5E9]" />
        <div>
          <span className="px-3 py-1 bg-[#0EA5E9]/20 text-[#0EA5E9] rounded-full text-xs font-bold border border-[#0EA5E9]/30">
            مستوى {currentUser.level} · {currentUser.xp} XP
          </span>
          <h1 className="text-2xl font-black mt-2">{currentUser.name}</h1>
          <p className="text-slate-400 text-xs mt-0.5">{currentUser.email}</p>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-center font-bold text-xs flex items-center justify-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>تم حفظ التعديلات بنجاح!</span>
        </div>
      )}

      {/* Profile Form */}
      <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <h3 className="text-lg font-bold text-[#0F172A] dark:text-white">تعديل البيانات الشخصية</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">الاسم الكامل</label>
            <div className="relative">
              <UserIcon className="absolute right-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pr-10 pl-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">البريد الإلكتروني</label>
            <div className="relative">
              <Mail className="absolute right-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pr-10 pl-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
              />
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">اللغة:</span>
                <button
                  type="button"
                  onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-bold text-[#0EA5E9]"
                >
                  {lang === 'ar' ? 'العربية' : 'English'}
                </button>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">الوضع المظلم:</span>
                <button
                  type="button"
                  onClick={() => setDarkMode(!darkMode)}
                  className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-amber-400"
                >
                  {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4 text-[#37476C]" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#0EA5E9] text-white text-xs font-bold hover:bg-[#0284C7] shadow-lg shadow-[#0EA5E9]/20"
            >
              حفظ التغييرات
            </button>
          </div>
        </form>
      </div>

      {/* Certificates Earned */}
      <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <h3 className="text-lg font-bold text-[#0F172A] dark:text-white">الشهادات المكتسبة</h3>

        <div className="space-y-4">
          {certificates.map((cert) => (
            <div key={cert.id} onClick={() => onViewCertificate(cert)} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex items-center justify-between cursor-pointer hover:border-[#0EA5E9] transition-all">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold">
                  🏆
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#0F172A] dark:text-white">{cert.courseTitle}</h4>
                  <span className="text-[11px] text-slate-500">تاريخ الإصدار: {cert.issueDate} · رقم المعرف: {cert.credentialId}</span>
                </div>
              </div>

              <span className="text-xs font-bold text-[#0EA5E9]">عرض الشهادة</span>
            </div>
          ))}
        </div>
      </div>

      {/* Logout Section */}
      <div className="bg-red-500/5 dark:bg-red-500/10 p-6 rounded-2xl border border-red-500/20 flex items-center justify-between">
        <div>
          <h4 className="text-sm font-bold text-red-600 dark:text-red-400">تسجيل الخروج من الحساب</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">يمكنك تسجيل الخروج في أي وقت والعودة لاحقاً لاستئناف تعلمك.</p>
        </div>
        <button
          onClick={onLogout}
          className="px-5 py-2.5 rounded-xl bg-red-500 text-white font-bold text-xs hover:bg-red-600 shadow-lg shadow-red-500/30 flex items-center gap-2 transition-all"
        >
          <LogOut className="w-4 h-4" />
          <span>تسجيل الخروج</span>
        </button>
      </div>

    </div>
  );
};
