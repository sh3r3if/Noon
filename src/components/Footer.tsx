import React from 'react';
import { BookOpen, Heart, Mail, Phone, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0F172A] text-white pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0EA5E9] flex items-center justify-center text-white">
              <BookOpen className="w-6 h-6" />
            </div>
            <span className="text-xl font-bold tracking-tight">منصة نون التعليمية</span>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed">
            منصة تعليمية عربية رائدة تهدف إلى تمكين المتعلمين والمعلمين من الوصول إلى محتوى أكاديمي ومهني عالي الجودة مع أدوات تفاعلية متقدمة.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-4">روابط سريعة</h4>
          <ul className="space-y-2.5 text-sm text-slate-400">
            <li><a href="#" className="hover:text-[#0EA5E9] transition-colors">الرئيسية</a></li>
            <li><a href="#" className="hover:text-[#0EA5E9] transition-colors">استعراض الدورات</a></li>
            <li><a href="#" className="hover:text-[#0EA5E9] transition-colors">لوحة المتصدرين</a></li>
            <li><a href="#" className="hover:text-[#0EA5E9] transition-colors">انضم كمعلم</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-4">التخصصات</h4>
          <ul className="space-y-2.5 text-sm text-slate-400">
            <li><a href="#" className="hover:text-[#0EA5E9] transition-colors">البرمجة وتطوير الويب</a></li>
            <li><a href="#" className="hover:text-[#0EA5E9] transition-colors">تصميم واجهات المستخدم UI/UX</a></li>
            <li><a href="#" className="hover:text-[#0EA5E9] transition-colors">الذكاء الاصطناعي وعلوم البيانات</a></li>
            <li><a href="#" className="hover:text-[#0EA5E9] transition-colors">اللغات الأجنبية</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-4">تواصل معنا</h4>
          <ul className="space-y-3 text-sm text-slate-400">
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#0EA5E9]" />
              <span>support@noon.edu</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#0EA5E9]" />
              <span>+966 11 234 5678</span>
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#0EA5E9]" />
              <span>الرياض، المملكة العربية السعودية</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
        <p>© 2026 منصة نون التعليمية. جميع الحقوق محفوظة.</p>
        <p className="flex items-center gap-1 mt-4 sm:mt-0">
          صُمم بشغف لتعزيز التعليم العربي <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
        </p>
      </div>
    </footer>
  );
};
