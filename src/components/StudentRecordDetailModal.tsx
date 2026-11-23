import React from 'react';
import { X, Phone, MessageCircle, Calendar, Check, Edit3, Trash2, BookOpen, CheckCircle2, Clock } from 'lucide-react';
import { StudentRecord } from '../types';
import { MONTH_COLUMNS, WEEK_LABELS_AR } from '../data/studentRecordsData';
import {
  calculateAttendanceCount,
  calculateTotalPaid,
  formatWhatsAppUrl,
  getDefaultFee,
  getGradeLabel,
  parsePaymentAmount,
} from '../utils/sheetParser';

interface StudentRecordDetailModalProps {
  record: StudentRecord | null;
  onClose: () => void;
  onEdit: (record: StudentRecord) => void;
  onRequestDelete: (record: StudentRecord) => void;
  onToggleAttendance: (recordId: string, weekIdx: number, sessionIdx: 0 | 1) => void;
  onToggleDeliveryStatus?: (recordId: string) => void;
}

export const StudentRecordDetailModal: React.FC<StudentRecordDetailModalProps> = ({
  record,
  onClose,
  onEdit,
  onRequestDelete,
  onToggleAttendance,
  onToggleDeliveryStatus,
}) => {
  if (!record) return null;

  const totalPaid = calculateTotalPaid(record.payments);
  const defaultFee = getDefaultFee(record.grade);
  const attendance = calculateAttendanceCount(record.weeks);
  const studentWa = formatWhatsAppUrl(record.phone);
  const parentWa = formatWhatsAppUrl(record.parentPhone);

  const paidMonthsList = MONTH_COLUMNS.filter((m) => parsePaymentAmount(record.payments[m.key]) > 0)
    .map((m) => `${m.labelAr} (${record.payments[m.key]} ج.م)`)
    .join('، ');

  const summaryText = encodeURIComponent(
    `مرحباً، متابعة الطالب/ة: ${record.name}\n` +
      `الصف: ${getGradeLabel(record.grade)}\n` +
      `المذكرة / الكتاب: ${record.booklet} (${record.deliveryStatus})\n` +
      `الحضور المسجل: ${attendance.attended} من ${attendance.total} حصة (${attendance.percentage}%)\n` +
      `إجمالي المدفوعات: ${totalPaid} ج.م${paidMonthsList ? ` (${paidMonthsList})` : ''}`
  );

  const studentWaWithReport = studentWa ? `${studentWa}?text=${summaryText}` : null;
  const parentWaWithReport = parentWa ? `${parentWa}?text=${summaryText}` : null;

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="student-detail-modal-title"
    >
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl my-8 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span className="tabular-nums font-semibold">كود #{record.code}</span>
              <span aria-hidden="true">·</span>
              <span>{getGradeLabel(record.grade)}</span>
              <span aria-hidden="true">·</span>
              <span>الاشتراك الشهري: {defaultFee} ج.م</span>
            </div>
            <h2
              id="student-detail-modal-title"
              className="text-xl font-bold text-slate-900 dark:text-white mt-1 truncate"
            >
              {record.name}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Summary Metrics Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pb-5 border-b border-slate-200 dark:border-slate-800">
            <div>
              <span className="block text-xs text-slate-500 dark:text-slate-400">إجمالي المدفوع</span>
              <span className="block text-xl font-bold text-slate-900 dark:text-white tabular-nums mt-1">
                {totalPaid} ج.م
              </span>
            </div>
            <div>
              <span className="block text-xs text-slate-500 dark:text-slate-400">الحضور الكلي</span>
              <span className="block text-xl font-bold text-slate-900 dark:text-white tabular-nums mt-1">
                {attendance.attended} / {attendance.total}
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400 mr-1.5">
                  ({attendance.percentage}%)
                </span>
              </span>
            </div>
            <div>
              <span className="block text-xs text-slate-500 dark:text-slate-400">المذكرة / الاستلام</span>
              <button
                type="button"
                onClick={() => onToggleDeliveryStatus?.(record.id)}
                className="mt-1.5 inline-flex items-center gap-1.5 text-xs font-bold hover:underline"
                title="اضغط لتبديل حالة الاستلام"
              >
                {record.deliveryStatus === 'استلم' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                ) : record.deliveryStatus === 'مطلوب' ? (
                  <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                ) : null}
                <span
                  className={
                    record.deliveryStatus === 'استلم'
                      ? 'text-emerald-700 dark:text-emerald-400'
                      : record.deliveryStatus === 'مطلوب'
                      ? 'text-amber-700 dark:text-amber-400'
                      : 'text-slate-500'
                  }
                >
                  {record.deliveryStatus} · {record.booklet}
                </span>
              </button>
            </div>
            <div>
              <span className="block text-xs text-slate-500 dark:text-slate-400">تاريخ الحجز</span>
              <span className="block text-base font-bold text-slate-900 dark:text-white tabular-nums mt-1.5" dir="ltr">
                {record.bookingDate || 'غير مسجل'}
              </span>
            </div>
          </div>

          {/* Contact Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
              <div>
                <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5" />
                  <span>تليفون الطالب</span>
                </span>
                <span className="block text-sm font-semibold text-slate-900 dark:text-white tabular-nums mt-1" dir="ltr">
                  {record.phone || 'غير مسجل'}
                </span>
              </div>
              {studentWaWithReport && (
                <a
                  href={studentWaWithReport}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0"
                  title="إرسال تقرير المتابعة عبر واتساب"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>واتساب</span>
                </a>
              )}
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
              <div>
                <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5" />
                  <span>تليفون ولي الأمر</span>
                </span>
                <span className="block text-sm font-semibold text-slate-900 dark:text-white tabular-nums mt-1" dir="ltr">
                  {record.parentPhone || 'غير مسجل'}
                </span>
              </div>
              {parentWaWithReport && (
                <a
                  href={parentWaWithReport}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0"
                  title="إرسال تقرير المتابعة لولي الأمر عبر واتساب"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>إرسال تقرير</span>
                </a>
              )}
            </div>
          </div>

          {/* Monthly Payments Breakdown */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#0EA5E9]" />
              <span>تفاصيل المدفوعات الشهرية</span>
            </h3>
            <div className="grid grid-cols-5 gap-2">
              {MONTH_COLUMNS.map((m) => {
                const raw = record.payments[m.key];
                const isPaid = parsePaymentAmount(raw) > 0;
                return (
                  <div
                    key={m.key}
                    className={`p-2.5 rounded-lg border text-center ${
                      isPaid
                        ? 'border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/70 dark:bg-emerald-950/30'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40'
                    }`}
                  >
                    <span className="block text-[11px] text-slate-500 dark:text-slate-400">{m.labelAr}</span>
                    <span
                      className={`block text-sm font-bold tabular-nums mt-0.5 ${
                        isPaid ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-400'
                      }`}
                    >
                      {isPaid ? `${raw} ج.م` : '--'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 14 Weeks Attendance (Live Toggleable) */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-[#0EA5E9]" />
                <span>جدول الحضور لـ 14 أسبوع (اضغط للتبديل المباشر)</span>
              </h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
              {WEEK_LABELS_AR.map((label, wIdx) => (
                <div
                  key={label}
                  className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-center space-y-1.5"
                >
                  <span className="block text-[11px] font-medium text-slate-600 dark:text-slate-300 tabular-nums">
                    الأسبوع {wIdx + 1}
                  </span>
                  <div className="flex items-center justify-center gap-1.5">
                    {([0, 1] as const).map((sIdx) => {
                      const checked = record.weeks[wIdx]?.[sIdx] ?? false;
                      return (
                        <button
                          key={sIdx}
                          type="button"
                          onClick={() => onToggleAttendance(record.id, wIdx, sIdx)}
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

          {record.notes && (
            <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
              <span className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">ملاحظات</span>
              <p className="text-sm text-slate-800 dark:text-slate-200">{record.notes}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => {
              onClose();
              onRequestDelete(record);
            }}
            className="px-3.5 py-2 rounded-lg text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>حذف السجل</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              إغلاق
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onEdit(record);
              }}
              className="px-4 py-2 rounded-lg bg-[#0EA5E9] hover:bg-[#0284C7] text-white text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>تعديل البيانات</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
