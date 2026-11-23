import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LandingPage } from './components/LandingPage';
import { AuthModal } from './components/AuthModal';
import { StudentDashboard } from './components/StudentDashboard';
import { CourseCatalog } from './components/CourseCatalog';
import { CourseDetail } from './components/CourseDetail';
import { InteractiveLesson } from './components/InteractiveLesson';
import { TeacherDashboard } from './components/TeacherDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { ProfileSettings } from './components/ProfileSettings';
import { CertificateModal } from './components/CertificateModal';
import { StudentRecordsCRUD } from './components/StudentRecordsCRUD';

import { currentUser as initialUser, ownerAdminUser, mockUsers, mockCourses, mockLeaderboard, mockBadges, mockCertificates } from './data/mockData';
import { User, Course, Lesson, Certificate } from './types';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    if (localStorage.getItem('noon_logged_out') === 'true') {
      return null;
    }
    const saved = localStorage.getItem('noon_current_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return initialUser;
      }
    }
    return initialUser;
  });

  const [courses, setCourses] = useState<Course[]>(mockCourses);
  const [activeTab, setActiveTab] = useState<string>('records');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  const [darkMode, setDarkMode] = useState(false);
  const [badges, setBadges] = useState(mockBadges);
  const [certificates, setCertificates] = useState<Certificate[]>(mockCertificates);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 4000);
  };

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleSelectRole = (role: User['role']) => {
    if (!currentUser) {
      if (role === 'admin') {
        handleLogin(ownerAdminUser);
        return;
      }
      const demo = mockUsers.find(u => u.role === role) || {
        id: 'u-' + Date.now(),
        name: role === 'teacher' ? 'د. خالد العمري (معلم)' : 'سارة أحمد (طالبة)',
        email: `${role}@noon.edu`,
        role,
        avatar: role === 'teacher'
          ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        xp: 150,
        streak: 1,
        level: 1,
        completedCourses: []
      };
      handleLogin(demo);
      return;
    }
    const updated = {
      ...currentUser,
      role,
      name: currentUser.isOwner
        ? (role === 'admin' ? 'أ. شريف (صاحب المنصة والمشرف العام)' : role === 'teacher' ? 'أ. شريف (معلم)' : 'أ. شريف (طالب)')
        : (role === 'teacher' ? 'د. خالد العمري (معلم)' : role === 'admin' ? 'محمد الصالح (مدير)' : 'سارة أحمد (طالبة)')
    };
    setCurrentUser(updated);
    localStorage.setItem('noon_current_user', JSON.stringify(updated));
  };

  const handleLogin = (user: User) => {
    localStorage.removeItem('noon_logged_out');
    localStorage.setItem('noon_current_user', JSON.stringify(user));
    setCurrentUser(user);
    showToast(`مرحباً بك مجدداً، ${user.name}! 🌟`);
  };

  const handleLogout = () => {
    localStorage.removeItem('noon_current_user');
    localStorage.setItem('noon_logged_out', 'true');
    setCurrentUser(null);
    if (activeTab === 'dashboard' || activeTab === 'profile' || activeTab === 'teacher' || activeTab === 'admin') {
      setActiveTab('home');
    }
    showToast('تم تسجيل الخروج بنجاح 👋');
  };

  const handleStartLesson = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setActiveTab('lesson');
  };

  const handleCompleteLesson = () => {
    if (!currentUser) return;
    const updated = {
      ...currentUser,
      xp: currentUser.xp + 50
    };
    setCurrentUser(updated);
    localStorage.setItem('noon_current_user', JSON.stringify(updated));
  };

  const handleAddCourse = (newCourse: Course) => {
    setCourses([newCourse, ...courses]);
  };

  return (
    <div className={`min-h-screen flex flex-col font-['Tajawal','Inter',sans-serif] ${lang === 'en' ? 'ltr' : 'rtl'}`} dir={lang === 'en' ? 'ltr' : 'rtl'}>
      <Navbar
        currentUser={currentUser}
        onSelectRole={handleSelectRole}
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (tab !== 'detail' && tab !== 'lesson') {
            setSelectedCourse(null);
            setSelectedLesson(null);
          }
        }}
        lang={lang}
        setLang={setLang}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onOpenAuth={() => setAuthModalOpen(true)}
        onLogout={handleLogout}
      />

      <main className="flex-1">
        {activeTab === 'home' && (
          <LandingPage
            courses={courses}
            onSelectCourse={(course) => {
              setSelectedCourse(course);
              setActiveTab('detail');
            }}
            onExplore={() => setActiveTab('catalog')}
          />
        )}

        {activeTab === 'catalog' && (
          <CourseCatalog
            courses={courses}
            onSelectCourse={(course) => {
              setSelectedCourse(course);
              setActiveTab('detail');
            }}
            onStartLesson={(lesson, course) => {
              setSelectedCourse(course);
              setSelectedLesson(lesson);
              setActiveTab('lesson');
            }}
            lang={lang}
          />
        )}

        {activeTab === 'detail' && selectedCourse && (
          <CourseDetail
            course={selectedCourse}
            onBack={() => setActiveTab('catalog')}
            onStartLesson={handleStartLesson}
          />
        )}

        {activeTab === 'lesson' && selectedLesson && selectedCourse && (
          <InteractiveLesson
            lesson={selectedLesson}
            course={selectedCourse}
            onBack={() => setActiveTab('detail')}
            onCompleteLesson={handleCompleteLesson}
            onSelectLesson={handleStartLesson}
          />
        )}

        {activeTab === 'dashboard' && (
          <StudentDashboard
            currentUser={currentUser}
            courses={courses}
            leaderboard={mockLeaderboard}
            badges={badges}
            certificates={certificates}
            onSelectCourse={(course) => {
              setSelectedCourse(course);
              setActiveTab('detail');
            }}
            onViewCertificate={(cert) => setSelectedCertificate(cert)}
            onOpenAuth={() => setAuthModalOpen(true)}
          />
        )}

        {activeTab === 'records' && (
          <StudentRecordsCRUD onNotify={showToast} />
        )}

        {activeTab === 'teacher' && (
          <TeacherDashboard
            courses={courses}
            onAddCourse={handleAddCourse}
            onOpenRecords={() => setActiveTab('records')}
          />
        )}

        {activeTab === 'admin' && (
          <AdminDashboard onOpenRecords={() => setActiveTab('records')} />
        )}

        {activeTab === 'profile' && (
          <ProfileSettings
            currentUser={currentUser}
            certificates={certificates}
            onUpdateUser={(updated) => {
              setCurrentUser(updated);
              localStorage.setItem('noon_current_user', JSON.stringify(updated));
            }}
            lang={lang}
            setLang={setLang}
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            onViewCertificate={(cert) => setSelectedCertificate(cert)}
            onLogout={handleLogout}
            onOpenAuth={() => setAuthModalOpen(true)}
          />
        )}
      </main>

      <Footer />

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onLogin={handleLogin}
      />

      <CertificateModal
        certificate={selectedCertificate}
        onClose={() => setSelectedCertificate(null)}
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#0F172A] text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <span className="w-2.5 h-2.5 rounded-full bg-[#0EA5E9] animate-ping"></span>
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
