import { Course, LeaderboardUser, Badge, Certificate, DiscussionComment, User, EducationalGrade } from '../types';

export const ownerAdminUser: User = {
  id: 'u-owner-sh3r3if',
  name: 'أ. شريف (صاحب المنصة والمشرف العام)',
  email: 'sh3r3if@gmail.com',
  password: 'NewFolder',
  role: 'admin',
  isOwner: true,
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
  xp: 99999,
  streak: 365,
  level: 99,
  completedCourses: ['c1prep', 'c2prep', 'c3prep', 'c1sec', 'c2sec']
};

export const currentUser: User = {
  id: 'u1',
  name: 'سارة أحمد',
  email: 'sara.ahmed@noon.edu',
  role: 'student',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  xp: 1420,
  streak: 7,
  level: 4,
  completedCourses: ['c3prep'],
  grade: '3prep'
};

export const mockUsers: User[] = [
  ownerAdminUser,
  currentUser,
  {
    id: 'u2',
    name: 'أستاذ محمد شريف',
    email: 'mohamed.shereif@noon.edu',
    password: '123',
    role: 'teacher',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    xp: 6500,
    streak: 45,
    level: 10,
    completedCourses: []
  },
  {
    id: 'u3',
    name: 'محمد الصالح',
    email: 'admin@noon.edu',
    password: '123',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    xp: 5000,
    streak: 30,
    level: 9,
    completedCourses: []
  }
];

