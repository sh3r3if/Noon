import React from 'react';
import { ArrowRight, Star, Clock, Users, BookOpen, CheckCircle2, Play, Award, Shield } from 'lucide-react';
import { Course, Lesson } from '../types';

interface CourseDetailProps {
  course: Course;
  onBack: () => void;
  onStartLesson: (lesson: Lesson) => void;
}

export const CourseDetail: React.FC<CourseDetailProps> = ({ course, onBack, onStartLesson }) => {
  const firstLesson = course.modules[0]?.lessons[0];

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-10">
      
      {/* Back Button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-[#0EA5E9] transition-colors"
      >
        <ArrowRight className="w-4 h-4" />
        <span>العودة إلى الكتالوج</span>
      </button>

      {/* Hero Header */}
      <div className="bg-[#0F172A] text-white p-8 sm:p-12 rounded-3xl shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#0EA5E9]/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="lg:col-span-8 space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0EA5E9]/20 text-[#0EA5E9] text-xs font-bold border border-[#0EA5E9]/30">
            {course.category} · {course.level}
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight">
            {course.title}
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            {course.description}
          </p>

          <div className="flex flex-wrap items-center gap-6 pt-2 text-xs text-slate-300">
            <span className="flex items-center gap-1.5">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <strong className="text-white">{course.rating}</strong> ({course.reviewsCount} تقييم)
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-[#0EA5E9]" />
              {course.enrolledCount} طالب مسجل
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#0EA5E9]" />
              {course.durationHours} ساعة تدريبية
            </span>
          </div>
        </div>

        <div className="lg:col-span-4 relative z-10 flex flex-col items-center justify-center bg-slate-800/80 backdrop-blur-md p-6 rounded-2xl border border-slate-700 shadow-xl space-y-6">
          <img
            src={course.image}
            alt={course.title}
            className="w-full h-40 rounded-xl object-cover border border-slate-600"
          />

          <button
            onClick={() => firstLesson && onStartLesson(firstLesson)}
            className="w-full py-3.5 bg-[#0EA5E9] text-white font-bold text-xs rounded-xl hover:bg-[#0284C7] shadow-lg shadow-[#0EA5E9]/30 transition-all flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>ابدأ الدورة الآن</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Syllabus / Modules */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <h3 className="text-xl font-bold text-[#0F172A] dark:text-white">محاور الدورة والدروس</h3>

            <div className="space-y-6">
              {course.modules.map((module, mIdx) => (
                <div key={module.id} className="space-y-3">
                  <h4 className="text-sm font-bold text-[#0EA5E9] bg-[#0EA5E9]/10 p-3 rounded-xl border border-[#0EA5E9]/20">
                    {module.title}
                  </h4>

                  <div className="space-y-2 pr-4">
                    {module.lessons.map((lesson) => (
                      <div
                        key={lesson.id}
                        onClick={() => onStartLesson(lesson)}
                        className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 hover:border-[#0EA5E9] transition-all cursor-pointer flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                            lesson.completed ? 'bg-emerald-500/10 text-emerald-500' : 'bg-[#0EA5E9]/10 text-[#0EA5E9]'
                          }`}>
                            {lesson.completed ? <CheckCircle2 className="w-4 h-4" /> : <Play className="w-3.5 h-3.5" />}
                          </div>
                          <div>
                            <span className="block text-xs font-bold text-[#0F172A] dark:text-white group-hover:text-[#0EA5E9] transition-colors">
                              {lesson.title}
                            </span>
                            <span className="text-[10px] text-slate-500">{lesson.duration}</span>
                          </div>
                        </div>

                        <span className="text-xs font-bold text-[#0EA5E9] group-hover:translate-x-[-4px] transition-transform">
                          مشاهدة
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Instructor Card */}
        <div className="space-y-8">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 text-center">
            <h3 className="text-base font-bold text-[#0F172A] dark:text-white text-right">مدرب الدورة</h3>

            <div className="flex flex-col items-center space-y-4">
              <img
                src={course.instructor.avatar}
                alt={course.instructor.name}
                className="w-24 h-24 rounded-full object-cover border-4 border-[#0EA5E9]"
              />
              <div>
                <h4 className="text-base font-bold text-[#0F172A] dark:text-white">{course.instructor.name}</h4>
                <p className="text-xs text-slate-500 mt-1">{course.instructor.title}</p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 leading-relaxed text-right">
              خبرة تزيد عن 10 سنوات في تقديم الاستشارات والتدريب التقني المتقدم لأبرز الشركات والمؤسسات الإقليمية.
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
