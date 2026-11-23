import { BookletStatus, StudentGradeKey, StudentRecord } from '../types';

export interface AttachedSheetFile {
  grade: StudentGradeKey;
  stage: 'primary' | 'prep';
  fileName: string;
  url: string;
  labelAr: string;
  labelEn: string;
  shortLabelAr: string;
  defaultBooklet: BookletStatus;
  defaultFee: number;
}

export const ATTACHED_SHEET_FILES: AttachedSheetFile[] = [
  {
    grade: '4prim',
    stage: 'primary',
    fileName: 'Prim4_1a6a5383.html',
    url: '/assets/aistudio/Prim4_1a6a5383.html',
    labelAr: 'الصف الرابع الابتدائي',
    labelEn: '4th Primary',
    shortLabelAr: 'رابعة ابتدائي',
    defaultBooklet: 'كتاب سلاح التلميذ',
    defaultFee: 100,
  },
  {
    grade: '5prim',
    stage: 'primary',
    fileName: 'Prim5_4909505b.html',
    url: '/assets/aistudio/Prim5_4909505b.html',
    labelAr: 'الصف الخامس الابتدائي',
    labelEn: '5th Primary',
    shortLabelAr: 'خامسة ابتدائي',
    defaultBooklet: 'كتاب سلاح التلميذ',
    defaultFee: 100,
  },
  {
    grade: '6prim',
    stage: 'primary',
    fileName: 'Prim6_7c21969d.html',
    url: '/assets/aistudio/Prim6_7c21969d.html',
    labelAr: 'الصف السادس الابتدائي',
    labelEn: '6th Primary',
    shortLabelAr: 'سادسة ابتدائي',
    defaultBooklet: 'كتاب سلاح التلميذ',
    defaultFee: 100,
  },
  {
    grade: '1prep',
    stage: 'prep',
    fileName: 'Prep1_9cdbbe19.html',
    url: '/assets/aistudio/Prep1_9cdbbe19.html',
    labelAr: 'الصف الأول الإعدادي',
    labelEn: '1st Preparatory',
    shortLabelAr: 'أولى إعدادي',
    defaultBooklet: 'المذكرة',
    defaultFee: 150,
  },
  {
    grade: '2prep',
    stage: 'prep',
    fileName: 'Prep2_c9574a63.html',
    url: '/assets/aistudio/Prep2_c9574a63.html',
    labelAr: 'الصف الثاني الإعدادي',
    labelEn: '2nd Preparatory',
    shortLabelAr: 'تانية إعدادي',
    defaultBooklet: 'المذكرة',
    defaultFee: 160,
  },
  {
    grade: '3prep',
    stage: 'prep',
    fileName: 'Prep3_41cde18b.html',
    url: '/assets/aistudio/Prep3_41cde18b.html',
    labelAr: 'الصف الثالث الإعدادي',
    labelEn: '3rd Preparatory',
    shortLabelAr: 'تالتة إعدادي',
    defaultBooklet: 'المذكرة',
    defaultFee: 170,
  },
];

export const MONTH_COLUMNS: { key: keyof StudentRecord['payments']; num: string; labelAr: string; labelEn: string }[] = [
  { key: 'm8', num: '8', labelAr: 'شهر 8', labelEn: 'Month 8' },
  { key: 'm9', num: '9', labelAr: 'شهر 9', labelEn: 'Month 9' },
  { key: 'm10', num: '10', labelAr: 'شهر 10', labelEn: 'Month 10' },
  { key: 'm11', num: '11', labelAr: 'شهر 11', labelEn: 'Month 11' },
  { key: 'm12', num: '12', labelAr: 'شهر 12', labelEn: 'Month 12' },
];

export const WEEK_LABELS_AR = [
  'الأسبوع الأول',
  'الأسبوع الثاني',
  'الأسبوع الثالث',
  'الأسبوع الرابع',
  'الأسبوع الخامس',
  'الأسبوع السادس',
  'الأسبوع السابع',
  'الأسبوع الثامن',
  'الأسبوع التاسع',
  'الأسبوع العاشر',
  'الأسبوع الحادي عشر',
  'الأسبوع الثاني عشر',
  'الأسبوع الثالث عشر',
  'الأسبوع الرابع عشر',
];

export const createEmptyWeeks = (): [boolean, boolean][] =>
  Array.from({ length: 14 }, () => [false, false] as [boolean, boolean]);

function toPairs(flags: boolean[]): [boolean, boolean][] {
  const pairs: [boolean, boolean][] = [];
  for (let i = 0; i < 14; i++) {
    pairs.push([Boolean(flags[i * 2]), Boolean(flags[i * 2 + 1])]);
  }
  return pairs;
}

