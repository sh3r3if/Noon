import React from 'react';
import { Sparkles, ArrowLeft, Star, Users, BookOpen, Award, CheckCircle2, Play, ShieldCheck, Trophy } from 'lucide-react';
import { Course } from '../types';

interface LandingPageProps {
  courses: Course[];
  onSelectCourse: (course: Course) => void;
  onExplore: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ courses, onSelectCourse, onExplore }) => {
  return (
    <div className="space-y-20 pb-20">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-24 bg-gradient-to-b from-white dark:from-slate-900 to-[#E6ECF3] dark:to-slate-950 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-7 space-y-6 text-right">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0EA5E9]/10 text-[#0EA5E9] text-xs font-bold border border-[#0EA5E9]/20">
              <Sparkles className="w-4 h-4" />
              <span>المنصة التعليمية الأذكى والأكثر تفاعلاً في العالم العربي</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#0F172A] dark:text-white leading-tight tracking-tight">
              طور مهاراتك المستقبلية مع <span className="text-[#0EA5E9]">أبرز الخبراء</span>
            </h1>
            
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
              اكتشف مئات الدورات التفاعلية في البرمجة، التصميم، الذكاء الاصطناعي، وإدارة الأعمال. تعلم عبر الدروس المرئية، البطاقات التعليمية، والاختبارات الفورية.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <button
                onClick={onExplore}
                className="px-8 py-4 bg-[#0EA5E9] text-white font-bold text-sm rounded-2xl hover:bg-[#0284C7] shadow-xl shadow-[#0EA5E9]/30 transition-all flex items-center gap-2"
              >
                <span>ابدأ التعلم الآن</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
              
              <button
                onClick={onExplore}
                className="px-8 py-4 bg-white dark:bg-slate-800 text-slate-700 dark:text-white font-bold text-sm rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-[#0EA5E9] transition-all flex items-center gap-2"
              >
                <Play className="w-4 h-4 text-[#0EA5E9]" />
                <span>استعراض الكتالوج</span>
              </button>
            </div>

            {/* Quick Stats Strip */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-slate-200 dark:border-slate-800 mt-8">
              <div>
                <span className="block text-2xl sm:text-3xl font-black text-[#0F172A] dark:text-white">+25,000</span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">طالب نشط</span>
              </div>
              <div>
                <span className="block text-2xl sm:text-3xl font-black text-[#0F172A] dark:text-white">+120</span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">دورة احترافية</span>
              </div>
              <div>
                <span className="block text-2xl sm:text-3xl font-black text-[#0F172A] dark:text-white">98%</span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">نسبة النجاح</span>
              </div>
            </div>

          </div>

          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div className="absolute -inset-1.5 bg-gradient-to-r from-[#0EA5E9] to-[#37476C] rounded-3xl blur-xl opacity-30 animate-pulse"></div>
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=80"
                alt="Students learning"
                className="relative rounded-2xl shadow-2xl object-cover w-full h-[420px] border border-white/20"
              />
              
              {/* Floating Badge Card */}
              <div className="absolute -bottom-6 -right-6 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold">
                  <Trophy className="w-6 h-6" />
                </div>
                <div>
                  <span className="block text-xs font-bold text-slate-900 dark:text-white">شهادة معتمدة</span>
                  <span className="text-[11px] text-slate-500">قابلة للتحميل الفوري</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#0EA5E9]">الدورات الأكثر طلباً</span>
            <h2 className="text-3xl font-black text-[#0F172A] dark:text-white mt-1">ابدأ التعلم في أحدث التخصصات</h2>
          </div>
          <button
            onClick={onExplore}
            className="mt-4 md:mt-0 text-sm font-bold text-[#0EA5E9] hover:underline flex items-center gap-1"
          >
            <span>عرض كل الدورات</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.slice(0, 3).map((course) => (
            <div
              key={course.id}
              onClick={() => onSelectCourse(course)}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col group"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 bg-white/90 dark:bg-slate-900/95 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-[#0F172A] dark:text-white shadow">
                  {course.category === 'programming' ? 'البرمجة' : course.category === 'design' ? 'التصميم' : 'الذكاء الاصطناعي'}
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-2">
                    <span className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <strong className="text-slate-900 dark:text-white">{course.rating}</strong> ({course.reviewsCount})
                    </span>
                    <span>·</span>
                    <span>{course.durationHours} ساعة</span>
                  </div>

                  <h3 className="text-lg font-bold text-[#0F172A] dark:text-white group-hover:text-[#0EA5E9] transition-colors line-clamp-2">
                    {course.title}
                  </h3>
                  
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 line-clamp-2">
                    {course.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={course.instructor.avatar}
                      alt={course.instructor.name}
                      className="w-8 h-8 rounded-full object-cover border border-slate-200"
                    />
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      {course.instructor.name}
                    </span>
                  </div>

                  <span className="text-xs font-bold text-[#0EA5E9] group-hover:translate-x-[-4px] transition-transform flex items-center gap-1">
                    <span>انضم للدورة</span>
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Noon Section */}
      <section className="bg-white dark:bg-slate-900 py-20 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0EA5E9]">لماذا منصة نون؟</span>
            <h2 className="text-3xl font-black text-[#0F172A] dark:text-white mt-1">تجربة تعلّم مصممة خصيصاً لتتفوق</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-[#E6ECF3]/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#0EA5E9] text-white flex items-center justify-center font-bold text-lg shadow-md shadow-[#0EA5E9]/30">
                01
              </div>
              <h3 className="text-lg font-bold text-[#0F172A] dark:text-white">تمارين تفاعلية واختبارات فورية</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                لا تكتفِ بالمشاهدة وحدها. تفاعل مع البطاقات التعليمية، تمارين المطابقة، والاختبارات الفورية مع تقييم دقيق لنقاط قوتك.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-[#E6ECF3]/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#0EA5E9] text-white flex items-center justify-center font-bold text-lg shadow-md shadow-[#0EA5E9]/30">
                02
              </div>
              <h3 className="text-lg font-bold text-[#0F172A] dark:text-white">نظام تحفيز Gamification متقدم</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                اكسب نقاط الخبرة (XP)، حافظ على سلسلة الأيام المتتالية (Streak)، واجمع الشارات الفاخرة لتتصدر لوحة المتصدرين.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-[#E6ECF3]/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#0EA5E9] text-white flex items-center justify-center font-bold text-lg shadow-md shadow-[#0EA5E9]/30">
                03
              </div>
              <h3 className="text-lg font-bold text-[#0F172A] dark:text-white">شهادات إتمام معتمدة وقابلة للتحميل</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                عند إتمام أي دورة واجتياز اختباراتها، احصل على شهادة رسمية تحمل اسمك وتوثيق المنصة لمشاركتها في سيرتك الذاتية.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