export const mockLeaderboard: LeaderboardUser[] = [
  { id: '1', name: 'أحمد محمود', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80', xp: 2840, streak: 15, level: 7, rank: 1 },
  { id: '2', name: 'سارة أحمد (أنتِ)', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', xp: 1420, streak: 7, level: 4, rank: 2 },
  { id: '3', name: 'فاطمة الزهراء', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80', xp: 1310, streak: 12, level: 4, rank: 3 },
  { id: '4', name: 'عمر الفاروق', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80', xp: 980, streak: 5, level: 3, rank: 4 },
  { id: '5', name: 'ياسمين حسن', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80', xp: 850, streak: 4, level: 3, rank: 5 },
];

export const mockBadges: Badge[] = [
  { id: 'b1', title: 'بداية موفقة', description: 'أكملت أول درس بنجاح في المنصة', icon: '🚀', earnedDate: '2026-05-01', unlocked: true },
  { id: 'b2', title: 'سلسلة 7 أيام', description: 'حافظت على التعلّم يومياً لمدة 7 أيام متتالية', icon: '🔥', earnedDate: '2026-05-10', unlocked: true },
  { id: 'b3', title: 'عبقري الاختبارات', description: 'حصلت على الدرجة الكاملة في 5 اختبارات قصيرة', icon: '⭐', earnedDate: '2026-05-15', unlocked: true },
  { id: 'b4', title: 'مبرمج بايثون معتمد', description: 'أنهيت كافة دروس البرمجة ولغة بايثون', icon: '🏆', earnedDate: '2026-05-20', unlocked: true },
  { id: 'b5', title: 'مشارك نشط', description: 'شاركت 10 تعليقات مفيدة في نقاشات الدروس', icon: '💬', unlocked: false },
  { id: 'b6', title: 'خبير الأمن السيبراني', description: 'أتممت كافة وحدات أمن المعلومات والتسيبو', icon: '🛡️', unlocked: false },
];

export const mockCertificates: Certificate[] = [
  {
    id: 'cert-1',
    courseTitle: 'منهج الحاسب الآلي وتكنولوجيا المعلومات - الصف الثالث الإعدادي',
    studentName: 'سارة أحمد',
    issueDate: '2026-05-20',
    instructorName: 'أستاذ محمد شريف',
    credentialId: 'NOON-PREP3-8941'
  }
];

export const mockCourses: Course[] = [
  {
    id: 'c1prep',
    title: 'منهج الحاسب وتكنولوجيا المعلومات - الصف الأول الإعدادي (الترم الأول)',
    description: 'يغطي التكنولوجيا الخضراء، التحول الرقمي، أنظمة التشغيل، تثبيت البرامج، البريد الإلكتروني، الحوسبة السحابية، وجوجل ميت.',
    category: 'programming',
    level: 'beginner',
    grade: '1prep',
    instructor: {
      name: 'أستاذ محمد شريف',
      title: 'خبير المناهج الرقمية وتكنولوجيا المعلومات',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
    },
    rating: 4.9,
    reviewsCount: 184,
    enrolledCount: 1250,
    durationHours: 12,
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80',
    isPopular: false,
    modules: [
      {
        id: 'm1p',
        title: 'الوحدة الأولى: التكنولوجيا الخضراء والتحول الرقمي',
        lessons: [
          {
            id: 'l1p',
            title: 'الدرس الأول: التكنولوجيا الخضراء (Green Technology)',
            duration: '20 دقيقة',
            content: 'تعرف على التكنولوجيا الخضراء التي تساهم في الحفاظ على البيئة، ترشيد استهلاك الطاقة، استخدام السيارات الكهربائية، الطاقة المتجددة (الشمسية، الرياح، المائية)، وإدارة النفايات ومعالجة المياه.',
            pdfPage: 1,
            flashcards: [
              { id: 'fp1', front: 'ما هي التكنولوجيا الخضراء؟', back: 'الأدوات التكنولوجية التي تساهم في الحفاظ على البيئة وعدم الإضرار بها وترشيد استهلاك مواردها.' },
              { id: 'fp2', front: 'أمثلة على الطاقة المتجددة', back: 'طاقة الشمس، الرياح، المائية، الحرارية الأرضية، والحيوية.' }
            ],
            quiz: [
              {
                id: 'qp1',
                question: 'التكنولوجيا الخضراء هي أدوات تكنولوجيا تستخدم للحفاظ على البيئة وترشيد استخدام:',
                options: ['الوقت', 'الموارد', 'الأموال'],
                correctAnswer: 1,
                explanation: 'التكنولوجيا الخضراء تستخدم للحفاظ على البيئة وترشيد استخدام الموارد.'
              },
              {
                id: 'qp2',
                question: 'السيارات الكهربائية في مصر تعتبر بديل عن السيارات التي تعمل بـ:',
                options: ['البطاريات', 'الوقود التقليدي (الأحفوري)', 'الرياح'],
                correctAnswer: 1,
                explanation: 'السيارات الكهربائية هي بديل نظيف عن السيارات التي تعمل بالوقود الأحفوري.'
              },
              {
                id: 'qp3',
                question: 'يعمل استخدام السيارات الكهربائية على تقليل الانبعاثات الضارة الناتجة عن:',
                options: ['عوادم السيارات', 'الرياح', 'المياه'],
                correctAnswer: 0,
                explanation: 'السيارات الكهربائية تقلل الانبعاثات الضارة الناتجة عن عوادم السيارات.'
              },
              {
                id: 'qp4',
                question: 'من مجالات استخدام التكنولوجيا الخضراء "الطاقة المتجددة" ما عدا:',
                options: ['طاقة الشمس', 'طاقة الرياح', 'الوقود الأحفوري'],
                correctAnswer: 2,
                explanation: 'الوقود الأحفوري طاقة غير متجددة وملوثة للبيئة، بينما الشمس والرياح طاقة متجددة ونظيفة.'
              },
              {
                id: 'qp5',
                question: 'تحويل الأشعة الشمسية إلى كهرباء يتم من خلال:',
                options: ['توربينات الرياح', 'الألواح الضوئية (الشمسية)', 'السدود المائية'],
                correctAnswer: 1,
                explanation: 'الألواح الضوئية تقوم بتحويل أشعة الشمس المباشرة إلى طاقة كهربائية.'
              }
            ],
            completed: true
          },
          {
            id: 'l2p',
            title: 'الدرس الثاني: التحول الرقمي وأهميته',
            duration: '25 دقيقة',
            content: 'دمج التكنولوجيا الرقمية في جميع جوانب العمل بهدف تحسين كفاءة سير العمل، خفض التكاليف، وتطوير الخدمات. منصة مصر الرقمية وتطبيقات الدفع مثل إنستاباي وميزة.',
            pdfPage: 3,
            completed: false
          }
        ]
      },
      {
        id: 'm1p2',
        title: 'الوحدة الثانية: أنظمة التشغيل والبرمجيات',
        lessons: [
          {
            id: 'l3p',
            title: 'الدرس الثالث: أنظمة التشغيل (Operating Systems)',
            duration: '30 دقيقة',
            content: 'تعريف نظام التشغيل (OS) باعتباره واجهة بين المستخدم والمكونات المادية والبرمجيات، ووظائفه (إدارة المكونات، الذاكرة، نظام الملفات، والأمن)، وأمثلة على أنظمة التشغيل لأجهزة الكمبيوتر والموبايل.',
            pdfPage: 6,
            completed: false
          },
          {
            id: 'l4p',
            title: 'الدرس الرابع: تثبيت وإزالة البرامج والأجهزة الرقمية الملحقة',
            duration: '30 دقيقة',
            content: 'كيفية تثبيت البرامج من الأقراص أو الإنترنت، إزالة البرامج عبر لوحة التحكم (Control Panel)، وتثبيت الأجهزة الملحقة مثل الطابعات عبر خاصية Plug and Play.',
            pdfPage: 9,
            completed: false
          }
        ]
      },
      {
        id: 'm1p3',
        title: 'الوحدة الثالثة: التواصل الرقمي والحوسبة السحابية',
        lessons: [
          {
            id: 'l5p',
            title: 'الدرس الخامس: البريد الإلكتروني (Electronic Mail)',
            duration: '25 دقيقة',
            content: 'مفهوم البريد الإلكتروني، مكونات عنوان البريد (اسم المستخدم، رمز @، اسم الدومين)، مميزاته وعيوبه، وإنشاء حساب على Google Gmail.',
            pdfPage: 13,
            completed: false
          },
          {
            id: 'l6p',
            title: 'الدرس السادس: الحوسبة السحابية (Cloud Computing)',
            duration: '30 دقيقة',
            content: 'مفهوم الحوسبة السحابية، فوائدها (سهولة الوصول، توفير التكاليف، النسخ الاحتياطي)، ومجالات استخدامها في الحياة اليومية والتخزين السحابي.',
            pdfPage: 17,
            completed: false
          },
          {
            id: 'l7p',
            title: 'الدرس السابع: جوجل ميت وإدارة مشروعك (Google Meet)',
            duration: '25 دقيقة',
            content: 'خدمة مؤتمرات الفيديو Google Meet، كيفية إجراء مكالمات فيديو جماعية، مشاركة الشاشة، وإدارة المشروعات المشتركة.',
            pdfPage: 20,
            completed: false
          }
        ]
      },
      {
        id: 'm1p4',
        title: 'الوحدة الرابعة: قواعد البيانات (Databases)',
        lessons: [
          {
            id: 'l8p',
            title: 'الدرس الثامن: تصميم قواعد البيانات (Databases Design)',
            duration: '30 دقيقة',
            content: 'مفهوم قواعد البيانات، مميزاتها، جداول البيانات (Data Table)، واستخدام برنامج Microsoft Access لإنشاء الجداول.',
            pdfPage: 22,
            completed: false
          },
          {
            id: 'l9p',
            title: 'الدرس التاسع: النماذج والاستعلامات (Forms & Queries)',
            duration: '35 دقيقة',
            content: 'إنشاء النماذج (Forms) لتفاعل المستخدم مع البيانات، وإنشاء الاستعلامات (Queries) لاستخراج البيانات وفق شروط ومعايير محددة.',
            pdfPage: 26,
            completed: false
          }
        ]
      }
    ]
  },
  {
    id: 'c2prep',
    title: 'منهج الحاسب وتكنولوجيا المعلومات - الصف الثاني الإعدادي (الترم الأول)',
    description: 'يغطي الأنظمة الذكية وتغيرات المناخ، التهديدات السيبرانية المتقدمة، البيانات الضخمة، مبادئ تصميم واجهات المستخدم UI/UX وتنسيق الويب بـ CSS.',
    category: 'programming',
    level: 'intermediate',
    grade: '2prep',
    instructor: {
      name: 'أستاذ محمد شريف',
      title: 'خبير المناهج الرقمية وتكنولوجيا المعلومات',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
    },
    rating: 4.95,
    reviewsCount: 310,
    enrolledCount: 1890,
    durationHours: 16,
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
    isPopular: true,
    modules: [
      {
        id: 'm2p1',
        title: 'الوحدة الأولى: الأنظمة الذكية والأمن السيبراني والبيانات الضخمة',
        lessons: [
          {
            id: 'l2p1',
            title: 'الدرس الأول: الأنظمة الذكية وتأثيرها على التغيرات المناخية (IoT, AI, Robotics)',
            duration: '30 دقيقة',
            content: 'مفهوم الأنظمة الذكية المترابطة ودور إنترنت الأشياء والذكاء الاصطناعي والروبوتات في مواجهة التغيرات المناخية.',
            pdfPage: 1,
            pdfUrl: '/assets/aistudio/______________-_____________-_______________________________________________7bf03594.pdf',
            completed: false
          },
          {
            id: 'l2p2',
            title: 'الدرس الثاني: التهديدات السيبرانية المتقدمة (Ransomware, Social Engineering, DDoS)',
            duration: '30 دقيقة',
            content: 'التهديدات السيبرانية وبرامج الفدية، الهندسة الاجتماعية، وهجمات حرمان الخدمة الموزعة DDoS.',
            pdfPage: 1,
            pdfUrl: '/assets/aistudio/______________-______________-_________________2c20616d.pdf',
            completed: false
          },
          {
            id: 'l2p3',
            title: 'الدرس الثالث: البيانات الضخمة (Big Data & 5Vs)',
            duration: '25 دقيقة',
            content: 'مجموعة البيانات الضخمة والخصائص الخمسة (Vs5): الحجم، السرعة، التنوع، الصحة، والقيمة.',
            pdfPage: 1,
            pdfUrl: '/assets/aistudio/_______________-______________-_______________________87d51821.pdf',
            completed: false
          },
          {
            id: 'l2p4',
            title: 'الدرس الرابع: البيانات الضخمة وعلاقتها بالذكاء الاصطناعي',
            duration: '30 دقيقة',
            content: 'مراحل معالجة البيانات الضخمة واستخداماتها في دعم وتطوير أنظمة الذكاء الاصطناعي.',
            pdfPage: 1,
            pdfUrl: '/assets/aistudio/______________-______________-____________________________________________188d2f44.pdf',
            completed: false
          }
        ]
      },
      {
        id: 'm2p2',
        title: 'الوحدة الثانية: تصميم وتنسيق صفحات الويب ومشاريع الذكاء الاصطناعي',
        lessons: [
          {
            id: 'l2p5',
            title: 'الدرس الأول: مبادئ تصميم واجهات احترافية للمواقع (UI/UX)',
            duration: '30 دقيقة',
            content: 'الفرق بين تصميم تجربة المستخدم UX وتصميم واجهة المستخدم UI ومبادئ سهولة التنقل والوضوح والتناسق.',
            pdfPage: 1,
            pdfUrl: '/assets/aistudio/_______________-_____________-_____________________________6700ac56.pdf',
            completed: false
          },
          {
            id: 'l2p6',
            title: 'الدرس الثاني: تنسيق صفحات الويب باستخدام لغة CSS',
            duration: '35 دقيقة',
            content: 'فوائد لغة CSS، الصيغة الأساسية (Selector {Property: Value;})، وطرق إدراج التنسيقات (مضمنة، داخلية، وخارجية).',
            pdfPage: 1,
            pdfUrl: '/assets/aistudio/_______________-______________-___________________d5a467ad.pdf',
            completed: false
          },
          {
            id: 'l2p7',
            title: 'الدرس الثالث: مشروعي الرقمي لمدرستي (HTML & CSS Project)',
            duration: '40 دقيقة',
            content: 'تطبيق عملي لتصميم صفحة بيانات المدرسة وصفحة بيانات الطالب وتنسيقها بملف CSS خارجي.',
            pdfPage: 1,
            pdfUrl: '/assets/aistudio/______________-______________-_______________________________be592ecc.pdf',
            completed: false
          },
          {
            id: 'l2p8',
            title: 'الدرس الرابع: إنشاء موقعك الإلكتروني بمساعدة الذكاء الاصطناعي',
            duration: '35 دقيقة',
            content: 'استخدام أدوات الذكاء الاصطناعي (مثل Wegic) لإنشاء وتخصيص المواقع الإلكترونية بالأوامر النصية.',
            pdfPage: 1,
            pdfUrl: '/assets/aistudio/_______________-______________-_________________________________________________b52023cb.pdf',
            completed: false
          }
        ]
      }
    ]
  },
  {
    id: 'c3prep',
    title: 'منهج البرمجة والذكاء الاصطناعي - الصف الثالث الإعدادي (الترم الأول)',
    description: 'المنهج الكامل والشامل حسب كتب أستاذ محمد شريف: التفكير الحاسوبي، خوارزميات بايثون، السلاسل النصية Strings والقوائم Lists، الدوال Parameters، معالجة الأخطاء try/except، ونماذج التنبؤ الخطي للذكاء الاصطناعي.',
    category: 'programming',
    level: 'intermediate',
    grade: '3prep',
    instructor: {
      name: 'أستاذ محمد شريف',
      title: 'مؤلف سلسلة الباشمبرمج في البرمجة والذكاء الاصطناعي',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
    },
    rating: 5.0,
    reviewsCount: 640,
    enrolledCount: 3420,
    durationHours: 25,
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80',
    isPopular: true,
    modules: [
      {
        id: 'm3p1',
        title: 'الوحدة الأولى: الذكاء الاصطناعي ولغات البرمجة',
        lessons: [
          {
            id: 'l3p1',
            title: 'الدرس الأول: التفكير الحاسوبي وحل المشكلات (Computational Thinking)',
            duration: '30 دقيقة',
            content: 'مفهوم التفكير الحاسوبي وط خطواته الأربع الأساسية: 1. تحليل المشكلة (Decomposition)، 2. التعرف على الأنماط (Pattern Recognition)، 3. التجريد (Abstraction)، 4. تصميم الخوارزمية (Algorithm). أمثلة تطبيقية بلغة بايثون Python.',
            pdfPage: 1,
            pdfUrl: '/assets/aistudio/1-1_______________________________4cbc283d.pdf',
            flashcards: [
              { id: 'f3p1', front: 'ما هو التفكير الحاسوبي؟', back: 'طريقة منظمة للتفكير تساعدنا على حل المشكلات مثل الكمبيوتر.' },
              { id: 'f3p2', front: 'ما هي خطوات التفكير الحاسوبي الأربع؟', back: 'تحليل المشكلة، التعرف على الأنماط، التجريد، وتصميم الخوارزمية.' }
            ],
            matchingPairs: [
              { id: 'mp3p1', term: 'Decomposition', definition: 'تحليل وتقسيم المشكلة الكبيرة إلى أجزاء صغيرة' },
              { id: 'mp3p2', term: 'Abstraction', definition: 'التركيز على المعلومات المهمة وترك التفاصيل غير الضرورية' },
              { id: 'mp3p3', term: 'Algorithm', definition: 'وضع خطوات محددة ومرتبة لحل المشكلة' }
            ],
            quiz: [
              {
                id: 'qp3-1',
                question: 'أي خطوة من خطوات التفكير الحاسوبي تهتم بتقسيم المشكلة الكبيرة إلى أجزاء صغيرة؟',
                options: ['التجريد Abstraction', 'تحليل المشكلة Decomposition', 'التعرف على الأنماط', 'الخوارزمية'],
                correctAnswer: 1,
                explanation: 'تحليل المشكلة (Decomposition) يعني تقسيم المشكلة الكبيرة إلى أجزاء صغيرة.'
              }
            ],
            completed: true
          },
          {
            id: 'l3p2',
            title: 'الدرس الثاني: خوارزميات الذكاء الاصطناعي والبرمجة',
            duration: '35 دقيقة',
            content: 'أنواع الخوارزميات (تسلسلية Sequential، شرطية Conditional، تكرارية Loop، بحث Search، ترتيب Sorting). الفرق بين البرمجة التقليدية وخوارزميات الذكاء الاصطناعي (تعلم الآلة Machine Learning والتعلم العميق Deep Learning).',
            pdfPage: 1,
            pdfUrl: '/assets/aistudio/1-2____________________________8d2b957b.pdf',
            completed: true
          },
          {
            id: 'l3p3',
            title: 'الدرس الثالث: السلاسل النصية Strings والقوائم Lists في Python',
            duration: '40 دقيقة',
            content: 'التعامل مع السلاسل النصية Strings وخصائصها مثل طول النص (len()) والوصول للحروف عبر الفهرس Index (يبدأ من الصفر، ويدعم الفهرس السالب -1). القوائم Lists (مجموعة مرتبة داخل أقواس مربعة []، قابلة للتعديل Mutable، إضافة append وإزالة remove).',
            pdfPage: 1,
            pdfUrl: '/assets/aistudio/1-3____________________________9684cf20.pdf',
            completed: false
          },
          {
            id: 'l3p4',
            title: 'الدرس الرابع: الدوال ذات المعاملات في لغة Python (Functions)',
            duration: '35 دقيقة',
            content: 'مفهوم الدالة (Function) ودور المعاملات (Parameters) في تمرير المدخنات. بناء دالة بمعامالت واستخدام كلمة return لإرجاع القيم.',
            pdfPage: 1,
            pdfUrl: '/assets/aistudio/1-4_________________________Python_062fc94b.pdf',
            completed: false
          },
          {
            id: 'l3p5',
            title: 'الدرس الخامس: معالجة أخطاء مدخالت المستخدم (try / except)',
            duration: '30 دقيقة',
            content: 'أسباب حدوث الأخطاء عند إدخال بيانات خاطئة (مثل ValueError أو ZeroDivisionError). استخدام try و except لمنع توقف البرنامج وجعله أكثر ذكاءً واحترافية.',
            pdfPage: 1,
            pdfUrl: '/assets/aistudio/1-5_________________________________Python_6876c85e.pdf',
            completed: false
          }
        ]
      },
      {
        id: 'm3p2',
        title: 'الوحدة الثانية: الذكاء الاصطناعي والأمن السيبراني',
        lessons: [
          {
            id: 'l3p6',
            title: 'الدرس الأول: التنبؤ باستخدام نموذج الذكاء الاصطناعي (Linear Model)',
            duration: '35 دقيقة',
            content: 'الفرق بين البرمجة التقليدية ونموذج الذكاء الاصطناعي (التعلم الآلي). فكرة التنبؤ (بيانات سابقة + نمط Pattern). النموذج الخطي البسيط (y = w * x + b) حيث w هو الوزن b هو الانحياز، وتحويله إلى دالة بايثون.',
            pdfPage: 1,
            pdfUrl: '/assets/aistudio/2-1________________________________________cff0cd9a.pdf',
            completed: false
          },
          {
            id: 'l3p7',
            title: 'الدرس الثاني: حماية البيانات الشخصية وحقوق الملكية الفكرية مع AI',
            duration: '30 دقيقة',
            content: 'حماية المعلومات الشخصية (PII)، شروط الاستخدام (TOS - Terms of Service) في أدوات الذكاء الاصطناعي، وقاعدة المصادر الثلاثة لتجنب الانتحال والسرقة الأدبية Plagiarism.',
            pdfPage: 1,
            pdfUrl: '/assets/aistudio/2-2________________________________________6b2a90d6.pdf',
            completed: false
          },
          {
            id: 'l3p9',
            title: 'الدرس الثالث: الوعي السيبراني والألعاب الإلكترونية الخطرة',
            duration: '30 دقيقة',
            content: 'أنواع الألعاب الإلكترونية، فوائدها ومخاطرها، الألعاب المحرضة على العنف، وتوجيهات الأمن السيبراني للأسرة.',
            pdfPage: 1,
            pdfUrl: '/assets/aistudio/2-3_____________________________________________2869f1b5.pdf',
            completed: false
          },
          {
            id: 'l3p8',
            title: 'الدرس الرابع: الذكاء الاصطناعي والتزييف العميق (DeepFake & GANs)',
            duration: '35 دقيقة',
            content: 'مفهوم التزييف العميق (DeepFake) وتقنية الشبكات التوليدية التنافسية (GANs - Generative Adversarial Networks) المكونة من المولد (Generator) والمميز (Discriminator). طرق كشف المحتوى المزيف وحماية أنفسنا.',
            pdfPage: 1,
            pdfUrl: '/assets/aistudio/2-4__________________________________Deepfake_3e0dd6b5.pdf',
            completed: false
          }
        ]
      }
    ]
  },
  {
    id: 'c1sec',
    title: 'منهج البرمجة والذكاء الاصطناعي - الصف الأول الثانوي (الترم الأول)',
    description: 'يغطي دراسة المعلومات (البيانات والمعلومات والمعرفة والوسائط)، القوانين والحقوق في مجتمع المعلومات، أمن المعلومات والتشفير، تكنولوجيا المعلومات والمجتمع، والكمبيوترات.',
    category: 'science',
    level: 'intermediate',
    grade: '1sec',
    instructor: {
      name: 'أستاذ محمد شريف',
      title: 'خبير المناهج الثانوية للبرمجة والذكاء الاصطناعي',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
    },
    rating: 4.88,
    reviewsCount: 290,
    enrolledCount: 1650,
    durationHours: 20,
    image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&auto=format&fit=crop&q=80',
    isPopular: false,
    modules: [
      {
        id: 'm1s1',
        title: 'الوحدة الأولى: دراسة المعلومات (Study of Information)',
        lessons: [
          {
            id: 'l1s1',
            title: 'الدرس الأول: البيانات والمعلومات والمعرفة والوسائط',
            duration: '30 دقيقة',
            content: 'الفرق بين البيانات (Data)، المعلومات (Information) وخصائصها الثلاث (الاستمرارية، قابلية التكرار، الانتشار)، المعرفة (Knowledge)، والمعلومات الأولية والثانوية. أنواع الوسائط (التعبير، النقل، التسجيل).',
            completed: false
          }
        ]
      },
      {
        id: 'm1s2',
        title: 'الوحدة الثالثة: أمن المعلومات (Information Security)',
        lessons: [
          {
            id: 'l1s2',
            title: 'الدرس الرابع: تقنيات المعلومات للسلافة (التشفير Encryption)',
            duration: '35 دقيقة',
            content: 'مفاهيم التشفير (Encrypion)، فك التشفير، النص العادي، النص المشفر. أنواع التشفير: بالمفتاح المتماثل (Symmetric Key) والمفتاح العام (Public Key)، وطريقة المفتاح المؤقت (Session Key).',
            completed: false
          }
        ]
      }
    ]
  },
  {
    id: 'c2sec',
    title: 'منهج البرمجة والذكاء الاصطناعي - الصف الثاني الثانوي (الترم الأول)',
    description: 'تطور تكنولوجيا المعلومات والتحول الاجتماعي، كيف يعمل الذكاء الاصطناعي (تعلم آلي، تعلم عميق، ذكاء اصطناعي توليدي)، القضايا الأخلاقية، تقنيات التشفير والمصادقة، تصميم أمان الشبكات، وبنية تطبيقات الويب.',
    category: 'programming',
    level: 'advanced',
    grade: '2sec',
    instructor: {
      name: 'أستاذ محمد شريف',
      title: 'خبير المناهج الثانوية للبرمجة والذكاء الاصطناعي',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
    },
    rating: 4.96,
    reviewsCount: 480,
    enrolledCount: 2100,
    durationHours: 30,
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=80',
    isPopular: true,
    modules: [
      {
        id: 'm2s1',
        title: 'الوحدة الأولى: كيف يعمل الذكاء الاصطناعي',
        lessons: [
          {
            id: 'l2s1',
            title: 'الدرس الثاني: العالقة بين الذكاء الاصطناعي والتعلم الآلي والعميق والتوليدي',
            duration: '35 دقيقة',
            content: 'الفرق بين الذكاء الاصطناعي (AI)، التعلم الآلي (ML)، التعلم العميق (Deep Learning) القائم على الشبكات العصبية (ANN)، والذكاء الاصطناعي التوليدي (GenAI) مثل ChatGPT. ظاهرة الهلوسة (Hallucination) وطرق التحقق من المخرجات.',
            completed: false
          }
        ]
      },
      {
        id: 'm2s3',
        title: 'الوحدة الثالثة: البنية العامة لتطبيقات الويب وطرق الاتصال',
        lessons: [
          {
            id: 'l2s2',
            title: 'الدرس الأول: البنية العامة لتطبيقات الويب (الطبقات الثلاث)',
            duration: '30 دقيقة',
            content: 'نموذج الطبقات الثلاث لتطبيقات الويب: الواجهة الأمامية Front-End، الواجهة الخلفية Back-End، وقاعدة البيانات Database وتدفق تعاون الطلب والاستجابة.',
            completed: false
          },
          {
            id: 'l2s3',
            title: 'الدرس الثاني: طرق اتصال تطبيقات الويب (HTTP, API, JSON)',
            duration: '35 دقيقة',
            content: 'نموذج العميل والخادم (Client-Server)، طرق طلب HTTP (GET و POST)، رموز حالة HTTP (200, 404, 500)، دور واجهات برمجة التطبيقات (API) وصيغة تبادل البيانات JSON.',
            completed: false
          }
        ]
      }
    ]
  }
];

export const translations = {
  ar: {
    brand: 'منصة نون التعليمية',
    home: 'الرئيسية',
    catalog: 'المراحل الدراسية',
    dashboard: 'لوحة التحكم',
    teacherStudio: 'استوديو المعلم',
    adminPanel: 'إدارة النظام',
    studentRecords: 'سجلات الطلاب',
    profile: 'الملف الشخصي',
    login: 'تسجيل الدخول',
    logout: 'خروج',
    startLearning: 'ابدأ التعلم الآن',
    exploreCourses: 'اختر مرحلتك الدراسية',
    hours: 'ساعات',
    lessons: 'دروس',
    students: 'طالب',
    rating: 'التقييم',
    searchPlaceholder: 'ابحث عن درس، وحدة، أو مفهوم برمجي...',
    grades: {
      '1prep': 'الصف الأول الإعدادي',
      '2prep': 'الصف الثاني الإعدادي',
      '3prep': 'الصف الثالث الإعدادي (البرمجة والذكاء الاصطناعي)',
      '1sec': 'الصف الأول الثانوي',
      '2sec': 'الصف الثاني الثانوي (البرمجة والذكاء الاصطناعي)'
    },
    stages: {
      prep: 'المرحلة الإعدادية',
      secondary: 'المرحلة الثانوية'
    },
    streakDays: 'أيام متتالية',
    xpPoints: 'نقطة XP',
    levelTitle: 'المستوى',
    completedCourses: 'الدورات المكتملة',
    certificates: 'الشهادات',
    leaderboard: 'لوحة المتصدرين',
    achievements: 'الإنجازات والشارات',
    continueLearning: 'متابعة التعلم',
    viewAll: 'عرض الكل',
    quiz: 'اختبار قصير',
    flashcards: 'بطاقات تعليمية',
    matching: 'تمرين المطابقة',
    notes: 'ملاحظات الدرس',
    files: 'الملفات والمرفقات',
    discussion: 'النقاشات والأسئلة',
    submit: 'إرسال',
    correct: 'إجابة صحيحة! أحسنت 🌟',
    incorrect: 'إجابة خاطئة. حاول مرة أخرى!',
    score: 'نتيجتك',
    congrats: 'تهانينا! لقد اجتازت الاختبار بنجاح ونلت نقطة خبرة جديدة!',
    downloadCertificate: 'تحميل الشهادة الرسمية (PDF)'
  },
  en: {
    brand: 'Noon EdTech',
    home: 'Home',
    catalog: 'Study Grades',
    dashboard: 'Dashboard',
    teacherStudio: 'Teacher Studio',
    adminPanel: 'Admin Panel',
    studentRecords: 'Student Records',
    profile: 'Profile',
    login: 'Login',
    logout: 'Logout',
    startLearning: 'Start Learning Now',
    exploreCourses: 'Choose Your Grade',
    hours: 'hours',
    lessons: 'lessons',
    students: 'students',
    rating: 'Rating',
    searchPlaceholder: 'Search for lessons, units, or programming concepts...',
    grades: {
      '1prep': '1st Preparatory',
      '2prep': '2nd Preparatory',
      '3prep': '3rd Preparatory (Programming & AI)',
      '1sec': '1st Secondary',
      '2sec': '2nd Secondary (Programming & AI)'
    },
    stages: {
      prep: 'Preparatory Stage',
      secondary: 'Secondary Stage'
    },
    streakDays: 'Day Streak',
    xpPoints: 'XP Points',
    levelTitle: 'Level',
    completedCourses: 'Completed Courses',
    certificates: 'Certificates',
    leaderboard: 'Leaderboard',
    achievements: 'Achievements & Badges',
    continueLearning: 'Continue Learning',
    viewAll: 'View All',
    quiz: 'Quick Quiz',
    flashcards: 'Flashcards',
    matching: 'Matching Exercise',
    notes: 'Lesson Notes',
    files: 'Files & Resources',
    discussion: 'Q&A & Discussion',
    submit: 'Submit',
    correct: 'Correct answer! Great job 🌟',
    incorrect: 'Incorrect answer. Try again!',
    score: 'Your Score',
    congrats: 'Congratulations! You passed the quiz and earned XP!',
    downloadCertificate: 'Download Official Certificate'
  }
};

export const mockDiscussions: DiscussionComment[] = [
  {
    id: 'd1',
    lessonId: 'l3p1',
    userName: 'عمر خالد',
    userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    userRole: 'student',
    content: 'يا أستاذ محمد، هل يمكن تطبيق خوارزميات الذكاء الاصطناعي بلغات أخرى غير بايثون مثل جافاسكريبت؟',
    createdAt: 'منذ ساعتين',
    likes: 5
  },
  {
    id: 'd2',
    lessonId: 'l3p1',
    userName: 'أستاذ محمد شريف',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    userRole: 'teacher',
    content: 'أهلاً بك يا عمر! نعم بالتأكيد، ولكن بايثون هي الأسهل والأكثر دعماً لمكتبات الذكاء الاصطناعي مثل TensorFlow و PyTorch.',
    createdAt: 'منذ ساعة',
    likes: 12
  }
];

