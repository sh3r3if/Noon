import React, { useState } from 'react';
import { Search, Star, ArrowLeft, BookOpen, Clock, Users, GraduationCap, CheckCircle2, Play } from 'lucide-react';
import { Course, EducationalGrade, Lesson } from '../types';
import { translations } from '../data/mockData';

interface CourseCatalogProps {
  courses: Course[];
  onSelectCourse: (course: Course) => void;
  onStartLesson?: (lesson: Lesson, course: Course) => void;
  lang: 'ar' | 'en';
}

export const CourseCatalog: React.FC<CourseCatalogProps> = ({ courses, onSelectCourse, onStartLesson, lang }) => {
  const t = translations[lang];
  const [selectedGrade, setSelectedGrade] = useState<EducationalGrade | 'all'>('3prep');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCourses = courses.filter((course) => {
    const matchesGrade = selectedGrade === 'all' || course.grade === selectedGrade;
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          course.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesGrade && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-10">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0EA5E9]/10 text-[#0EA5E9] text-xs font-bold border border-[#0EA5E9]/20">
          <GraduationCap className="w-4 h-4" />
          <span>منهج وزارة التربية والتعليم والباشمبرمج أستاذ محمد شريف</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-[#0F172A] dark:text-white">اختر مرحلتك الدراسية وتصفح دروسك</h1>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          نظام عرض الدروس الاحترافي (بنظام Udemy) لكل مرحلة: المرحلة الإعدادية والمرحلة الثانوية.
        </p>
      </div>

      {/* Grade Selector Tabs */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => setSelectedGrade('all')}
            className={`px-5 py-3 rounded-2xl text-xs font-bold transition-all ${
              selectedGrade === 'all'
                ? 'bg-[#0EA5E9] text-white shadow-lg shadow-[#0EA5E9]/30'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            جميع المراحل
          </button>
          
          <button
            onClick={() => setSelectedGrade('1prep')}
            className={`px-5 py-3 rounded-2xl text-xs font-bold transition-all ${
              selectedGrade === '1prep'
                ? 'bg-[#0EA5E9] text-white shadow-lg shadow-[#0EA5E9]/30'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            أولى إعدادي
          </button>

          <button
            onClick={() => setSelectedGrade('2prep')}
            className={`px-5 py-3 rounded-2xl text-xs font-bold transition-all ${
              selectedGrade === '2prep'
                ? 'bg-[#0EA5E9] text-white shadow-lg shadow-[#0EA5E9]/30'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            تانية إعدادي
          </button>

          <button
            onClick={() => setSelectedGrade('3prep')}
            className={`px-5 py-3 rounded-2xl text-xs font-bold transition-all ${
              selectedGrade === '3prep'
                ? 'bg-[#0EA5E9] text-white shadow-lg shadow-[#0EA5E9]/30'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            ثالثة إعدادي (البرمجة والذكاء الاصطناعي)
          </button>

          <button
            onClick={() => setSelectedGrade('1sec')}
            className={`px-5 py-3 rounded-2xl text-xs font-bold transition-all ${
              selectedGrade === '1sec'
                ? 'bg-[#0EA5E9] text-white shadow-lg shadow-[#0EA5E9]/30'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            أولى ثانوي
          </button>

          <button
            onClick={() => setSelectedGrade('2sec')}
            className={`px-5 py-3 rounded-2xl text-xs font-bold transition-all ${
              selectedGrade === '2sec'
                ? 'bg-[#0EA5E9] text-white shadow-lg shadow-[#0EA5E9]/30'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            تانية ثانوي (البرمجة والذكاء الاصطناعي)
          </button>
        </div>

        <div className="relative max-w-xl mx-auto">
          <Search className="absolute right-4 top-3.5 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pr-12 pl-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-[#0EA5E9]"
          />
        </div>
      </div>

      {/* Courses / Curriculum Grid (Udemy Style) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {filteredCourses.map((course) => (
          <div
            key={course.id}
            className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
          >
            <div className="relative h-52 overflow-hidden">
              <img
                src={course.image}
                alt={course.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-4 right-4 bg-[#0F172A]/90 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold text-white shadow">
                {t.grades[course.grade]}
              </div>
            </div>

            <div className="p-8 space-y-6 flex-1 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <strong className="text-slate-900 dark:text-white">{course.rating}</strong> ({course.reviewsCount} تقييم)
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4 text-[#0EA5E9]" />
                    {course.durationHours} ساعة تدريبية
                  </span>
                </div>

                <h3 className="text-xl font-extrabold text-[#0F172A] dark:text-white group-hover:text-[#0EA5E9] transition-colors leading-snug">
                  {course.title}
                </h3>
                
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3">
                  {course.description}
                </p>
              </div>

              {/* Syllabus Summary / Udemy Style modules preview */}
              <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">محتويات المقرر (اضغط على أي درس للفتح الفوري):</span>
                <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                  {course.modules.map((m) => (
                    <div key={m.id} className="space-y-1.5">
                      <span className="text-[11px] font-bold text-[#0EA5E9]">{m.title}</span>
                      <div className="space-y-1 pr-2">
                        {m.lessons.map((lesson) => (
                          <div
                            key={lesson.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (onStartLesson) {
                                onStartLesson(lesson, course);
                              } else {
                                onSelectCourse(course);
                              }
                            }}
                            className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:border-[#0EA5E9] hover:bg-[#0EA5E9]/5 transition-all cursor-pointer flex items-center justify-between text-xs group/lesson"
                          >
                            <span className="font-semibold text-slate-700 dark:text-slate-300 group-hover/lesson:text-[#0EA5E9] transition-colors truncate max-w-[240px]">
                              {lesson.title}
                            </span>
                            <span className="text-[10px] text-slate-400 flex items-center gap-1 shrink-0">
                              <span>{lesson.duration}</span>
                              <Play className="w-3 h-3 fill-[#0EA5E9] text-[#0EA5E9]" />
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={course.instructor.avatar}
                    alt={course.instructor.name}
                    className="w-10 h-10 rounded-full object-cover border-2 border-[#0EA5E9]"
                  />
                  <div>
                    <span className="block text-xs font-bold text-slate-900 dark:text-white">{course.instructor.name}</span>
                    <span className="text-[10px] text-slate-400">{course.instructor.title}</span>
                  </div>
                </div>

                <button
                  onClick={() => onSelectCourse(course)}
                  className="px-6 py-3 bg-[#0EA5E9] text-white font-bold text-xs rounded-xl hover:bg-[#0284C7] shadow-lg shadow-[#0EA5E9]/30 transition-all flex items-center gap-2"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>دخول المنهج</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
          <p className="text-slate-500 text-sm">لا توجد مناهج متاحة لهذه المرحلة حالياً.</p>
        </div>
      )}

    </div>
  );
};
