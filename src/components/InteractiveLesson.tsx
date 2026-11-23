import React, { useState } from 'react';
import { ArrowRight, Play, CheckCircle2, BookOpen, FileText, MessageSquare, Award, Sparkles, HelpCircle, RotateCcw } from 'lucide-react';
import { Lesson, Course, DiscussionComment } from '../types';
import { mockDiscussions } from '../data/mockData';
import confetti from 'canvas-confetti';

interface InteractiveLessonProps {
  lesson: Lesson;
  course: Course;
  onBack: () => void;
  onCompleteLesson: () => void;
  onSelectLesson: (lesson: Lesson) => void;
}

const gradePdfMap: Record<string, { title: string; url: string }> = {
  '1prep': { title: 'كتاب وملازم الصف الأول الإعدادي (PDF)', url: '/assets/aistudio/_________________17956559.pdf' },
  '2prep': { title: 'كتاب وملازم الصف الثاني الإعدادي (PDF)', url: '/assets/aistudio/____________________1e246c81.pdf' },
  '3prep': { title: 'كتاب البرمجة والذكاء الاصطناعي - الصف الثالث الإعدادي (PDF)', url: '/assets/aistudio/____________________d2edf9eb.pdf' },
  '1sec': { title: 'كتاب وملازم الصف الأول الثانوي (PDF)', url: '/assets/aistudio/__________________906ec327.pdf' },
  '2sec': { title: 'كتاب البرمجة والذكاء الاصطناعي - الصف الثاني الثانوي (PDF)', url: '/assets/aistudio/__________________1__2c09fd1b.pdf' },
};

const getPdfUrl = (grade: string, page?: number, lessonPdfUrl?: string) => {
  if (lessonPdfUrl) {
    const p = page || 1;
    return `${lessonPdfUrl}#page=${p}`;
  }
  const map: Record<string, string> = {
    '1prep': '/assets/aistudio/_________________17956559.pdf',
    '2prep': '/assets/aistudio/____________________1e246c81.pdf',
    '3prep': '/assets/aistudio/____________________d2edf9eb.pdf',
    '1sec': '/assets/aistudio/__________________906ec327.pdf',
    '2sec': '/assets/aistudio/__________________1__2c09fd1b.pdf',
  };
  const base = map[grade] || map['3prep'];
  const p = page || 2;
  return `${base}#page=${p}`;
};

