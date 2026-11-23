import React, { useState } from 'react';
import { Plus, BookOpen, Users, Trophy, DollarSign, BarChart3, CheckCircle2, Edit3, Trash2 } from 'lucide-react';
import { Course, EducationalGrade } from '../types';

interface TeacherDashboardProps {
  courses: Course[];
  onAddCourse: (course: Course) => void;
  onOpenRecords?: () => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ courses, onAddCourse, onOpenRecords }) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Course['category']>('programming');
  const [level, setLevel] = useState<Course['level']>('beginner');
  const [grade, setGrade] = useState<EducationalGrade>('3prep');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const newCourse: Course = {
      id: 'c-' + Date.now(),
      title,
      description,
      category,
      level,
      grade,
      instructor: {
        name: 'أستاذ محمد شريف',
        title: 'خبير المناهج الرقمية والذكاء الاصطناعي',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
      },
      rating: 5.0,
      reviewsCount: 1,
      enrolledCount: 12,
      durationHours: 15,
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80',
      modules: [
        {
          id: 'm-new',
          title: 'الوحدة الأولى: أساسيات المسار',
          lessons: [
            {
              id: 'l-new-1',
              title: 'الدرس التعريفي',
              duration: '15 دقيقة',
              content: 'محتوى الدرس التعريفي للاستوديو.'
            }
          ]
        }
      ]
    };
    onAddCourse(newCourse);
    setShowCreateModal(false);
    setTitle('');
    setDescription('');
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-10">
      
      {/* Header */}
      <div className="bg-[#0F172A] text-white p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <span className="px-3 py-1 bg-[#0EA5E9]/20 text-[#0EA5E9] rounded-full text-xs font-bold border border-[#0EA5E9]/30">
            استوديو المعلم والمشرف الأكاديمي
          </span>
          <h1 className="text-2xl sm:text-3xl font-black mt-2">إدارة الدورات والمحتوى التعليمي</h1>
          <p className="text-slate-400 text-xs mt-1">أنشئ دورات جديدة، أضف الدروس والاختبارات، وتابع أداء الطلاب ببيانات فورية.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {onOpenRecords && (
            <button
              type="button"
              onClick={onOpenRecords}
              className="px-5 py-3.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-slate-700 transition-colors whitespace-nowrap shrink-0"
            >
              سجلات الطلاب (CRUD)
            </button>
          )}
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3.5 bg-[#0EA5E9] text-white font-bold text-xs rounded-xl hover:bg-[#0284C7] shadow-lg shadow-[#0EA5E9]/30 transition-all flex items-center gap-2 whitespace-nowrap shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>إنشاء دورة جديدة</span>
          </button>
        </div>
      </div>

      {/* Analytics KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">إجمالي الطلاب المسجلين</span>
            <Users className="w-5 h-5 text-[#0EA5E9]" />
          </div>
          <span className="text-2xl font-black text-[#0F172A] dark:text-white">4,850</span>
          <span className="block text-[11px] text-emerald-500 font-semibold">+18% هذا الشهر</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">الدورات المنشورة</span>
            <BookOpen className="w-5 h-5 text-[#0EA5E9]" />
          </div>
          <span className="text-2xl font-black text-[#0F172A] dark:text-white">{courses.length}</span>
          <span className="block text-[11px] text-emerald-500 font-semibold">نشطة ومحدثة</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">متوسط التقييم</span>
            <Trophy className="w-5 h-5 text-amber-500" />
          </div>
          <span className="text-2xl font-black text-[#0F172A] dark:text-white">4.9 / 5.0</span>
          <span className="block text-[11px] text-slate-400 font-medium">بناءً على 1,420 تقييم</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">معدل إتمام الدورات</span>
            <BarChart3 className="w-5 h-5 text-emerald-500" />
          </div>
          <span className="text-2xl font-black text-[#0F172A] dark:text-white">84%</span>
          <span className="block text-[11px] text-emerald-500 font-semibold">ممتاز</span>
        </div>
      </div>

      {/* Courses Managed List */}
      <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <h3 className="text-lg font-bold text-[#0F172A] dark:text-white">دوراتك المنشورة</h3>

        <div className="space-y-4">
          {courses.map((course) => (
            <div key={course.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4 w-full">
                <img src={course.image} alt={course.title} className="w-20 h-14 rounded-lg object-cover" />
                <div>
                  <span className="text-[11px] font-bold text-[#0EA5E9]">{course.category} · {course.level}</span>
                  <h4 className="text-sm font-bold text-[#0F172A] dark:text-white">{course.title}</h4>
                  <span className="text-[11px] text-slate-500">{course.enrolledCount} طالب · {course.durationHours} ساعة</span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button className="px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-[#0EA5E9] hover:text-white transition-all flex items-center gap-1">
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>تعديل</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create Course Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6">
            <h3 className="text-lg font-bold text-[#0F172A] dark:text-white">إنشاء دورة تدريبية جديدة</h3>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">عنوان الدورة</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: هندسة النظم السحابية المتقدمة"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">وصف الدورة</label>
                <textarea
                  required
                  rows={3}
                  placeholder="اكتب وصفاً تفصيلياً لمحاور الدورة وأهدافها..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">التصنيف</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                  >
                    <option value="programming">البرمجة والتقنية</option>
                    <option value="design">التصميم والفنون</option>
                    <option value="science">العلوم والذكاء الاصطناعي</option>
                    <option value="languages">اللغات</option>
                    <option value="business">الأعمال</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">المستوى</label>
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value as any)}
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                  >
                    <option value="beginner">مبتدئ</option>
                    <option value="intermediate">متوسط</option>
                    <option value="advanced">متقدم</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">المرحلة الدراسية</label>
                <select
                  value={grade}
                  onChange={(e) => setGrade(e.target.value as EducationalGrade)}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                >
                  <option value="1prep">الصف الأول الإعدادي</option>
                  <option value="2prep">الصف الثاني الإعدادي</option>
                  <option value="3prep">الصف الثالث الإعدادي</option>
                  <option value="1sec">الصف الأول الثانوي</option>
                  <option value="2sec">الصف الثاني الثانوي</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#0EA5E9] text-white text-xs font-bold hover:bg-[#0284C7] shadow-lg shadow-[#0EA5E9]/20"
                >
                  نشر الدورة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