/**
 * Exact student dataset parsed from all 6 attached Google Sheets HTML files:
 * - public/assets/aistudio/Prim4_1a6a5383.html (2 students)
 * - public/assets/aistudio/Prim5_4909505b.html (3 students)
 * - public/assets/aistudio/Prim6_7c21969d.html (0 students - ready sheet)
 * - public/assets/aistudio/Prep1_9cdbbe19.html (8 students)
 * - public/assets/aistudio/Prep2_c9574a63.html (6 students)
 * - public/assets/aistudio/Prep3_41cde18b.html (4 students)
 */
export const initialStudentRecords: StudentRecord[] = [
  // ==================== Prim 4 (Prim4_1a6a5383.html) ====================
  {
    id: '4prim-1',
    code: 1,
    grade: '4prim',
    name: 'آدم جمعه',
    booklet: 'كتاب سلاح التلميذ',
    deliveryStatus: 'استلم',
    phone: '01225989770',
    parentPhone: '01225989770',
    bookingDate: '2026/08/02',
    payments: { m8: '100', m9: '100', m10: '100', m11: '--', m12: '--' },
    weeks: toPairs([
      false, true, true, true, false, false, false, false, false, false, false, false, false, false,
      false, false, false, false, false, false, false, false, false, false, false, false, false, false,
    ]),
  },
  {
    id: '4prim-2',
    code: 2,
    grade: '4prim',
    name: 'عمر عوض',
    booklet: 'كتاب سلاح التلميذ',
    deliveryStatus: 'استلم',
    phone: '',
    parentPhone: '',
    bookingDate: '',
    payments: { m8: '100', m9: '100', m10: '100', m11: '--', m12: '--' },
    weeks: toPairs([
      false, true, true, true, true, true, true, false, false, false, false, false, false, false,
      false, false, false, false, false, false, false, false, false, false, false, false, false, false,
    ]),
  },

  // ==================== Prim 5 (Prim5_4909505b.html) ====================
  {
    id: '5prim-1',
    code: 1,
    grade: '5prim',
    name: 'ملك محمد سعد',
    booklet: 'كتاب سلاح التلميذ',
    deliveryStatus: 'استلم',
    phone: '01009268402',
    parentPhone: '01009268402',
    bookingDate: '2026/08/01',
    payments: { m8: '100', m9: '100', m10: '100', m11: '100', m12: '--' },
    weeks: toPairs([
      true, true, true, true, true, true, false, false, false, false, false, false, false, false,
      false, false, false, false, false, false, false, false, false, false, false, false, false, false,
    ]),
  },
  {
    id: '5prim-2',
    code: 2,
    grade: '5prim',
    name: 'اياد علي',
    booklet: 'كتاب سلاح التلميذ',
    deliveryStatus: 'استلم',
    phone: '01284693059',
    parentPhone: '01284693059',
    bookingDate: '2026/08/01',
    payments: { m8: '100', m9: '100', m10: '--', m11: '--', m12: '--' },
    weeks: toPairs([
      true, true, true, true, true, true, false, false, false, false, false, false, false, false,
      false, false, false, false, false, false, false, false, false, false, false, false, false, false,
    ]),
  },
  {
    id: '5prim-3',
    code: 3,
    grade: '5prim',
    name: 'محمد ربيع',
    booklet: 'كتاب سلاح التلميذ',
    deliveryStatus: 'استلم',
    phone: '01276879437',
    parentPhone: '01275710653',
    bookingDate: '2027/08/25',
    payments: { m8: '--', m9: '--', m10: '--', m11: '--', m12: '--' },
    weeks: toPairs([
      false, false, false, false, true, false, false, false, false, false, false, false, false, false,
      false, false, false, false, false, false, false, false, false, false, false, false, false, false,
    ]),
  },

  // ==================== Prep 1 (Prep1_9cdbbe19.html) ====================
  {
    id: '1prep-1',
    code: 1,
    grade: '1prep',
    name: 'محمد السيد محمد',
    booklet: 'المذكرة',
    deliveryStatus: 'استلم',
    phone: '01206609651',
    parentPhone: '01206609651',
    bookingDate: '2026/08/15',
    payments: { m8: '75', m9: '150', m10: '--', m11: '--', m12: '--' },
    weeks: toPairs([
      false, false, true, true, true, true, true, true, false, false, true, true, true, true,
      false, true, false, false, false, false, false, false, false, false, false, false, false, false,
    ]),
  },
  {
    id: '1prep-2',
    code: 2,
    grade: '1prep',
    name: 'شهد احمد',
    booklet: 'المذكرة',
    deliveryStatus: 'استلم',
    phone: '01227873467',
    parentPhone: '01227873467',
    bookingDate: '2026/08/15',
    payments: { m8: '--', m9: '--', m10: '--', m11: '--', m12: '--' },
    weeks: toPairs([
      false, false, true, true, true, true, true, true, false, false, true, false, true, false,
      true, true, false, false, false, false, false, false, false, false, false, false, false, false,
    ]),
  },
  {
    id: '1prep-3',
    code: 3,
    grade: '1prep',
    name: 'محمد شريف',
    booklet: 'المذكرة',
    deliveryStatus: 'استلم',
    phone: '',
    parentPhone: '01002181984',
    bookingDate: '2026/08/15',
    payments: { m8: '--', m9: '--', m10: '--', m11: '--', m12: '--' },
    weeks: toPairs([
      false, true, true, true, false, false, false, false, false, false, true, false, false, false,
      false, false, false, false, false, false, false, false, false, false, false, false, false, false,
    ]),
  },
  {
    id: '1prep-4',
    code: 4,
    grade: '1prep',
    name: 'جنا محمد شريف',
    booklet: 'المذكرة',
    deliveryStatus: 'استلم',
    phone: '',
    parentPhone: '01205669175',
    bookingDate: '2026/08/15',
    payments: { m8: '--', m9: '--', m10: '--', m11: '--', m12: '--' },
    weeks: createEmptyWeeks(),
  },
  {
    id: '1prep-5',
    code: 5,
    grade: '1prep',
    name: 'روداينا عادل',
    booklet: 'المذكرة',
    deliveryStatus: 'مطلوب',
    phone: '',
    parentPhone: '',
    bookingDate: '2026/08/23',
    payments: { m8: '--', m9: '--', m10: '--', m11: '--', m12: '--' },
    weeks: createEmptyWeeks(),
  },
  {
    id: '1prep-6',
    code: 6,
    grade: '1prep',
    name: 'طلبه محمد طلبه',
    booklet: 'المذكرة',
    deliveryStatus: 'استلم',
    phone: '01288207211',
    parentPhone: '',
    bookingDate: '2027/08/29',
    payments: { m8: '--', m9: '150', m10: '--', m11: '--', m12: '--' },
    weeks: toPairs([
      false, true, false, false, true, true, true, true, false, false, true, true, true, true,
      true, true, false, false, false, false, false, false, false, false, false, false, false, false,
    ]),
  },
  {
    id: '1prep-7',
    code: 7,
    grade: '1prep',
    name: 'باسم رضا احمد',
    booklet: 'المذكرة',
    deliveryStatus: 'استلم',
    phone: '01206556187',
    parentPhone: '01027093969',
    bookingDate: '2027/08/29',
    payments: { m8: '--', m9: '150', m10: '--', m11: '--', m12: '--' },
    weeks: toPairs([
      false, true, false, false, true, false, true, false, false, false, false, false, false, true,
      true, true, false, false, false, false, false, false, false, false, false, false, false, false,
    ]),
  },
  {
    id: '1prep-8',
    code: 8,
    grade: '1prep',
    name: 'االاء احمد',
    booklet: 'المذكرة',
    deliveryStatus: 'استلم',
    phone: '',
    parentPhone: '',
    bookingDate: '',
    payments: { m8: '--', m9: '150', m10: '--', m11: '--', m12: '--' },
    weeks: toPairs([
      false, true, false, false, true, true, true, true, false, false, true, true, true, true,
      true, true, false, false, false, false, false, false, false, false, false, false, false, false,
    ]),
  },

  // ==================== Prep 2 (Prep2_c9574a63.html) ====================
  {
    id: '2prep-1',
    code: 1,
    grade: '2prep',
    name: 'حنين رشدي',
    booklet: 'المذكرة',
    deliveryStatus: 'استلم',
    phone: '',
    parentPhone: '01284080021',
    bookingDate: '2026/08/15',
    payments: { m8: '--', m9: '160', m10: '--', m11: '--', m12: '--' },
    weeks: toPairs([
      false, false, true, true, true, true, false, true, false, false, true, true, false, false,
      false, false, true, false, true, true, true, false, false, false, false, false, false, false,
    ]),
  },
  {
    id: '2prep-2',
    code: 2,
    grade: '2prep',
    name: 'محمد يحي',
    booklet: 'المذكرة',
    deliveryStatus: 'استلم',
    phone: '',
    parentPhone: '01211702302',
    bookingDate: '2026/08/15',
    payments: { m8: '--', m9: '160', m10: '--', m11: '--', m12: '--' },
    weeks: toPairs([
      false, false, true, true, true, false, true, true, false, false, true, true, false, false,
      false, false, true, false, true, true, false, false, false, false, false, false, false, false,
    ]),
  },
  {
    id: '2prep-3',
    code: 3,
    grade: '2prep',
    name: 'مريم صلاح',
    booklet: 'المذكرة',
    deliveryStatus: 'استلم',
    phone: '01277458068',
    parentPhone: '01204092192',
    bookingDate: '2026/09/06',
    payments: { m8: '--', m9: '160', m10: '--', m11: '--', m12: '--' },
    weeks: toPairs([
      false, false, false, false, false, true, true, true, false, false, true, true, false, false,
      false, false, true, false, true, false, false, false, false, false, false, false, false, false,
    ]),
  },
  {
    id: '2prep-4',
    code: 4,
    grade: '2prep',
    name: 'دليا عطيه عبد الحميد',
    booklet: 'المذكرة',
    deliveryStatus: 'استلم',
    phone: '01559750898',
    parentPhone: '',
    bookingDate: '2026/09/06',
    payments: { m8: '--', m9: '160', m10: '160', m11: '--', m12: '--' },
    weeks: toPairs([
      false, false, false, false, false, false, true, false, false, false, true, true, false, false,
      false, false, true, false, true, true, true, false, false, false, false, false, false, false,
    ]),
  },
  {
    id: '2prep-5',
    code: 5,
    grade: '2prep',
    name: 'سهير احمد زينهم',
    booklet: 'المذكرة',
    deliveryStatus: 'استلم',
    phone: '',
    parentPhone: '',
    bookingDate: '2027/09/20',
    payments: { m8: '--', m9: '--', m10: '--', m11: '--', m12: '--' },
    weeks: toPairs([
      false, false, false, false, false, false, false, false, false, false, true, true, false, false,
      false, false, true, false, true, true, true, false, false, false, false, false, false, false,
    ]),
  },
  {
    id: '2prep-6',
    code: 6,
    grade: '2prep',
    name: 'حسن مدحت محمد',
    booklet: 'المذكرة',
    deliveryStatus: 'استلم',
    phone: '01227109612',
    parentPhone: '01227150775',
    bookingDate: '2027/10/19',
    payments: { m8: '--', m9: '--', m10: '--', m11: '--', m12: '--' },
    weeks: toPairs([
      false, false, false, false, false, false, false, false, false, false, false, false, false, false,
      false, false, true, false, true, true, false, false, false, false, false, false, false, false,
    ]),
  },

  // ==================== Prep 3 (Prep3_41cde18b.html) ====================
  {
    id: '3prep-1',
    code: 1,
    grade: '3prep',
    name: 'دنيا محمد',
    booklet: 'المذكرة',
    deliveryStatus: 'مطلوب',
    phone: '01042901653',
    parentPhone: '01016754409',
    bookingDate: '2027/09/01',
    payments: { m8: '--', m9: '--', m10: '--', m11: '--', m12: '--' },
    weeks: createEmptyWeeks(),
  },
  {
    id: '3prep-2',
    code: 2,
    grade: '3prep',
    name: 'سمر محمد عبدالله',
    booklet: 'المذكرة',
    deliveryStatus: 'استلم',
    phone: '01060332497',
    parentPhone: '01060332497',
    bookingDate: '2027/09/01',
    payments: { m8: '--', m9: '170', m10: '170', m11: '170', m12: '--' },
    weeks: toPairs([
      false, false, false, false, false, true, true, true, true, true, true, true, true, true,
      true, true, true, true, false, false, false, false, false, false, false, false, false, false,
    ]),
  },
  {
    id: '3prep-3',
    code: 3,
    grade: '3prep',
    name: 'شهد عاطف',
    booklet: 'المذكرة',
    deliveryStatus: 'استلم',
    phone: '',
    parentPhone: '',
    bookingDate: '',
    payments: { m8: '--', m9: '--', m10: '170', m11: '--', m12: '--' },
    weeks: toPairs([
      false, false, false, false, false, false, false, false, false, false, false, true, false, false,
      true, true, true, true, true, true, true, false, false, false, false, false, false, false,
    ]),
  },
  {
    id: '3prep-4',
    code: 4,
    grade: '3prep',
    name: 'رشا عمرو محمد',
    booklet: 'المذكرة',
    deliveryStatus: 'استلم',
    phone: '',
    parentPhone: '',
    bookingDate: '',
    payments: { m8: '--', m9: '--', m10: '--', m11: '--', m12: '--' },
    weeks: toPairs([
      false, false, false, false, false, false, false, false, false, false, false, false, false, true,
      true, true, true, true, true, true, true, false, false, false, false, false, false, false,
    ]),
  },
];
