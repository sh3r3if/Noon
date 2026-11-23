import React, { useState } from 'react';
import { BookOpen, User, Sun, Moon, Globe, LogOut, LogIn, Shield, Award, Sparkles, Menu, X } from 'lucide-react';
import { User as UserType } from '../types';
import { translations } from '../data/mockData';

interface NavbarProps {
  currentUser: UserType | null;
  onSelectRole: (role: UserType['role']) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  lang: 'ar' | 'en';
  setLang: (lang: 'ar' | 'en') => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  onOpenAuth: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onSelectRole,
  activeTab,
  setActiveTab,
  lang,
  setLang,
  darkMode,
  setDarkMode,
  onOpenAuth,
  onLogout,
}) => {
  const t = translations[lang];
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between gap-8">
        
        {/* Zone 1: Brand Wordmark */}
        <div 
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-3 cursor-pointer shrink-0"
        >
          <div className="w-10 h-10 rounded-xl bg-[#0EA5E9] flex items-center justify-center text-white shadow-md shadow-[#0EA5E9]/30">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-[#0F172A] dark:text-white whitespace-nowrap">
              {t.brand}
            </span>
            <span className="block text-[10px] text-[#37476C] dark:text-slate-400 font-medium">
              EdTech Platform
            </span>
          </div>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
          <button
            onClick={() => setActiveTab('home')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-[#0EA5E9] ${
              activeTab === 'home' ? 'text-[#0EA5E9] font-semibold' : ''
            }`}
          >
            {t.home}
          </button>
          <button
            onClick={() => setActiveTab('catalog')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-[#0EA5E9] ${
              activeTab === 'catalog' ? 'text-[#0EA5E9] font-semibold' : ''
            }`}
          >
            {t.catalog}
          </button>
          <button
            onClick={() => setActiveTab('records')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-[#0EA5E9] ${
              activeTab === 'records' ? 'text-[#0EA5E9] font-semibold' : ''
            }`}
          >
            {t.studentRecords}
          </button>
          <button
            onClick={() => {
              if (currentUser) {
                setActiveTab('dashboard');
              } else {
                onOpenAuth();
              }
            }}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-[#0EA5E9] ${
              activeTab === 'dashboard' ? 'text-[#0EA5E9] font-semibold' : ''
            }`}
          >
            {t.dashboard}
          </button>
          {currentUser && currentUser.role === 'teacher' && (
            <button
              onClick={() => setActiveTab('teacher')}
              className={`transition-colors whitespace-nowrap shrink-0 hover:text-[#0EA5E9] ${
                activeTab === 'teacher' ? 'text-[#0EA5E9] font-semibold' : ''
              }`}
            >
              {t.teacherStudio}
            </button>
          )}
          {currentUser && currentUser.role === 'admin' && (
            <button
              onClick={() => setActiveTab('admin')}
              className={`transition-colors whitespace-nowrap shrink-0 hover:text-[#0EA5E9] ${
                activeTab === 'admin' ? 'text-[#0EA5E9] font-semibold' : ''
              }`}
            >
              {t.adminPanel}
            </button>
          )}
        </nav>

        {/* Zone 3: Primary Action & Controls */}
        <div className="flex items-center gap-4 shrink-0">
          
          {/* Language Toggle */}
          <button
            onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors flex items-center gap-1.5 text-xs font-semibold"
            title="تغيير اللغة / Change Language"
          >
            <Globe className="w-4 h-4 text-[#0EA5E9]" />
            <span>{lang === 'ar' ? 'EN' : 'عربي'}</span>
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
            title="الوضع المظلم"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-[#37476C]" />}
          </button>

          {/* Role Switcher Menu (when logged in) */}
          {currentUser && (
            <div className="relative">
              <button
                onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200 hover:border-[#0EA5E9] transition-all"
              >
                <Shield className="w-3.5 h-3.5 text-[#0EA5E9]" />
                <span>
                  {currentUser.role === 'student' ? 'طالب' : currentUser.role === 'teacher' ? 'معلم' : 'مدير'}
                </span>
              </button>

              {roleMenuOpen && (
                <div className="absolute left-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-2 z-50">
                  <div className="px-3 py-1 text-[11px] text-slate-400 font-semibold uppercase">تغيير دور المستخدم</div>
                  <button
                    onClick={() => { onSelectRole('student'); setRoleMenuOpen(false); }}
                    className="w-full text-right px-4 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-between"
                  >
                    <span>طالب (Student)</span>
                    {currentUser.role === 'student' && <span className="w-2 h-2 rounded-full bg-[#0EA5E9]"></span>}
                  </button>
                  <button
                    onClick={() => { onSelectRole('teacher'); setRoleMenuOpen(false); }}
                    className="w-full text-right px-4 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-between"
                  >
                    <span>معلم (Teacher)</span>
                    {currentUser.role === 'teacher' && <span className="w-2 h-2 rounded-full bg-[#0EA5E9]"></span>}
                  </button>
                  <button
                    onClick={() => { onSelectRole('admin'); setRoleMenuOpen(false); }}
                    className="w-full text-right px-4 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-between"
                  >
                    <span>مدير النظام (Admin)</span>
                    {currentUser.role === 'admin' && <span className="w-2 h-2 rounded-full bg-[#0EA5E9]"></span>}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* User Profile / Login / Logout Area */}
          <div className="flex items-center gap-3">
            {currentUser ? (
              <button
                onClick={() => setActiveTab('profile')}
                className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="عرض الملف الشخصي"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-9 h-9 rounded-full object-cover border-2 border-[#0EA5E9]"
                />
                <div className="hidden xl:block text-right">
                  <span className="block text-xs font-bold text-slate-900 dark:text-white leading-none">
                    {currentUser.name}
                  </span>
                  <span className="block text-[10px] text-[#0EA5E9] font-medium mt-1">
                    {currentUser.xp} XP · مستوى {currentUser.level}
                  </span>
                </div>
              </button>
            ) : null}

            {/* زر تسجيل الخروج / الدخول: لو مسجل خروج يشغل تسجيل الدخول ولو مسجل دخول يسجل خروج */}
            <button
              onClick={currentUser ? onLogout : onOpenAuth}
              className={`inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl transition-all shadow-md whitespace-nowrap shrink-0 ${
                currentUser
                  ? 'bg-red-500 hover:bg-red-600 text-white shadow-red-500/20'
                  : 'bg-[#0EA5E9] hover:bg-[#0284C7] text-white shadow-[#0EA5E9]/25'
              }`}
              title={currentUser ? 'تسجيل الخروج من الحساب' : 'تسجيل الدخول إلى الحساب'}
            >
              {currentUser ? <LogOut className="w-3.5 h-3.5" /> : <LogIn className="w-3.5 h-3.5" />}
              <span>{currentUser ? t.logout : t.login}</span>
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-700 dark:text-slate-200"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>

      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-4 space-y-3">
          <button
            onClick={() => { setActiveTab('home'); setMobileMenuOpen(false); }}
            className="block w-full text-right py-2 text-sm font-medium text-slate-700 dark:text-slate-200"
          >
            {t.home}
          </button>
          <button
            onClick={() => { setActiveTab('catalog'); setMobileMenuOpen(false); }}
            className="block w-full text-right py-2 text-sm font-medium text-slate-700 dark:text-slate-200"
          >
            {t.catalog}
          </button>
          <button
            onClick={() => { setActiveTab('records'); setMobileMenuOpen(false); }}
            className="block w-full text-right py-2 text-sm font-medium text-slate-700 dark:text-slate-200"
          >
            {t.studentRecords}
          </button>
          <button
            onClick={() => {
              if (currentUser) {
                setActiveTab('dashboard');
              } else {
                onOpenAuth();
              }
              setMobileMenuOpen(false);
            }}
            className="block w-full text-right py-2 text-sm font-medium text-slate-700 dark:text-slate-200"
          >
            {t.dashboard}
          </button>
          {currentUser && currentUser.role === 'teacher' && (
            <button
              onClick={() => { setActiveTab('teacher'); setMobileMenuOpen(false); }}
              className="block w-full text-right py-2 text-sm font-medium text-slate-700 dark:text-slate-200"
            >
              {t.teacherStudio}
            </button>
          )}
          {currentUser && currentUser.role === 'admin' && (
            <button
              onClick={() => { setActiveTab('admin'); setMobileMenuOpen(false); }}
              className="block w-full text-right py-2 text-sm font-medium text-slate-700 dark:text-slate-200"
            >
              {t.adminPanel}
            </button>
          )}
          {currentUser && (
            <button
              onClick={() => { setActiveTab('profile'); setMobileMenuOpen(false); }}
              className="block w-full text-right py-2 text-sm font-medium text-slate-700 dark:text-slate-200"
            >
              {t.profile}
            </button>
          )}

          {/* Mobile Login / Logout Toggle Button */}
          <button
            onClick={() => {
              if (currentUser) {
                onLogout();
              } else {
                onOpenAuth();
              }
              setMobileMenuOpen(false);
            }}
            className={`w-full text-right py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-between transition-all ${
              currentUser
                ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20'
                : 'bg-[#0EA5E9] text-white hover:bg-[#0284C7]'
            }`}
          >
            <span>{currentUser ? t.logout : t.login}</span>
            {currentUser ? <LogOut className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
          </button>
        </div>
      )}
    </header>
  );
};
