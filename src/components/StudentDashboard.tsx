import React from 'react';
import { Trophy, Flame, Award, BookOpen, ArrowLeft, Star, CheckCircle2, Clock, LogIn, User as UserIcon } from 'lucide-react';
import { User, Course, LeaderboardUser, Badge, Certificate } from '../types';

interface StudentDashboardProps {
  currentUser: User | null;
  courses: Course[];
  leaderboard: LeaderboardUser[];
  badges: Badge[];
  certificates: Certificate[];
  onSelectCourse: (course: Course) => void;
  onViewCertificate: (cert: Certificate) => void;
  onOpenAuth?: () => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  currentUser,
  courses,
  leaderboard,
  badges,
  certificates,
  onSelectCourse,
  onViewCertificate,
  onOpenAuth,
}) => {
  const activeCourses = courses.slice(0, 2);

  if (!currentUser) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-20 text-center space-y-6">
        <div className="w-20 h-20 bg-[#0EA5E9]/10 text-[#0EA5E9] rounded-3xl mx-auto flex items-center justify-center shadow-inner">
          <Trophy className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black text-[#0F172A] dark:text-white">لوحة تحكم الطالب</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
          يرجى تسجيل الدخول للوصول إلى متابعة تقدمك، جمع نقاط الخبرة XP، وعرض شهاداتك المعتمدة.
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

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-10">
      
      {/* Welcome Banner */}
      <div className="bg-[#0F172A] text-white p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute -left-10 -bottom-10 w-60 h-60 bg-[#0EA5E9]/20 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="flex items-center gap-6 relative z-10">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-20 h-20 rounded-2xl object-cover border-4 border-[#0EA5E9]"
          />
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-3 py-0.5 rounded-full bg-[#0EA5E9]/20 text-[#0EA5E9] text-xs font-bold border border-[#0EA5E9]/30">
                مستوى {currentUser.level}
              </span>
              <span className="text-xs text-slate-400">طالب متميز</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black">أهلاً بك، {currentUser.name}! 👋</h1>
            <p className="text-xs text-slate-400 mt-1">أنت على بُعد خطوات قليلة من تحقيق هدفك الأسبوعي. واصل التقدم!</p>
          </div>
        </div>

        {/* Gamification Stats Strip */}
        <div className="flex items-center gap-4 relative z-10 w-full md:w-auto justify-around md:justify-end">
          <div className="bg-slate-800/80 backdrop-blur-md px-5 py-3.5 rounded-2xl border border-slate-700 text-center">
            <div className="flex items-center justify-center gap-1.5 text-amber-400 mb-1">
              <Flame className="w-5 h-5 fill-amber-400" />
              <span className="text-lg font-black">{currentUser.streak}</span>
            </div>
            <span className="text-[11px] text-slate-400 font-medium">أيام متتالية</span>
          </div>

          <div className="bg-slate-800/80 backdrop-blur-md px-5 py-3.5 rounded-2xl border border-slate-700 text-center">
            <div className="flex items-center justify-center gap-1.5 text-[#0EA5E9] mb-1">
              <Trophy className="w-5 h-5" />
              <span className="text-lg font-black">{currentUser.xp}</span>
            </div>
            <span className="text-[11px] text-slate-400 font-medium">نقطة XP</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-10">
          
          {/* Active Courses */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#0F172A] dark:text-white">دوراتك الجارية</h2>
              <span className="text-xs font-semibold text-[#0EA5E9]">2 دورات نشطة</span>
            </div>

            <div className="space-y-4">
              {activeCourses.map((course, idx) => (
                <div
                  key={course.id}
                  onClick={() => onSelectCourse(course)}
                  className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col sm:flex-row items-center gap-6 group"
                >
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full sm:w-36 h-24 rounded-xl object-cover"
                  />
                  
                  <div className="flex-1 space-y-2 text-right w-full">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-[#0EA5E9]">
                        {idx === 0 ? 'متبقي 4 دروس' : 'أوشكت على الإنهاء'}
                      </span>
                      <span className="text-xs font-semibold text-slate-500">{idx === 0 ? '45%' : '80%'}</span>
                    </div>
                    
                    <h3 className="text-base font-bold text-[#0F172A] dark:text-white group-hover:text-[#0EA5E9] transition-colors">
                      {course.title}
                    </h3>

                    {/* Progress Bar */}
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-[#0EA5E9] h-full rounded-full transition-all duration-500"
                        style={{ width: idx === 0 ? '45%' : '80%' }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Certificates Earned */}
          <section className="space-y-6">
            <h2 className="text-xl font-bold text-[#0F172A] dark:text-white">الشهادات والإنجازات المكتسبة</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {certificates.map((cert) => (
                <div
                  key={cert.id}
                  onClick={() => onViewCertificate(cert)}
                  className="bg-gradient-to-br from-white dark:from-slate-900 to-[#E6ECF3]/30 dark:to-slate-800/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all cursor-pointer space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold">
                      🏆
                    </div>
                    <span className="text-xs text-slate-400 font-mono">{cert.credentialId}</span>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-[#0F172A] dark:text-white line-clamp-1">{cert.courseTitle}</h4>
                    <p className="text-xs text-slate-500 mt-1">تاريخ الإصدار: {cert.issueDate}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-[#0EA5E9]">
                    <span>عرض وتحميل الشهادة</span>
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>

        {/* Sidebar Area */}
        <div className="space-y-8">
          
          {/* Leaderboard Preview */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[#0F172A] dark:text-white flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500" />
                <span>لوحة المتصدرين</span>
              </h3>
              <span className="text-xs text-slate-400 font-medium">هذا الأسبوع</span>
            </div>

            <div className="space-y-3">
              {leaderboard.slice(0, 5).map((user) => (
                <div
                  key={user.id}
                  className={`flex items-center justify-between p-3 rounded-xl transition-colors ${
                    user.id === '2' ? 'bg-[#0EA5E9]/10 border border-[#0EA5E9]/30' : 'bg-slate-50 dark:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      user.rank === 1 ? 'bg-amber-400 text-slate-950' : user.rank === 2 ? 'bg-slate-300 text-slate-950' : user.rank === 3 ? 'bg-amber-700 text-white' : 'text-slate-500'
                    }`}>
                      {user.rank}
                    </span>
                    <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
                    <div>
                      <span className="block text-xs font-bold text-[#0F172A] dark:text-white">{user.name}</span>
                      <span className="text-[10px] text-slate-400">مستوى {user.level}</span>
                    </div>
                  </div>

                  <span className="text-xs font-black text-[#0EA5E9]">{user.xp} XP</span>
                </div>
              ))}
            </div>
          </div>

          {/* Badges Unlocked */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <h3 className="text-base font-bold text-[#0F172A] dark:text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-[#0EA5E9]" />
              <span>شارات الإنجاز</span>
            </h3>

            <div className="grid grid-cols-3 gap-3">
              {badges.map((badge) => (
                <div
                  key={badge.id}
                  className={`p-3 rounded-2xl border text-center flex flex-col items-center justify-center gap-2 transition-all ${
                    badge.unlocked 
                      ? 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm' 
                      : 'opacity-40 bg-slate-100 dark:bg-slate-900 border-dashed border-slate-300'
                  }`}
                  title={badge.description}
                >
                  <span className="text-2xl">{badge.icon}</span>
                  <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 line-clamp-1">{badge.title}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