export const InteractiveLesson: React.FC<InteractiveLessonProps> = ({
  lesson,
  course,
  onBack,
  onCompleteLesson,
  onSelectLesson,
}) => {
  const [activeTab, setActiveTab] = useState<'explain' | 'flashcards' | 'matching' | 'quiz' | 'discussion' | 'pdf'>('pdf');
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});
  const [matchingSelections, setMatchingSelections] = useState<Record<string, string>>({});
  const [discussions, setDiscussions] = useState<DiscussionComment[]>(mockDiscussions);
  const [newComment, setNewComment] = useState('');

  const handleQuizSubmit = () => {
    setQuizSubmitted(true);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
    onCompleteLesson();
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    const comment: DiscussionComment = {
      id: 'd-' + Date.now(),
      lessonId: lesson.id,
      userName: 'سارة أحمد',
      userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      userRole: 'student',
      content: newComment,
      createdAt: 'الآن',
      likes: 0
    };
    setDiscussions([comment, ...discussions]);
    setNewComment('');
  };

  const handleCompleteLessonAndOpenQuiz = () => {
    onCompleteLesson();
    if (lesson.quiz && lesson.quiz.length > 0) {
      setActiveTab('quiz');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-8">
      
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-[#0EA5E9] transition-colors"
        >
          <ArrowRight className="w-4 h-4" />
          <span>العودة إلى تفاصيل الدورة</span>
        </button>

        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-slate-500">{course.title}</span>
          <span className="px-3 py-1 bg-[#0EA5E9]/10 text-[#0EA5E9] rounded-full text-xs font-bold">
            {lesson.duration}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Lesson Content Area */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Video or Banner */}
          <div className="bg-slate-900 rounded-2xl overflow-hidden shadow-2xl relative aspect-video flex items-center justify-center">
            {lesson.videoUrl ? (
              <video
                controls
                src={lesson.videoUrl}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-center p-8 space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-[#0EA5E9] text-white flex items-center justify-center mx-auto shadow-lg shadow-[#0EA5E9]/30">
                  <Play className="w-8 h-8 fill-white" />
                </div>
                <h3 className="text-white text-lg font-bold">{lesson.title}</h3>
                <p className="text-slate-400 text-xs">اضغط للبدء بمشاهدة المحاضرة التفاعلية</p>
              </div>
            )}
          </div>

          {/* Interactive Tabs Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setActiveTab('explain')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                activeTab === 'explain' ? 'bg-[#0EA5E9] text-white shadow-md' : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>الشرح والمحتوى</span>
            </button>

            {lesson.flashcards && lesson.flashcards.length > 0 && (
              <button
                onClick={() => setActiveTab('flashcards')}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                  activeTab === 'flashcards' ? 'bg-[#0EA5E9] text-white shadow-md' : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>البطاقات التعليمية</span>
              </button>
            )}

            {lesson.matchingPairs && lesson.matchingPairs.length > 0 && (
              <button
                onClick={() => setActiveTab('matching')}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                  activeTab === 'matching' ? 'bg-[#0EA5E9] text-white shadow-md' : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
                }`}
              >
                <HelpCircle className="w-4 h-4" />
                <span>تمرين المطابقة</span>
              </button>
            )}

            {lesson.quiz && lesson.quiz.length > 0 && (
              <button
                onClick={() => setActiveTab('quiz')}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                  activeTab === 'quiz' ? 'bg-[#0EA5E9] text-white shadow-md' : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
                }`}
              >
                <Award className="w-4 h-4" />
                <span>اختبار الدرس (الأسئلة والدرجات)</span>
              </button>
            )}

            <button
              onClick={() => setActiveTab('discussion')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                activeTab === 'discussion' ? 'bg-[#0EA5E9] text-white shadow-md' : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>النقاش والأسئلة</span>
            </button>

            <button
              onClick={() => setActiveTab('pdf')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                activeTab === 'pdf' ? 'bg-[#0EA5E9] text-white shadow-md' : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>ملف الدرس (PDF)</span>
            </button>
          </div>

          {/* Tab Content */}
          <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            
            {activeTab === 'pdf' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <div>
                    <h3 className="text-base font-bold text-[#0F172A] dark:text-white">
                      {lesson.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">عرض ملف الـ PDF الخاص بهذا الدرس مباشرة.</p>
                  </div>
                  <a
                    href={getPdfUrl(course.grade, lesson.pdfPage, lesson.pdfUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 bg-[#0EA5E9] text-white text-xs font-bold rounded-xl hover:bg-[#0284C7] shadow-lg shadow-[#0EA5E9]/20 transition-all flex items-center gap-2"
                  >
                    <FileText className="w-4 h-4" />
                    <span>تحميل أو فتح PDF في نافذة جديدة</span>
                  </a>
                </div>

                <div className="w-full h-[650px] rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-950">
                  <iframe
                    src={getPdfUrl(course.grade, lesson.pdfPage, lesson.pdfUrl)}
                    title="ملف الدرس PDF"
                    className="w-full h-full"
                  />
                </div>
              </div>
            )}

            {activeTab === 'explain' && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-[#0F172A] dark:text-white">{lesson.title}</h2>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-line">
                  {lesson.content}
                </p>
                <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <button
                    onClick={handleCompleteLessonAndOpenQuiz}
                    className="px-6 py-3 bg-emerald-600 text-white font-bold text-xs rounded-xl hover:bg-emerald-700 shadow-lg shadow-emerald-600/20 transition-all flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>اكتمال محتويات الدرس وانتقل إلى الاختبار التفاعلي (+50 XP)</span>
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'flashcards' && lesson.flashcards && (
              <div className="space-y-6">
                <h3 className="text-base font-bold text-[#0F172A] dark:text-white">البطاقات التعليمية (اضغط للقلب)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {lesson.flashcards.map((card) => {
                    const isFlipped = flippedCards[card.id];
                    return (
                      <div
                        key={card.id}
                        onClick={() => setFlippedCards({ ...flippedCards, [card.id]: !isFlipped })}
                        className={`h-48 rounded-2xl border p-6 flex items-center justify-center text-center cursor-pointer transition-all duration-300 shadow-sm ${
                          isFlipped 
                            ? 'bg-[#0EA5E9] text-white border-[#0EA5E9]' 
                            : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-[#0F172A] dark:text-white'
                        }`}
                      >
                        <p className="text-sm font-bold">
                          {isFlipped ? card.back : card.front}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === 'matching' && lesson.matchingPairs && (
              <div className="space-y-6">
                <h3 className="text-base font-bold text-[#0F172A] dark:text-white">تمرين المطابقة التفاعلي</h3>
                <p className="text-xs text-slate-500">طابق كل مصطلح بتعريفه الصحيح لتعزيز فهمك.</p>
                <div className="space-y-4">
                  {lesson.matchingPairs.map((pair) => (
                    <div key={pair.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <span className="text-xs font-bold text-[#0EA5E9] bg-[#0EA5E9]/10 px-3 py-1.5 rounded-lg">{pair.term}</span>
                      <span className="text-xs text-slate-700 dark:text-slate-300">{pair.definition}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'quiz' && lesson.quiz && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-[#0F172A] dark:text-white">اختبار الدرس والدرجات</h3>
                  <span className="px-3 py-1 bg-[#0EA5E9]/10 text-[#0EA5E9] rounded-full text-xs font-bold">
                    عدد الأسئلة: {lesson.quiz.length}
                  </span>
                </div>
                <div className="space-y-6">
                  {lesson.quiz.map((q, qIdx) => (
                    <div key={q.id} className="space-y-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                      <p className="text-sm font-bold text-[#0F172A] dark:text-white">{qIdx + 1}. {q.question}</p>
                      <div className="space-y-2">
                        {q.options.map((opt, oIdx) => (
                          <button
                            key={oIdx}
                            onClick={() => setSelectedAnswers({ ...selectedAnswers, [qIdx]: oIdx })}
                            className={`w-full text-right p-3 rounded-xl border text-xs font-medium transition-all ${
                              selectedAnswers[qIdx] === oIdx
                                ? 'bg-[#0EA5E9] text-white border-[#0EA5E9]'
                                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                      {quizSubmitted && (
                        <p className={`text-xs font-bold mt-2 ${selectedAnswers[qIdx] === q.correctAnswer ? 'text-emerald-500' : 'text-red-500'}`}>
                          {selectedAnswers[qIdx] === q.correctAnswer ? 'إجابة صحيحة! 🌟' : `الإجابة الصحيحة هي: ${q.options[q.correctAnswer]}. ${q.explanation}`}
                        </p>
                      )}
                    </div>
                  ))}

                  {!quizSubmitted ? (
                    <button
                      onClick={handleQuizSubmit}
                      className="w-full py-3 bg-[#0EA5E9] text-white font-bold text-xs rounded-xl hover:bg-[#0284C7] shadow-lg shadow-[#0EA5E9]/20 transition-all"
                    >
                      إرسال الإجابات وحساب الدرجات
                    </button>
                  ) : (
                    <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-center space-y-2">
                      <h4 className="text-base font-bold">🎉 نتيجة الاختبار والدرجات</h4>
                      <p className="text-sm font-extrabold">
                        لقد حصلت على {lesson.quiz.filter((q, qIdx) => selectedAnswers[qIdx] === q.correctAnswer).length} من {lesson.quiz.length} درجة 
                        ({Math.round((lesson.quiz.filter((q, qIdx) => selectedAnswers[qIdx] === q.correctAnswer).length / lesson.quiz.length) * 100)}%)
                      </p>
                      <p className="text-xs text-slate-500">تم تقييم الاختبار بنجاح واكتسبت نقاط الخبرة والشارات!</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'discussion' && (
              <div className="space-y-6">
                <h3 className="text-base font-bold text-[#0F172A] dark:text-white">نقاشات وأسئلة الدرس</h3>

                <form onSubmit={handleAddComment} className="space-y-3">
                  <textarea
                    rows={3}
                    placeholder="اكتب سؤالك أو استفسارك هنا ليزيدك المدرب والزملاء تفاعلاً..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-[#0EA5E9]"
                  />
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#0EA5E9] text-white font-bold text-xs rounded-xl hover:bg-[#0284C7] transition-all"
                  >
                    نشر السؤال
                  </button>
                </form>

                <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                  {discussions.map((d) => (
                    <div key={d.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <img src={d.userAvatar} alt={d.userName} className="w-8 h-8 rounded-full object-cover" />
                          <div>
                            <span className="block text-xs font-bold text-[#0F172A] dark:text-white">{d.userName}</span>
                            <span className="text-[10px] text-[#0EA5E9]">{d.userRole === 'teacher' ? 'معلم الدورة' : 'طالب'}</span>
                          </div>
                        </div>
                        <span className="text-[10px] text-slate-400">{d.createdAt}</span>
                      </div>
                      <p className="text-xs text-slate-700 dark:text-slate-300 pr-10">{d.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>

        {/* Syllabus Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-[#0F172A] dark:text-white">محتويات الدرس</h3>
            
            <div className="space-y-3">
              {course.modules.map((m) => (
                <div key={m.id} className="space-y-2">
                  <span className="text-xs font-bold text-[#0EA5E9]">{m.title}</span>
                  <div className="space-y-1.5 pr-2">
                    {m.lessons.map((l) => (
                      <div
                        key={l.id}
                        onClick={() => onSelectLesson(l)}
                        className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-between cursor-pointer transition-all ${
                          l.id === lesson.id 
                            ? 'bg-[#0EA5E9] text-white border-[#0EA5E9]' 
                            : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-[#0EA5E9]'
                        }`}
                      >
                        <span>{l.title}</span>
                        <span>{l.duration}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
