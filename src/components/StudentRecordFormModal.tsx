import React, { useState, useEffect } from 'react';
import { X, Check, Calendar, Phone, BookOpen, Wallet, CheckSquare, RotateCcw } from 'lucide-react';
import { BookletStatus, DeliveryStatus, StudentGradeKey, StudentRecord } from '../types';
import { ATTACHED_SHEET_FILES, createEmptyWeeks, MONTH_COLUMNS, WEEK_LABELS_AR } from '../data/studentRecordsData';
import { calculateAttendanceCount, calculateTotalPaid, getDefaultBooklet, getDefaultFee } from '../utils/sheetParser';

interface StudentRecordFormModalProps {
  isOpen: boolean;
  mode: 'create' | 'edit';
  initialRecord?: StudentRecord | null;
  defaultGrade: StudentGradeKey;
  nextCodeByGrade: Record<StudentGradeKey, number>;
  onClose: () => void;
  onSave: (record: StudentRecord) => void;
}

export const StudentRecordFormModal: React.FC<StudentRecordFormModalProps> = ({
  isOpen,
  mode,
  initialRecord,
  defaultGrade,
  nextCodeByGrade,
  onClose,
  onSave,
}) => {
  const [grade, setGrade] = useState<StudentGradeKey>(defaultGrade);
  const [code, setCode] = useState<number>(nextCodeByGrade[defaultGrade] || 1);
  const [name, setName] = useState('');
  const [booklet, setBooklet] = useState<BookletStatus>(getDefaultBooklet(defaultGrade));
  const [deliveryStatus, setDeliveryStatus] = useState<DeliveryStatus>('مطلوب');
  const [phone, setPhone] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [payments, setPayments] = useState({
    m8: '--',
    m9: '--',
    m10: '--',
    m11: '--',
    m12: '--',
  });
  const [weeks, setWeeks] = useState<[boolean, boolean][]>(createEmptyWeeks());
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setError(null);
    if (mode === 'edit' && initialRecord) {
      setGrade(initialRecord.grade);
      setCode(initialRecord.code);
      setName(initialRecord.name);
      setBooklet(initialRecord.booklet);
      setDeliveryStatus(initialRecord.deliveryStatus);
      setPhone(initialRecord.phone);
      setParentPhone(initialRecord.parentPhone);
      setBookingDate(initialRecord.bookingDate);
      setPayments({ ...initialRecord.payments });
      setWeeks(initialRecord.weeks.map(([a, b]) => [a, b] as [boolean, boolean]));
      setNotes(initialRecord.notes || '');
    } else {
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const dd = String(today.getDate()).padStart(2, '0');
      setGrade(defaultGrade);
      setCode(nextCodeByGrade[defaultGrade] || 1);
      setName('');
      setBooklet(getDefaultBooklet(defaultGrade));
      setDeliveryStatus('مطلوب');
      setPhone('');
      setParentPhone('');
      setBookingDate(`${yyyy}/${mm}/${dd}`);
      setPayments({ m8: '--', m9: '--', m10: '--', m11: '--', m12: '--' });
      setWeeks(createEmptyWeeks());
      setNotes('');
    }
  }, [isOpen, mode, initialRecord, defaultGrade, nextCodeByGrade]);

  if (!isOpen) return null;

  const handleGradeChange = (newGrade: StudentGradeKey) => {
    setGrade(newGrade);
    if (mode === 'create') {
      setCode(nextCodeByGrade[newGrade] || 1);
      setBooklet(getDefaultBooklet(newGrade));
    }
  };

  const toggleWeekSession = (weekIdx: number, sessionIdx: 0 | 1) => {
    setWeeks((prev) =>
      prev.map((pair, idx) => {
        if (idx !== weekIdx) return pair;
        const next: [boolean, boolean] = [pair[0], pair[1]];
        next[sessionIdx] = !next[sessionIdx];
        return next;
      })
    );
  };

  const handleFillDefaultFee = (monthKey: keyof StudentRecord['payments']) => {
    const fee = String(getDefaultFee(grade));
    setPayments((prev) => ({
      ...prev,
      [monthKey]: prev[monthKey] === fee ? '--' : fee,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError('يرجى إدخال اسم الطالب.');
      return;
    }

    const cleanedPayments = {
      m8: payments.m8.trim() || '--',
      m9: payments.m9.trim() || '--',
      m10: payments.m10.trim() || '--',
      m11: payments.m11.trim() || '--',
      m12: payments.m12.trim() || '--',
    };

    const saved: StudentRecord = {
      id: mode === 'edit' && initialRecord ? initialRecord.id : `${grade}-${Date.now()}`,
      code: Number(code) > 0 ? Number(code) : 1,
      grade,
      name: trimmedName,
      booklet,
      deliveryStatus,
      phone: phone.trim(),
      parentPhone: parentPhone.trim(),
      bookingDate: bookingDate.trim(),
      payments: cleanedPayments,
      weeks,
      notes: notes.trim(),
      updatedAt: new Date().toISOString(),
    };

    onSave(saved);
    onClose();
  };

  const defaultFee = getDefaultFee(grade);
  const totalPaid = calculateTotalPaid(payments);
  const attendance = calculateAttendanceCount(weeks);

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="student-form-modal-title"
    >
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-3xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl my-8 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
          <div>
            <h2 id="student-form-modal-title" className="text-lg font-bold text-slate-900 dark:text-white">
              {mode === 'create' ? 'إضافة سجل طالب جديد' : `تعديل بيانات: ${initialRecord?.name}`}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              نفس هيكل ملفات المجموعات المرفقة (البيانات، المذكرة، المدفوعات الشهرية، وحضور 14 أسبوع)
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[78vh] overflow-y-auto">
          {error && (
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-xs font-semibold text-red-700 dark:text-red-300">
              {error}
            </div>
          )}

          {/* Section 1: Basic Info */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#0EA5E9]" />
              <span>البيانات الأساسية والصف الدراسي</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
              <div className="sm:col-span-5">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  الصف الدراسي
                </label>
                <select
                  value={grade}
                  onChange={(e) => handleGradeChange(e.target.value as StudentGradeKey)}
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#0EA5E9]"
                >
                  <optgroup label="المرحلة الابتدائية">
                    {ATTACHED_SHEET_FILES.filter((f) => f.stage === 'primary').map((f) => (
                      <option key={f.grade} value={f.grade}>
                        {f.labelAr} ({f.defaultFee} ج.م)
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="المرحلة الإعدادية">
                    {ATTACHED_SHEET_FILES.filter((f) => f.stage === 'prep').map((f) => (
                      <option key={f.grade} value={f.grade}>
                        {f.labelAr} ({f.defaultFee} ج.م)
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  رقم المسلسل
                </label>
                <input
                  type="number"
                  min={1}
                  required
                  value={code}
                  onChange={(e) => setCode(Number(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white tabular-nums focus:outline-none focus:border-[#0EA5E9]"
                />
              </div>

              <div className="sm:col-span-5">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  اسم الطالب بالكامل *
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: أحمد محمد محمود"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#0EA5E9]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  المذكرة / الكتاب
                </label>
                <select
                  value={booklet}
                  onChange={(e) => setBooklet(e.target.value as BookletStatus)}
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#0EA5E9]"
                >
                  <option value="كتاب سلاح التلميذ">كتاب سلاح التلميذ</option>
                  <option value="المذكرة">المذكرة</option>
                  <option value="غير مشترك">غير مشترك</option>
                  <option value="-">غير محدد (-)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  حالة الإستلام
                </label>
                <select
                  value={deliveryStatus}
                  onChange={(e) => setDeliveryStatus(e.target.value as DeliveryStatus)}
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#0EA5E9]"
                >
                  <option value="استلم">استلم</option>
                  <option value="مطلوب">مطلوب</option>
                  <option value="-">غير محدد (-)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>تاريخ الحجز</span>
                </label>
                <input
                  type="text"
                  dir="ltr"
                  placeholder="2026/09/01"
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white tabular-nums text-left focus:outline-none focus:border-[#0EA5E9]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>تليفون الطالب (واتساب)</span>
                </label>
                <input
                  type="tel"
                  dir="ltr"
                  placeholder="010xxxxxxxx"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white tabular-nums text-left focus:outline-none focus:border-[#0EA5E9]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>تليفون ولي الأمر</span>
                </label>
                <input
                  type="tel"
                  dir="ltr"
                  placeholder="012xxxxxxxx"
                  value={parentPhone}
                  onChange={(e) => setParentPhone(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white tabular-nums text-left focus:outline-none focus:border-[#0EA5E9]"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Monthly Payments */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-2">
                <Wallet className="w-4 h-4 text-[#0EA5E9]" />
                <span>المدفوعات الشهرية (شهور 8 إلى 12)</span>
              </h3>
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 tabular-nums">
                الإجمالي: {totalPaid} ج.م
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {MONTH_COLUMNS.map((m) => (
                <div key={m.key} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      {m.labelAr}
                    </label>
                    <button
                      type="button"
                      onClick={() => handleFillDefaultFee(m.key)}
                      className="text-[11px] font-medium text-[#0EA5E9] hover:underline tabular-nums"
                      title={`تعيين ${defaultFee} ج.م`}
                    >
                      +{defaultFee}
                    </button>
                  </div>
                  <input
                    type="text"
                    dir="ltr"
                    value={payments[m.key]}
                    onChange={(e) =>
                      setPayments((prev) => ({ ...prev, [m.key]: e.target.value }))
                    }
                    placeholder="--"
                    className="w-full px-2.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-center text-slate-900 dark:text-white tabular-nums focus:outline-none focus:border-[#0EA5E9]"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: 14-Week Attendance Grid */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-[#0EA5E9]" />
                <span>سجل الحضور الأسبوعي ({attendance.attended} / {attendance.total} حصة · {attendance.percentage}%)</span>
              </h3>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setWeeks(Array.from({ length: 14 }, () => [true, true] as [boolean, boolean]))}
                  className="px-2.5 py-1 text-xs font-medium rounded-md border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  تحديد الكل
                </button>
                <button
                  type="button"
                  onClick={() => setWeeks(createEmptyWeeks())}
                  className="px-2.5 py-1 text-xs font-medium rounded-md border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>مسح</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
              {WEEK_LABELS_AR.map((label, wIdx) => (
                <div
                  key={label}
                  className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 space-y-1.5 text-center"
                >
                  <span className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 tabular-nums">
                    {label}
                  </span>
                  <div className="flex items-center justify-center gap-2">
                    {([0, 1] as const).map((sIdx) => {
                      const checked = weeks[wIdx]?.[sIdx] ?? false;
                      return (
                        <button
                          key={sIdx}
                          type="button"
                          onClick={() => toggleWeekSession(wIdx, sIdx)}
                          className={`w-7 h-7 rounded-md border text-[11px] font-bold flex items-center justify-center transition-colors ${
                            checked
                              ? 'bg-[#0EA5E9] border-[#0EA5E9] text-white'
                              : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-400 hover:border-[#0EA5E9]'
                          }`}
                          title={`${label} - حصة ${sIdx + 1}`}
                        >
                          {checked ? <Check className="w-3.5 h-3.5" /> : sIdx + 1}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              ملاحظات إضافية (اختياري)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="أي ملاحظات حول المستوى الدراسي، مواعيد الحضور، أو المدفوعات..."
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#0EA5E9]"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-[#0EA5E9] hover:bg-[#0284C7] text-white text-xs font-bold transition-colors"
            >
              {mode === 'create' ? 'حفظ وإضافة الطالب' : 'حفظ التعديلات'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
