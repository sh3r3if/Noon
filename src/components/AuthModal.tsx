import React, { useState } from 'react';
import { X, Mail, Lock, User as UserIcon, Shield, Sparkles, LogIn, UserPlus, Crown } from 'lucide-react';
import { User, UserRole } from '../types';
import { mockUsers, ownerAdminUser } from '../data/mockData';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleQuickLogin = (demoUser: User) => {
    localStorage.removeItem('noon_logged_out');
    localStorage.setItem('noon_current_user', JSON.stringify(demoUser));
    onLogin(demoUser);
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (isLogin) {
      const normalizedEmail = email.trim().toLowerCase();

      // التحقق من حساب الأدمن الدائم صاحب المنصة
      if (normalizedEmail === 'sh3r3if@gmail.com' || normalizedEmail === 'sh3r3if55@gmail.com') {
        if (password === 'NewFolder') {
          localStorage.removeItem('noon_logged_out');
          localStorage.setItem('noon_current_user', JSON.stringify(ownerAdminUser));
          onLogin(ownerAdminUser);
          onClose();
          return;
        } else {
          setErrorMsg('كلمة المرور غير صحيحة لحساب صاحب المنصة!');
          return;
        }
      }

      // حسابات النظام الأخرى
      const found = mockUsers.find(u => u.email.toLowerCase() === normalizedEmail);
      if (found) {
        if (found.password && found.password !== password) {
          setErrorMsg('كلمة المرور غير صحيحة!');
          return;
        }
        localStorage.removeItem('noon_logged_out');
        localStorage.setItem('noon_current_user', JSON.stringify(found));
        onLogin(found);
        onClose();
        return;
      }
    }

    const newUser: User = {
      id: 'u-' + Date.now(),
      name: name || (role === 'teacher' ? 'د. خالد العمري' : role === 'admin' ? 'مدير النظام' : 'طالب مجتهد'),
      email: email || 'user@noon.edu',
      role,
      avatar: role === 'teacher' 
        ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      xp: 250,
      streak: 3,
      level: 2,
      completedCourses: []
    };

    localStorage.removeItem('noon_logged_out');
    localStorage.setItem('noon_current_user', JSON.stringify(newUser));
    onLogin(newUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="bg-[#0F172A] text-white p-6 relative">
          <button 
            onClick={onClose}
            className="absolute top-6 left-6 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="w-12 h-12 rounded-2xl bg-[#0EA5E9] flex items-center justify-center text-white mb-4 shadow-lg shadow-[#0EA5E9]/30">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold">
            {isLogin ? 'تسجيل الدخول إلى منصة نون' : 'إنشاء حساب جديد في منصة نون'}
          </h3>
          <p className="text-slate-400 text-xs mt-1">
            {isLogin ? 'سجل دخولك لمتابعة رحلتك التعليمية وحفظ نقاطك' : 'انضم إلينا وابدأ التعلم التفاعلي اليوم'}
          </p>
        </div>

        {/* Quick Demo Accounts Bar */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
          <span className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-2">تسجيل دخول سريع للتجربة (بنقرة واحدة):</span>
          
          {/* زر حساب صاحب المنصة */}
          <button
            type="button"
            onClick={() => {
              setEmail('sh3r3if@gmail.com');
              setPassword('NewFolder');
              handleQuickLogin(ownerAdminUser);
            }}
            className="w-full mb-2.5 p-2.5 rounded-xl bg-amber-500/10 dark:bg-amber-500/20 border border-amber-400 text-right transition-all flex items-center justify-between shadow-sm hover:border-amber-500 group"
          >
            <div className="flex items-center gap-2.5">
              <span className="text-xl">👑</span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-amber-700 dark:text-amber-400">حساب صاحب المنصة (Admin)</span>
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-500/20 text-amber-700 dark:text-amber-300">دائم</span>
                </div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">sh3r3if@gmail.com · كلمة المرور: NewFolder</span>
              </div>
            </div>
            <span className="text-[11px] font-bold text-[#0EA5E9] group-hover:underline">دخول فوري ➔</span>
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin(mockUsers.find(u => u.role === 'student') || mockUsers[1])}
              className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-[#0EA5E9] text-center transition-all shadow-sm"
            >
              <span className="block text-[11px] font-bold text-slate-800 dark:text-white">طالبة 👩‍🎓</span>
              <span className="block text-[9px] text-slate-400">سارة أحمد</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin(mockUsers.find(u => u.role === 'teacher') || mockUsers[2])}
              className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-[#0EA5E9] text-center transition-all shadow-sm"
            >
              <span className="block text-[11px] font-bold text-slate-800 dark:text-white">معلم 👨‍🏫</span>
              <span className="block text-[9px] text-slate-400">أ. محمد شريف</span>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {errorMsg && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-xs rounded-xl font-medium text-center">
              {errorMsg}
            </div>
          )}

          {!isLogin && (
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">الاسم الكامل</label>
              <div className="relative">
                <UserIcon className="absolute right-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="أدخل اسمك الكامل"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pr-10 pl-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-[#0EA5E9]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">البريد الإلكتروني</label>
            <div className="relative">
              <Mail className="absolute right-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type="email"
                required
                placeholder="name@noon.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pr-10 pl-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-[#0EA5E9]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">كلمة المرور</label>
            <div className="relative">
              <Lock className="absolute right-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pr-10 pl-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-[#0EA5E9]"
              />
            </div>
          </div>

          {!isLogin && (
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">نوع الحساب</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('student')}
                  className={`py-2.5 px-4 rounded-xl border text-xs font-bold transition-all ${
                    role === 'student' 
                      ? 'bg-[#0EA5E9] text-white border-[#0EA5E9] shadow-md shadow-[#0EA5E9]/20' 
                      : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800'
                  }`}
                >
                  طالب (Student)
                </button>
                <button
                  type="button"
                  onClick={() => setRole('teacher')}
                  className={`py-2.5 px-4 rounded-xl border text-xs font-bold transition-all ${
                    role === 'teacher' 
                      ? 'bg-[#0EA5E9] text-white border-[#0EA5E9] shadow-md shadow-[#0EA5E9]/20' 
                      : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800'
                  }`}
                >
                  معلم (Teacher)
                </button>
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-[#0EA5E9] text-white font-bold text-xs rounded-xl hover:bg-[#0284C7] shadow-lg shadow-[#0EA5E9]/30 transition-all mt-4 flex items-center justify-center gap-2"
          >
            {isLogin ? <LogIn className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
            <span>{isLogin ? 'تسجيل الدخول' : 'إنشاء الحساب والانضمام'}</span>
          </button>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-xs text-[#0EA5E9] hover:underline font-medium"
            >
              {isLogin ? 'ليس لديك حساب؟ انضم إلينا الآن' : 'لديك حساب بالفعل؟ سجل دخولك'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
