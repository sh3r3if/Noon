import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Search,
  Plus,
  Edit3,
  Trash2,
  Eye,
  Download,
  Upload,
  RefreshCw,
  MessageCircle,
  ChevronRight,
  ChevronLeft,
  ChevronsRight,
  ChevronsLeft,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Check,
  X,
  FileSpreadsheet,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Users,
  Wallet,
  CalendarCheck2,
  BookOpen,
  FileJson,
  FileCode2,
  Printer,
  UserPlus,
} from 'lucide-react';
import { BookletStatus, DeliveryStatus, StudentGradeKey, StudentRecord } from '../types';
import {
  ATTACHED_SHEET_FILES,
  createEmptyWeeks,
  initialStudentRecords,
  MONTH_COLUMNS,
  WEEK_LABELS_AR,
} from '../data/studentRecordsData';
import {
  calculateAttendanceCount,
  calculateTotalPaid,
  exportRecordsToCsv,
  exportRecordsToJson,
  exportRecordsToSheetHtml,
  fetchAllAttachedSheets,
  formatWhatsAppUrl,
  getDefaultBooklet,
  getDefaultFee,
  getGradeLabel,
  inferGradeFromText,
  parseCsvRecords,
  parseGoogleSheetHtml,
  parsePaymentAmount,
} from '../utils/sheetParser';
import { StudentRecordFormModal } from './StudentRecordFormModal';
import { StudentRecordDetailModal } from './StudentRecordDetailModal';

interface StudentRecordsCRUDProps {
  onNotify?: (msg: string) => void;
}

const STORAGE_KEY_V2 = 'noon_student_records_v2';
const STORAGE_KEY_V1 = 'noon_student_records_v1';

type SortField = 'code' | 'name' | 'grade' | 'deliveryStatus' | 'bookingDate' | 'totalPaid' | 'attendance';
type SortDirection = 'asc' | 'desc';
type ViewMode = 'overview' | 'attendance' | 'full';

function loadInitialRecords(): StudentRecord[] {
  try {
    const savedV2 = localStorage.getItem(STORAGE_KEY_V2);
    if (savedV2) {
      const parsed = JSON.parse(savedV2);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
    const savedV1 = localStorage.getItem(STORAGE_KEY_V1);
    if (savedV1) {
      const parsedV1 = JSON.parse(savedV1);
      if (Array.isArray(parsedV1) && parsedV1.length > 0) {
        const primarySeeds = initialStudentRecords.filter(
          (r) => r.grade === '4prim' || r.grade === '5prim' || r.grade === '6prim'
        );
        return [...primarySeeds, ...parsedV1];
      }
    }
  } catch {
    // Fall back to pre-parsed seed data from all 6 attached HTML files
  }
  return initialStudentRecords;
}

export const StudentRecordsCRUD: React.FC<StudentRecordsCRUDProps> = ({ onNotify }) => {
  const [records, setRecords] = useState<StudentRecord[]>(loadInitialRecords);

  // Search, Filters, Sorting, View Mode
  const [searchQuery, setSearchQuery] = useState('');
  const [gradeFilter, setGradeFilter] = useState<'all' | StudentGradeKey>('all');
  const [deliveryFilter, setDeliveryFilter] = useState<'all' | DeliveryStatus>('all');
  const [paymentFilter, setPaymentFilter] = useState<'all' | 'paid' | 'unpaid'>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('overview');
  const [sortField, setSortField] = useState<SortField>('grade');
  const [sortDir, setSortDir] = useState<SortDirection>('asc');

  // Quick-add row bar
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [quickName, setQuickName] = useState('');
  const [quickGrade, setQuickGrade] = useState<StudentGradeKey>('4prim');
  const [quickPhone, setQuickPhone] = useState('');
  const [quickParentPhone, setQuickParentPhone] = useState('');
  const [quickDelivery, setQuickDelivery] = useState<DeliveryStatus>('استلم');

  // Bulk Roll-Call controls (for quick attendance marking)
  const [rollCallWeek, setRollCallWeek] = useState<number>(0);
  const [rollCallSession, setRollCallSession] = useState<0 | 1>(0);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);

  // Selection & Modals
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [editingRecord, setEditingRecord] = useState<StudentRecord | null>(null);
  const [viewingRecordId, setViewingRecordId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<
    { type: 'single'; record: StudentRecord } | { type: 'bulk'; ids: string[] } | null
  >(null);

  // Inline payment editing state
  const [editingPaymentCell, setEditingPaymentCell] = useState<{
    recordId: string;
    monthKey: keyof StudentRecord['payments'];
    value: string;
    defaultFee: number;
  } | null>(null);

  // Sync / Loading state
  const [isSyncing, setIsSyncing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_V2, JSON.stringify(records));
    } catch {
      // Ignore storage quota issues
    }
  }, [records]);

  // Keep quickAdd grade synced to active sheet tab
  useEffect(() => {
    if (gradeFilter !== 'all') {
      setQuickGrade(gradeFilter);
    }
  }, [gradeFilter]);

  // Reset to page 1 when filters/search/pageSize change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, gradeFilter, deliveryFilter, paymentFilter, pageSize]);

  // Counts per grade for sheet tabs
  const gradeCounts = useMemo(() => {
    const counts: Record<'all' | StudentGradeKey, number> = {
      all: records.length,
      '4prim': 0,
      '5prim': 0,
      '6prim': 0,
      '1prep': 0,
      '2prep': 0,
      '3prep': 0,
    };
    for (const r of records) {
      counts[r.grade] = (counts[r.grade] || 0) + 1;
    }
    return counts;
  }, [records]);

  // Next available code per grade
  const nextCodeByGrade = useMemo(() => {
    const maxMap: Record<StudentGradeKey, number> = {
      '4prim': 0,
      '5prim': 0,
      '6prim': 0,
      '1prep': 0,
      '2prep': 0,
      '3prep': 0,
    };
    for (const r of records) {
      if (r.code > maxMap[r.grade]) {
        maxMap[r.grade] = r.code;
      }
    }
    return {
      '4prim': maxMap['4prim'] + 1,
      '5prim': maxMap['5prim'] + 1,
      '6prim': maxMap['6prim'] + 1,
      '1prep': maxMap['1prep'] + 1,
      '2prep': maxMap['2prep'] + 1,
      '3prep': maxMap['3prep'] + 1,
    };
  }, [records]);

  const gradeOrder: Record<StudentGradeKey, number> = {
    '4prim': 1,
    '5prim': 2,
    '6prim': 3,
    '1prep': 4,
    '2prep': 5,
    '3prep': 6,
  };

  // Filtered & Sorted Data
  const filteredRecords = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    const filtered = records.filter((r) => {
      if (gradeFilter !== 'all' && r.grade !== gradeFilter) return false;
      if (deliveryFilter !== 'all' && r.deliveryStatus !== deliveryFilter) return false;

      if (paymentFilter !== 'all') {
        const total = calculateTotalPaid(r.payments);
        if (paymentFilter === 'paid' && total <= 0) return false;
        if (paymentFilter === 'unpaid' && total > 0) return false;
      }

      if (q) {
        const haystack = [
          String(r.code),
          r.name,
          getGradeLabel(r.grade),
          r.phone,
          r.parentPhone,
          r.bookingDate,
          r.booklet,
          r.deliveryStatus,
          r.payments.m8,
          r.payments.m9,
          r.payments.m10,
          r.payments.m11,
          r.payments.m12,
          r.notes || '',
        ]
          .join(' ')
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }

      return true;
    });

    const sorted = [...filtered].sort((a, b) => {
      let cmp = 0;
      switch (sortField) {
        case 'code':
          cmp = a.code - b.code || gradeOrder[a.grade] - gradeOrder[b.grade];
          break;
        case 'name':
          cmp = a.name.localeCompare(b.name, 'ar');
          break;
        case 'grade':
          cmp = gradeOrder[a.grade] - gradeOrder[b.grade] || a.code - b.code;
          break;
        case 'deliveryStatus':
          cmp = a.deliveryStatus.localeCompare(b.deliveryStatus, 'ar');
          break;
        case 'bookingDate':
          cmp = (a.bookingDate || '').localeCompare(b.bookingDate || '');
          break;
        case 'totalPaid':
          cmp = calculateTotalPaid(a.payments) - calculateTotalPaid(b.payments);
          break;
        case 'attendance':
          cmp = calculateAttendanceCount(a.weeks).attended - calculateAttendanceCount(b.weeks).attended;
          break;
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });

    return sorted;
  }, [records, searchQuery, gradeFilter, deliveryFilter, paymentFilter, sortField, sortDir]);

  // Pagination slice
  const totalItems = filteredRecords.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const startIdx = (safePage - 1) * pageSize;
  const endIdx = Math.min(startIdx + pageSize, totalItems);
  const paginatedRecords = useMemo(
    () => filteredRecords.slice(startIdx, endIdx),
    [filteredRecords, startIdx, endIdx]
  );

  // KPI Metrics & Monthly Column Totals (reflect current filtered scope)
  const kpiStats = useMemo(() => {
    const scope = filteredRecords;
    const delivered = scope.filter((r) => r.deliveryStatus === 'استلم').length;
    const pending = scope.filter((r) => r.deliveryStatus === 'مطلوب').length;
    const totalCollected = scope.reduce((sum, r) => sum + calculateTotalPaid(r.payments), 0);
    const paidStudents = scope.filter((r) => calculateTotalPaid(r.payments) > 0).length;
    const totalAttended = scope.reduce((sum, r) => sum + calculateAttendanceCount(r.weeks).attended, 0);
    const avgAttendancePct =
      scope.length > 0
        ? Math.round(
            scope.reduce((sum, r) => sum + calculateAttendanceCount(r.weeks).percentage, 0) / scope.length
          )
        : 0;

    const monthTotals = {
      m8: scope.reduce((s, r) => s + parsePaymentAmount(r.payments.m8), 0),
      m9: scope.reduce((s, r) => s + parsePaymentAmount(r.payments.m9), 0),
      m10: scope.reduce((s, r) => s + parsePaymentAmount(r.payments.m10), 0),
      m11: scope.reduce((s, r) => s + parsePaymentAmount(r.payments.m11), 0),
      m12: scope.reduce((s, r) => s + parsePaymentAmount(r.payments.m12), 0),
    };

    const primaryCount = gradeCounts['4prim'] + gradeCounts['5prim'] + gradeCounts['6prim'];
    const prepCount = gradeCounts['1prep'] + gradeCounts['2prep'] + gradeCounts['3prep'];

    return {
      total: scope.length,
      delivered,
      pending,
      totalCollected,
      paidStudents,
      totalAttended,
      avgAttendancePct,
      monthTotals,
      primaryCount,
      prepCount,
    };
  }, [filteredRecords, gradeCounts]);

  // Handlers
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />;
    return sortDir === 'asc' ? (
      <ArrowUp className="w-3.5 h-3.5 text-[#0EA5E9]" />
    ) : (
      <ArrowDown className="w-3.5 h-3.5 text-[#0EA5E9]" />
    );
  };

  const handleOpenCreate = () => {
    setFormMode('create');
    setEditingRecord(null);
    setFormOpen(true);
  };

  const handleOpenEdit = (record: StudentRecord) => {
    setFormMode('edit');
    setEditingRecord(record);
    setFormOpen(true);
  };

  const handleSaveRecord = (saved: StudentRecord) => {
    if (formMode === 'create') {
      setRecords((prev) => [saved, ...prev]);
      onNotify?.(`تمت إضافة الطالب "${saved.name}" بنجاح`);
    } else {
      setRecords((prev) => prev.map((r) => (r.id === saved.id ? saved : r)));
      onNotify?.(`تم تحديث بيانات "${saved.name}" بنجاح`);
    }
  };

  const handleQuickAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = quickName.trim();
    if (!trimmed) return;
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');

    const newRec: StudentRecord = {
      id: `${quickGrade}-${Date.now()}`,
      code: nextCodeByGrade[quickGrade] || 1,
      grade: quickGrade,
      name: trimmed,
      booklet: getDefaultBooklet(quickGrade),
      deliveryStatus: quickDelivery,
      phone: quickPhone.trim(),
      parentPhone: quickParentPhone.trim(),
      bookingDate: `${yyyy}/${mm}/${dd}`,
      payments: { m8: '--', m9: '--', m10: '--', m11: '--', m12: '--' },
      weeks: createEmptyWeeks(),
      updatedAt: new Date().toISOString(),
    };

    setRecords((prev) => [newRec, ...prev]);
    setQuickName('');
    setQuickPhone('');
    setQuickParentPhone('');
    onNotify?.(`تمت إضافة "${newRec.name}" إلى ${getGradeLabel(quickGrade, true)}`);
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    if (deleteTarget.type === 'single') {
      const targetId = deleteTarget.record.id;
      setRecords((prev) => prev.filter((r) => r.id !== targetId));
      setSelectedIds((prev) => {
        const next = new Set(prev);
        next.delete(targetId);
        return next;
      });
      onNotify?.(`تم حذف سجل الطالب "${deleteTarget.record.name}"`);
    } else {
      const idSet = new Set(deleteTarget.ids);
      setRecords((prev) => prev.filter((r) => !idSet.has(r.id)));
      setSelectedIds(new Set());
      onNotify?.(`تم حذف ${deleteTarget.ids.length} سجل بنجاح`);
    }
    setDeleteTarget(null);
  };

  const handleCycleDeliveryStatus = (recordId: string) => {
    const order: DeliveryStatus[] = ['استلم', 'مطلوب', '-'];
    setRecords((prev) =>
      prev.map((r) => {
        if (r.id !== recordId) return r;
        const nextStatus = order[(order.indexOf(r.deliveryStatus) + 1) % order.length];
        return { ...r, deliveryStatus: nextStatus, updatedAt: new Date().toISOString() };
      })
    );
  };

  const handleCycleBooklet = (recordId: string) => {
    const order: BookletStatus[] = ['كتاب سلاح التلميذ', 'المذكرة', 'غير مشترك', '-'];
    setRecords((prev) =>
      prev.map((r) => {
        if (r.id !== recordId) return r;
        const idx = order.indexOf(r.booklet);
        const nextBooklet = order[(idx + 1) % order.length];
        return { ...r, booklet: nextBooklet, updatedAt: new Date().toISOString() };
      })
    );
  };

  const handleCommitInlinePayment = (overrideValue?: string) => {
    if (!editingPaymentCell) return;
    const { recordId, monthKey, value } = editingPaymentCell;
    const finalVal = (overrideValue !== undefined ? overrideValue : value).trim() || '--';
    setRecords((prev) =>
      prev.map((r) =>
        r.id === recordId
          ? {
              ...r,
              payments: { ...r.payments, [monthKey]: finalVal },
              updatedAt: new Date().toISOString(),
            }
          : r
      )
    );
    setEditingPaymentCell(null);
  };

  const handleToggleAttendance = (recordId: string, weekIdx: number, sessionIdx: 0 | 1) => {
    setRecords((prev) =>
      prev.map((r) => {
        if (r.id !== recordId) return r;
        const nextWeeks = r.weeks.map((pair, idx) => {
          if (idx !== weekIdx) return pair;
          const updated: [boolean, boolean] = [pair[0], pair[1]];
          updated[sessionIdx] = !updated[sessionIdx];
          return updated;
        });
        return { ...r, weeks: nextWeeks, updatedAt: new Date().toISOString() };
      })
    );
  };

  const handleBulkRollCall = (present: boolean) => {
    const targetIds =
      selectedIds.size > 0 ? selectedIds : new Set(filteredRecords.map((r) => r.id));
    if (targetIds.size === 0) return;

    setRecords((prev) =>
      prev.map((r) => {
        if (!targetIds.has(r.id)) return r;
        const nextWeeks = r.weeks.map((pair, idx) => {
          if (idx !== rollCallWeek) return pair;
          const updated: [boolean, boolean] = [pair[0], pair[1]];
          updated[rollCallSession] = present;
          return updated;
        });
        return { ...r, weeks: nextWeeks, updatedAt: new Date().toISOString() };
      })
    );

    onNotify?.(
      `تم تسجيل ${present ? 'حضور' : 'غياب'} (${WEEK_LABELS_AR[rollCallWeek]} - حصة ${rollCallSession + 1}) لـ ${targetIds.size} طالب`
    );
  };

  const handleToggleRowSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const allOnPageSelected =
    paginatedRecords.length > 0 && paginatedRecords.every((r) => selectedIds.has(r.id));

  const handleTogglePageSelectAll = () => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (allOnPageSelected) {
        paginatedRecords.forEach((r) => next.delete(r.id));
      } else {
        paginatedRecords.forEach((r) => next.add(r.id));
      }
      return next;
    });
  };

  const handleBulkDeliveryStatus = (status: DeliveryStatus) => {
    setRecords((prev) =>
      prev.map((r) => (selectedIds.has(r.id) ? { ...r, deliveryStatus: status } : r))
    );
    onNotify?.(`تم تحديث حالة الاستلام إلى "${status}" لـ ${selectedIds.size} طالب`);
    setSelectedIds(new Set());
  };

  const handleSyncFromAttachedFiles = async () => {
    setIsSyncing(true);
    try {
      const liveRecords = await fetchAllAttachedSheets();
      if (liveRecords.length > 0) {
        setRecords(liveRecords);
        setSelectedIds(new Set());
        onNotify?.(`تمت مزامنة ${liveRecords.length} سجل من جميع الملفات المرفقة (Prim4-6 & Prep1-3)`);
      } else {
        setRecords(initialStudentRecords);
        onNotify?.('تمت استعادة البيانات الافتراضية من الملفات المرفقة');
      }
    } catch {
      setRecords(initialStudentRecords);
      onNotify?.('تمت استعادة البيانات الأصلية من الملفات المرفقة');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const ext = file.name.split('.').pop()?.toLowerCase();
    const targetGrade: StudentGradeKey = gradeFilter === 'all' ? '4prim' : gradeFilter;

    try {
      const text = await file.text();
      let imported: StudentRecord[] = [];

      if (ext === 'html' || ext === 'htm') {
        const inferredGrade = inferGradeFromText(file.name, targetGrade);
        imported = parseGoogleSheetHtml(text, inferredGrade);
      } else if (ext === 'csv') {
        imported = parseCsvRecords(text, targetGrade);
      } else if (ext === 'json') {
        const parsed = JSON.parse(text);
        if (Array.isArray(parsed)) {
          imported = parsed.filter((item) => item && typeof item.name === 'string');
        }
      }

      if (imported.length > 0) {
        setRecords((prev) => [...imported, ...prev]);
        onNotify?.(`تم استيراد ${imported.length} سجل من الملف "${file.name}" بنجاح`);
      } else {
        onNotify?.('لم يتم العثور على سجلات صالحة في الملف المختار');
      }
    } catch {
      onNotify?.('تعذر قراءة الملف. تأكد من اختيار ملف HTML أو CSV أو JSON صالح');
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setGradeFilter('all');
    setDeliveryFilter('all');
    setPaymentFilter('all');
  };

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    gradeFilter !== 'all' ||
    deliveryFilter !== 'all' ||
    paymentFilter !== 'all';

  // Generate pagination page list with ellipsis
  const pageNumbers = useMemo(() => {
    const pages: (number | 'ellipsis')[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (safePage > 3) pages.push('ellipsis');
      const start = Math.max(2, safePage - 1);
      const end = Math.min(totalPages - 1, safePage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (safePage < totalPages - 2) pages.push('ellipsis');
      pages.push(totalPages);
    }
    return pages;
  }, [totalPages, safePage]);

  const viewingRecord = useMemo(
    () => (viewingRecordId ? records.find((r) => r.id === viewingRecordId) || null : null),
    [viewingRecordId, records]
  );

  const activeSheetMeta = useMemo(
    () => (gradeFilter === 'all' ? null : ATTACHED_SHEET_FILES.find((s) => s.grade === gradeFilter) || null),
    [gradeFilter]
  );

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Page Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col xl:flex-row xl:items-center justify-between gap-5">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span className="font-semibold text-[#0EA5E9]">نظام شيتات المجموعات المتكامل</span>
            <span aria-hidden="true">·</span>
            <span>الابتدائي (Prim 4–6) والإعدادي (Prep 1–3)</span>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums">{records.length} طالب مسجل</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            {activeSheetMeta ? `سجل طلاب ${activeSheetMeta.labelAr}` : 'سجلات الطلاب والمتابعة الشهرية'}
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
            نفس نظام الملفات المرفقة: متابعة الكتب والمذكرات، حالة الاستلام، روابط واتساب المباشرة، مدفوعات الشهور (8–12)، وحضور 14 أسبوعاً (حصتان أسبوعياً).
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2 shrink-0 print:hidden">
          <input
            ref={fileInputRef}
            type="file"
            accept=".html,.htm,.csv,.json"
            onChange={handleImportFile}
            className="hidden"
          />

          <button
            type="button"
            onClick={handleSyncFromAttachedFiles}
            disabled={isSyncing}
            className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 disabled:opacity-50"
            title="إعادة قراءة ومزامنة جميع ملفات Prim4-6 و Prep1-3 المرفقة"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>مزامنة الملفات</span>
          </button>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>استيراد</span>
          </button>

          <button
            type="button"
            onClick={() => {
              const title = activeSheetMeta ? activeSheetMeta.labelAr : 'جميع الصفوف';
              const fname = activeSheetMeta ? activeSheetMeta.fileName : 'all-students-sheet.html';
              exportRecordsToSheetHtml(filteredRecords, title, fname);
              onNotify?.(`تم تصدير ${filteredRecords.length} سجل بصيغة شيت HTML`);
            }}
            className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0"
            title="تصدير بنفس تنسيق ملفات HTML المرفقة"
          >
            <FileCode2 className="w-3.5 h-3.5" />
            <span>تصدير شيت HTML</span>
          </button>

          <button
            type="button"
            onClick={() => {
              exportRecordsToCsv(filteredRecords);
              onNotify?.(`تم تصدير ${filteredRecords.length} سجل إلى ملف CSV`);
            }}
            className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0"
          >
            <Download className="w-3.5 h-3.5" />
            <span>CSV</span>
          </button>

          <button
            type="button"
            onClick={() => {
              exportRecordsToJson(filteredRecords);
              onNotify?.(`تم تصدير ${filteredRecords.length} سجل بصيغة JSON`);
            }}
            className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0"
            title="تصدير JSON"
          >
            <FileJson className="w-3.5 h-3.5" />
            <span>JSON</span>
          </button>

          <button
            type="button"
            onClick={() => window.print()}
            className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0"
            title="طباعة الكشف الحالي"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>طباعة</span>
          </button>

          <button
            type="button"
            onClick={() => setQuickAddOpen((v) => !v)}
            className={`px-3 py-2 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 ${
              quickAddOpen
                ? 'border-[#0EA5E9] bg-[#0EA5E9]/10 text-[#0EA5E9]'
                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>إضافة سريعة</span>
          </button>

          <button
            type="button"
            onClick={handleOpenCreate}
            className="px-4 py-2 rounded-lg bg-[#0EA5E9] hover:bg-[#0284C7] text-white text-xs font-bold flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة طالب</span>
          </button>
        </div>
      </div>

      {/* KPI Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-1">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-medium">إجمالي الطلاب (نتائج العرض)</span>
            <Users className="w-4 h-4 text-[#0EA5E9]" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white tabular-nums">
            {kpiStats.total}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 tabular-nums">
            الابتدائي: {kpiStats.primaryCount} · الإعدادي: {kpiStats.prepCount}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-1">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-medium">الكتب والمذكرات</span>
            <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white tabular-nums">
            {kpiStats.delivered}{' '}
            <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">استلم</span>
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 tabular-nums">
            مطلوب تسليم: {kpiStats.pending} طالب
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-1">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-medium">إجمالي التحصيل المسجل</span>
            <Wallet className="w-4 h-4 text-[#0EA5E9]" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white tabular-nums">
            {kpiStats.totalCollected.toLocaleString('en-US')}{' '}
            <span className="text-sm font-medium text-slate-500">ج.م</span>
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 tabular-nums">
            {kpiStats.paidStudents} طالب لديهم مدفوعات مسجلة
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-1">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-medium">متوسط الحضور الأسبوعي</span>
            <CalendarCheck2 className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white tabular-nums">
            {kpiStats.avgAttendancePct}%
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 tabular-nums">
            إجمالي الحصص المسجلة: {kpiStats.totalAttended} حصة
          </div>
        </div>
      </div>

      {/* Main DataTable Container */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
        {/* Top Toolbar: 6 Sheet Tabs + View Mode */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
            {/* All 6 Sheet Tabs */}
            <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
              <button
                type="button"
                onClick={() => setGradeFilter('all')}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors whitespace-nowrap shrink-0 tabular-nums ${
                  gradeFilter === 'all'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                جميع الصفوف ({gradeCounts.all})
              </button>
              {ATTACHED_SHEET_FILES.map((sheet) => (
                <button
                  key={sheet.grade}
                  type="button"
                  onClick={() => setGradeFilter(sheet.grade)}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors whitespace-nowrap shrink-0 tabular-nums flex items-center gap-1.5 ${
                    gradeFilter === sheet.grade
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                  title={`${sheet.labelAr} · الاشتراك الافتراضي ${sheet.defaultFee} ج.م`}
                >
                  <FileSpreadsheet
                    className={`w-3.5 h-3.5 ${
                      sheet.stage === 'primary' ? 'text-emerald-600 dark:text-emerald-400' : 'text-[#0EA5E9]'
                    }`}
                  />
                  <span>
                    {sheet.shortLabelAr} ({gradeCounts[sheet.grade]})
                  </span>
                </button>
              ))}
            </div>

            {/* View Mode Segmented Switcher */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg w-fit shrink-0">
              <button
                type="button"
                onClick={() => setViewMode('overview')}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                  viewMode === 'overview'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                البيانات والمدفوعات
              </button>
              <button
                type="button"
                onClick={() => setViewMode('attendance')}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                  viewMode === 'attendance'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                الحضور (14 أسبوع)
              </button>
              <button
                type="button"
                onClick={() => setViewMode('full')}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                  viewMode === 'full'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                العرض الشامل (نفس الشيت)
              </button>
            </div>
          </div>

          {/* Second Toolbar Row: Search Input & Secondary Filters */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 print:hidden">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[240px]">
              <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث بالاسم، رقم التليفون، تليفون ولي الأمر، المذكرة، أو المبلغ..."
                className="w-full pr-10 pl-9 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/70 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-[#0EA5E9] focus:bg-white dark:focus:bg-slate-900 transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                  aria-label="مسح البحث"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Delivery Status & Payment Filters */}
            <div className="flex flex-wrap items-center gap-2.5">
              <select
                value={deliveryFilter}
                onChange={(e) => setDeliveryFilter(e.target.value as 'all' | DeliveryStatus)}
                aria-label="تصفية حسب حالة الاستلام"
                className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none focus:border-[#0EA5E9]"
              >
                <option value="all">حالة الاستلام: الكل</option>
                <option value="استلم">استلم المذكرة / الكتاب</option>
                <option value="مطلوب">مطلوب تسليم</option>
                <option value="-">غير محدد (-)</option>
              </select>

              <select
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value as 'all' | 'paid' | 'unpaid')}
                aria-label="تصفية حسب حالة الدفع"
                className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none focus:border-[#0EA5E9]"
              >
                <option value="all">المدفوعات: الكل</option>
                <option value="paid">سدد شهراً على الأقل</option>
                <option value="unpaid">بدون مدفوعات بعد</option>
              </select>

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="px-3 py-2 rounded-lg text-xs font-semibold text-[#0EA5E9] hover:bg-[#0EA5E9]/10 transition-colors whitespace-nowrap shrink-0"
                >
                  إعادة ضبط الفلاتر
                </button>
              )}
            </div>
          </div>

          {/* Quick Add Inline Bar (Spreadsheet Rapid Entry) */}
          {quickAddOpen && (
            <form
              onSubmit={handleQuickAddSubmit}
              className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-2.5 items-end print:hidden"
            >
              <div className="lg:col-span-3">
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  اسم الطالب *
                </label>
                <input
                  type="text"
                  required
                  value={quickName}
                  onChange={(e) => setQuickName(e.target.value)}
                  placeholder="اكتب اسم الطالب..."
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#0EA5E9]"
                />
              </div>

              <div className="lg:col-span-2">
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  الصف الدراسي
                </label>
                <select
                  value={quickGrade}
                  onChange={(e) => setQuickGrade(e.target.value as StudentGradeKey)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#0EA5E9]"
                >
                  {ATTACHED_SHEET_FILES.map((s) => (
                    <option key={s.grade} value={s.grade}>
                      {s.shortLabelAr} ({s.defaultFee} ج.م)
                    </option>
                  ))}
                </select>
              </div>

              <div className="lg:col-span-2">
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  تليفون الطالب
                </label>
                <input
                  type="tel"
                  dir="ltr"
                  value={quickPhone}
                  onChange={(e) => setQuickPhone(e.target.value)}
                  placeholder="010xxxxxxxx"
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-left text-slate-900 dark:text-white tabular-nums focus:outline-none focus:border-[#0EA5E9]"
                />
              </div>

              <div className="lg:col-span-2">
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  تليفون ولي الأمر
                </label>
                <input
                  type="tel"
                  dir="ltr"
                  value={quickParentPhone}
                  onChange={(e) => setQuickParentPhone(e.target.value)}
                  placeholder="012xxxxxxxx"
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-left text-slate-900 dark:text-white tabular-nums focus:outline-none focus:border-[#0EA5E9]"
                />
              </div>

              <div className="lg:col-span-1">
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  الاستلام
                </label>
                <select
                  value={quickDelivery}
                  onChange={(e) => setQuickDelivery(e.target.value as DeliveryStatus)}
                  className="w-full px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#0EA5E9]"
                >
                  <option value="استلم">استلم</option>
                  <option value="مطلوب">مطلوب</option>
                  <option value="-">-</option>
                </select>
              </div>

              <div className="lg:col-span-2 flex items-center gap-1.5">
                <button
                  type="submit"
                  className="flex-1 px-3 py-1.5 rounded-lg bg-[#0EA5E9] hover:bg-[#0284C7] text-white text-xs font-bold transition-colors whitespace-nowrap"
                >
                  إضافة فورية
                </button>
                <button
                  type="button"
                  onClick={() => setQuickAddOpen(false)}
                  className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-white"
                  aria-label="إغلاق الإضافة السريعة"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* Attendance Roll-Call Helper (in Attendance or Full Mode) */}
          {(viewMode === 'attendance' || viewMode === 'full') && filteredRecords.length > 0 && (
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 print:hidden">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-200">التحضير الجماعي السريع:</span>
                <select
                  value={rollCallWeek}
                  onChange={(e) => setRollCallWeek(Number(e.target.value))}
                  aria-label="اختر الأسبوع للتحضير الجماعي"
                  className="px-2.5 py-1.5 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-800 dark:text-slate-200"
                >
                  {WEEK_LABELS_AR.map((w, idx) => (
                    <option key={w} value={idx}>
                      {w}
                    </option>
                  ))}
                </select>
                <select
                  value={rollCallSession}
                  onChange={(e) => setRollCallSession(Number(e.target.value) as 0 | 1)}
                  aria-label="اختر الحصة للتحضير الجماعي"
                  className="px-2.5 py-1.5 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-800 dark:text-slate-200"
                >
                  <option value={0}>الحصة الأولى</option>
                  <option value={1}>الحصة الثانية</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleBulkRollCall(true)}
                  className="px-3 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors whitespace-nowrap"
                >
                  تحضير {selectedIds.size > 0 ? `المحددين (${selectedIds.size})` : `الكل (${filteredRecords.length})`}
                </button>
                <button
                  type="button"
                  onClick={() => handleBulkRollCall(false)}
                  className="px-3 py-1.5 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold transition-colors whitespace-nowrap"
                >
                  إلغاء الحضور
                </button>
              </div>
            </div>
          )}

          {/* Bulk Actions Strip (Visible when rows selected) */}
          {selectedIds.size > 0 && (
            <div className="p-3 rounded-lg bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-900 flex flex-wrap items-center justify-between gap-3 print:hidden">
              <div className="text-xs font-bold text-slate-900 dark:text-white tabular-nums">
                تم تحديد {selectedIds.size} طالب
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleBulkDeliveryStatus('استلم')}
                  className="px-3 py-1.5 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-colors"
                >
                  تعيين: استلم
                </button>
                <button
                  type="button"
                  onClick={() => handleBulkDeliveryStatus('مطلوب')}
                  className="px-3 py-1.5 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30 transition-colors"
                >
                  تعيين: مطلوب
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteTarget({ type: 'bulk', ids: Array.from(selectedIds) })}
                  className="px-3 py-1.5 rounded-md bg-red-600 hover:bg-red-700 text-white text-xs font-semibold transition-colors flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>حذف المحدد</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedIds(new Set())}
                  className="px-2.5 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                >
                  إلغاء التحديد
                </button>
              </div>
            </div>
          )}
        </div>

        {/* DataTable */}
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/70 border-b border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300">
                {/* Bulk checkbox */}
                <th className="py-3 px-3 w-10 text-center print:hidden">
                  <input
                    type="checkbox"
                    checked={allOnPageSelected}
                    onChange={handleTogglePageSelectAll}
                    aria-label="تحديد جميع سجلات الصفحة"
                    className="w-4 h-4 rounded border-slate-300 text-[#0EA5E9] focus:ring-[#0EA5E9] cursor-pointer"
                  />
                </th>

                {/* Code */}
                <th className="py-3 px-3 whitespace-nowrap">
                  <button
                    type="button"
                    onClick={() => handleSort('code')}
                    className="inline-flex items-center gap-1 hover:text-slate-900 dark:hover:text-white transition-colors"
                  >
                    <span>#</span>
                    {renderSortIcon('code')}
                  </button>
                </th>

                {/* Sticky Name */}
                <th className="py-3 px-3 whitespace-nowrap sticky right-0 z-10 bg-slate-50 dark:bg-slate-800/95 min-w-[170px] border-l border-slate-200/70 dark:border-slate-700/70">
                  <button
                    type="button"
                    onClick={() => handleSort('name')}
                    className="inline-flex items-center gap-1 hover:text-slate-900 dark:hover:text-white transition-colors"
                  >
                    <span>الاسم</span>
                    {renderSortIcon('name')}
                  </button>
                </th>

                {/* Grade */}
                <th className="py-3 px-3 whitespace-nowrap">
                  <button
                    type="button"
                    onClick={() => handleSort('grade')}
                    className="inline-flex items-center gap-1 hover:text-slate-900 dark:hover:text-white transition-colors"
                  >
                    <span>الصف</span>
                    {renderSortIcon('grade')}
                  </button>
                </th>

                {/* Overview & Full columns */}
                {(viewMode === 'overview' || viewMode === 'full') && (
                  <>
                    <th className="py-3 px-3 whitespace-nowrap">المذكرة / الكتاب</th>
                    <th className="py-3 px-3 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => handleSort('deliveryStatus')}
                        className="inline-flex items-center gap-1 hover:text-slate-900 dark:hover:text-white transition-colors"
                      >
                        <span>حالة الإستلام</span>
                        {renderSortIcon('deliveryStatus')}
                      </button>
                    </th>
                    <th className="py-3 px-3 whitespace-nowrap">التليفون</th>
                    <th className="py-3 px-2 text-center whitespace-nowrap">واتساب</th>
                    <th className="py-3 px-3 whitespace-nowrap">تليفون ولي الأمر</th>
                    <th className="py-3 px-3 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => handleSort('bookingDate')}
                        className="inline-flex items-center gap-1 hover:text-slate-900 dark:hover:text-white transition-colors"
                      >
                        <span>تاريخ الحجز</span>
                        {renderSortIcon('bookingDate')}
                      </button>
                    </th>
                    {MONTH_COLUMNS.map((m) => (
                      <th
                        key={m.key}
                        className="py-3 px-2 text-center whitespace-nowrap tabular-nums"
                        title="اضغط على أي مبلغ للتعديل المباشر"
                      >
                        ش {m.num}
                      </th>
                    ))}
                    <th className="py-3 px-3 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => handleSort('totalPaid')}
                        className="inline-flex items-center gap-1 hover:text-slate-900 dark:hover:text-white transition-colors"
                      >
                        <span>الإجمالي</span>
                        {renderSortIcon('totalPaid')}
                      </button>
                    </th>
                  </>
                )}

                {/* Attendance Summary */}
                <th className="py-3 px-3 whitespace-nowrap">
                  <button
                    type="button"
                    onClick={() => handleSort('attendance')}
                    className="inline-flex items-center gap-1 hover:text-slate-900 dark:hover:text-white transition-colors"
                  >
                    <span>الحضور</span>
                    {renderSortIcon('attendance')}
                  </button>
                </th>

                {/* 14 Weeks Matrix Columns (Attendance & Full modes) */}
                {(viewMode === 'attendance' || viewMode === 'full') &&
                  WEEK_LABELS_AR.map((label, idx) => (
                    <th
                      key={label}
                      className="py-3 px-2 text-center whitespace-nowrap tabular-nums border-r border-slate-200/70 dark:border-slate-800"
                      title={label}
                    >
                      أ{idx + 1}
                    </th>
                  ))}

                {/* Actions */}
                <th className="py-3 px-3 text-center whitespace-nowrap print:hidden">إجراءات</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-xs">
              {isSyncing ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={32} className="py-3.5 px-4">
                      <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-full" />
                    </td>
                  </tr>
                ))
              ) : paginatedRecords.length === 0 ? (
                <tr>
                  <td colSpan={32} className="py-16 px-6 text-center">
                    <div className="max-w-sm mx-auto space-y-3">
                      <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                        <FileSpreadsheet className="w-6 h-6" />
                      </div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">
                        {hasActiveFilters
                          ? activeSheetMeta && !searchQuery && deliveryFilter === 'all' && paymentFilter === 'all'
                            ? `شيت ${activeSheetMeta.labelAr} فارغ حالياً`
                            : 'لا توجد نتائج مطابقة للبحث'
                          : 'لا توجد سجلات طلاب حالياً'}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {activeSheetMeta && !searchQuery && deliveryFilter === 'all' && paymentFilter === 'all'
                          ? `الملف ${activeSheetMeta.fileName} جاهز لاستقبال الطلاب. أضف أول طالب في ${activeSheetMeta.labelAr} الآن.`
                          : hasActiveFilters
                          ? 'جرّب تعديل كلمة البحث أو مسح الفلاتر لعرض جميع الطلاب.'
                          : 'ابدأ بإضافة أول سجل طالب جديد أو قم بمزامنة الملفات المرفقة.'}
                      </p>
                      <div className="pt-2 flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={handleOpenCreate}
                          className="px-4 py-2 rounded-lg bg-[#0EA5E9] hover:bg-[#0284C7] text-white text-xs font-bold transition-colors flex items-center gap-1.5"
                        >
                          <Plus className="w-4 h-4" />
                          <span>
                            {activeSheetMeta ? `إضافة طالب إلى ${activeSheetMeta.shortLabelAr}` : 'إضافة أول طالب'}
                          </span>
                        </button>
                        {hasActiveFilters && (
                          <button
                            type="button"
                            onClick={handleResetFilters}
                            className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold transition-colors"
                          >
                            عرض جميع الصفوف
                          </button>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedRecords.map((record) => {
                  const totalPaid = calculateTotalPaid(record.payments);
                  const defaultFee = getDefaultFee(record.grade);
                  const attendance = calculateAttendanceCount(record.weeks);
                  const waLink = formatWhatsAppUrl(record.phone || record.parentPhone);
                  const isSelected = selectedIds.has(record.id);

                  return (
                    <tr
                      key={record.id}
                      className={`transition-colors ${
                        isSelected
                          ? 'bg-sky-50/70 dark:bg-sky-950/25'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="py-2.5 px-3 text-center print:hidden">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleRowSelect(record.id)}
                          aria-label={`تحديد ${record.name}`}
                          className="w-4 h-4 rounded border-slate-300 text-[#0EA5E9] focus:ring-[#0EA5E9] cursor-pointer"
                        />
                      </td>

                      {/* Code */}
                      <td className="py-2.5 px-3 font-mono font-semibold text-slate-500 dark:text-slate-400 tabular-nums whitespace-nowrap">
                        {record.code}
                      </td>

                      {/* Sticky Name */}
                      <td className="py-2.5 px-3 sticky right-0 z-10 bg-white dark:bg-slate-900 border-l border-slate-200/70 dark:border-slate-800">
                        <button
                          type="button"
                          onClick={() => setViewingRecordId(record.id)}
                          className="font-bold text-slate-900 dark:text-white hover:text-[#0EA5E9] dark:hover:text-[#38BDF8] text-right transition-colors block truncate max-w-[180px]"
                          title="عرض بطاقة الطالب وتفاصيله"
                        >
                          {record.name}
                        </button>
                      </td>

                      {/* Grade */}
                      <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                        {getGradeLabel(record.grade, true)}
                      </td>

                      {/* Overview & Full columns */}
                      {(viewMode === 'overview' || viewMode === 'full') && (
                        <>
                          {/* Booklet (click to cycle) */}
                          <td className="py-2.5 px-3 whitespace-nowrap">
                            <button
                              type="button"
                              onClick={() => handleCycleBooklet(record.id)}
                              title="اضغط لتبديل المذكرة / الكتاب"
                              className={`px-2 py-1 rounded text-[11px] font-semibold transition-colors ${
                                record.booklet === 'كتاب سلاح التلميذ' || record.booklet === 'المذكرة'
                                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200'
                              }`}
                            >
                              {record.booklet}
                            </button>
                          </td>

                          {/* Delivery Status (click to cycle) */}
                          <td className="py-2.5 px-3 whitespace-nowrap">
                            <button
                              type="button"
                              onClick={() => handleCycleDeliveryStatus(record.id)}
                              title="اضغط لتبديل حالة الاستلام (استلم / مطلوب / -)"
                              className="inline-flex items-center gap-1.5 text-xs font-semibold hover:underline transition-colors"
                            >
                              {record.deliveryStatus === 'استلم' ? (
                                <>
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                                  <span className="text-emerald-700 dark:text-emerald-400">استلم</span>
                                </>
                              ) : record.deliveryStatus === 'مطلوب' ? (
                                <>
                                  <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                                  <span className="text-amber-700 dark:text-amber-400">مطلوب</span>
                                </>
                              ) : (
                                <span className="text-slate-400">غير محدد</span>
                              )}
                            </button>
                          </td>

                          {/* Phone */}
                          <td className="py-2.5 px-3 font-mono text-slate-700 dark:text-slate-300 tabular-nums whitespace-nowrap" dir="ltr">
                            {record.phone || '—'}
                          </td>

                          {/* Direct WhatsApp column (same as column F in attached sheets) */}
                          <td className="py-2.5 px-2 text-center whitespace-nowrap">
                            {waLink ? (
                              <a
                                href={waLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center w-7 h-7 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-600 hover:text-white transition-colors"
                                title={`واتساب (${record.phone || record.parentPhone})`}
                                aria-label={`واتساب ${record.name}`}
                              >
                                <MessageCircle className="w-3.5 h-3.5" />
                              </a>
                            ) : (
                              <span className="text-slate-300 dark:text-slate-700">—</span>
                            )}
                          </td>

                          {/* Parent Phone */}
                          <td className="py-2.5 px-3 font-mono text-slate-500 dark:text-slate-400 tabular-nums whitespace-nowrap" dir="ltr">
                            {record.parentPhone || '—'}
                          </td>

                          {/* Booking Date */}
                          <td className="py-2.5 px-3 font-mono text-slate-600 dark:text-slate-300 tabular-nums whitespace-nowrap" dir="ltr">
                            {record.bookingDate || '—'}
                          </td>

                          {/* Inline Editable Monthly Payments (8..12) */}
                          {MONTH_COLUMNS.map((m) => {
                            const isEditing =
                              editingPaymentCell?.recordId === record.id &&
                              editingPaymentCell?.monthKey === m.key;
                            const val = record.payments[m.key];
                            const paidNum = parsePaymentAmount(val);

                            return (
                              <td key={m.key} className="py-1.5 px-1 text-center whitespace-nowrap">
                                {isEditing ? (
                                  <div className="inline-flex items-center gap-1">
                                    <input
                                      type="text"
                                      dir="ltr"
                                      autoFocus
                                      value={editingPaymentCell.value}
                                      onChange={(e) =>
                                        setEditingPaymentCell({
                                          ...editingPaymentCell,
                                          value: e.target.value,
                                        })
                                      }
                                      onBlur={() => handleCommitInlinePayment()}
                                      onKeyDown={(e) => {
                                        if (e.key === 'Enter') handleCommitInlinePayment();
                                        if (e.key === 'Escape') setEditingPaymentCell(null);
                                      }}
                                      className="w-12 px-1 py-1 text-xs font-mono text-center rounded border border-[#0EA5E9] bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none tabular-nums"
                                    />
                                    <button
                                      type="button"
                                      onMouseDown={(e) => {
                                        e.preventDefault();
                                        handleCommitInlinePayment(String(editingPaymentCell.defaultFee));
                                      }}
                                      className="px-1.5 py-1 rounded bg-emerald-600 text-white text-[10px] font-bold tabular-nums"
                                      title={`تعيين ${editingPaymentCell.defaultFee} ج.م`}
                                    >
                                      {editingPaymentCell.defaultFee}
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setEditingPaymentCell({
                                        recordId: record.id,
                                        monthKey: m.key,
                                        value: val === '--' ? '' : val,
                                        defaultFee,
                                      })
                                    }
                                    title={`اضغط للتعديل (الاشتراك الافتراضي ${defaultFee} ج.م)`}
                                    className={`w-12 py-1 rounded text-xs font-mono tabular-nums transition-colors ${
                                      paidNum > 0
                                        ? 'font-bold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-950/70'
                                        : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                                    }`}
                                  >
                                    {val || '--'}
                                  </button>
                                )}
                              </td>
                            );
                          })}

                          {/* Total Paid */}
                          <td className="py-2.5 px-3 font-mono font-bold text-slate-900 dark:text-white tabular-nums whitespace-nowrap">
                            {totalPaid > 0 ? `${totalPaid} ج.م` : '0 ج.م'}
                          </td>
                        </>
                      )}

                      {/* Attendance Summary */}
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-semibold text-slate-800 dark:text-slate-200 tabular-nums">
                            {attendance.attended}/{attendance.total}
                          </span>
                          <div className="w-12 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#0EA5E9] rounded-full"
                              style={{ width: `${attendance.percentage}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* 14 Weeks Live Toggle Checkboxes */}
                      {(viewMode === 'attendance' || viewMode === 'full') &&
                        record.weeks.map(([s1, s2], wIdx) => (
                          <td
                            key={wIdx}
                            className="py-2 px-1.5 text-center whitespace-nowrap border-r border-slate-100 dark:border-slate-800/80"
                          >
                            <div className="inline-flex items-center gap-1">
                              {([0, 1] as const).map((sIdx) => {
                                const active = sIdx === 0 ? s1 : s2;
                                return (
                                  <button
                                    key={sIdx}
                                    type="button"
                                    onClick={() => handleToggleAttendance(record.id, wIdx, sIdx)}
                                    aria-label={`${record.name} - ${WEEK_LABELS_AR[wIdx]} حصة ${sIdx + 1}`}
                                    title={`${WEEK_LABELS_AR[wIdx]} - حصة ${sIdx + 1}`}
                                    className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                                      active
                                        ? 'bg-[#0EA5E9] border-[#0EA5E9] text-white'
                                        : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 hover:border-[#0EA5E9]'
                                    }`}
                                  >
                                    {active && <Check className="w-3 h-3" />}
                                  </button>
                                );
                              })}
                            </div>
                          </td>
                        ))}

                      {/* Row Actions */}
                      <td className="py-2 px-3 whitespace-nowrap print:hidden">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            type="button"
                            onClick={() => setViewingRecordId(record.id)}
                            className="p-1.5 rounded-md text-slate-500 hover:text-[#0EA5E9] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            title="عرض التفاصيل"
                            aria-label={`عرض ${record.name}`}
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(record)}
                            className="p-1.5 rounded-md text-slate-500 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            title="تعديل السجل"
                            aria-label={`تعديل ${record.name}`}
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteTarget({ type: 'single', record })}
                            className="p-1.5 rounded-md text-slate-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                            title="حذف السجل"
                            aria-label={`حذف ${record.name}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>

            {/* Totals Ledger Footer Row */}
            {filteredRecords.length > 0 && (
              <tfoot>
                <tr className="bg-slate-50 dark:bg-slate-800/80 border-t-2 border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white">
                  <td className="py-3 px-3 print:hidden" />
                  <td className="py-3 px-3 tabular-nums text-slate-500 dark:text-slate-400" colSpan={3}>
                    إجماليات النتائج المعروضة ({filteredRecords.length} طالب)
                  </td>

                  {(viewMode === 'overview' || viewMode === 'full') && (
                    <>
                      <td className="py-3 px-3 text-slate-500 dark:text-slate-400" colSpan={6}>
                        استلم: {kpiStats.delivered} · مطلوب: {kpiStats.pending}
                      </td>
                      {MONTH_COLUMNS.map((m) => (
                        <td
                          key={m.key}
                          className="py-3 px-2 text-center font-mono tabular-nums text-slate-700 dark:text-slate-200"
                        >
                          {kpiStats.monthTotals[m.key] > 0 ? kpiStats.monthTotals[m.key] : '0'}
                        </td>
                      ))}
                      <td className="py-3 px-3 font-mono tabular-nums text-[#0EA5E9] whitespace-nowrap">
                        {kpiStats.totalCollected.toLocaleString('en-US')} ج.م
                      </td>
                    </>
                  )}

                  <td className="py-3 px-3 font-mono tabular-nums whitespace-nowrap">
                    {kpiStats.totalAttended} حصة ({kpiStats.avgAttendancePct}%)
                  </td>

                  {(viewMode === 'attendance' || viewMode === 'full') &&
                    WEEK_LABELS_AR.map((label, wIdx) => {
                      const weekSum = filteredRecords.reduce(
                        (s, r) => s + (r.weeks[wIdx]?.[0] ? 1 : 0) + (r.weeks[wIdx]?.[1] ? 1 : 0),
                        0
                      );
                      return (
                        <td
                          key={label}
                          className="py-3 px-2 text-center font-mono text-[11px] text-slate-500 dark:text-slate-400 tabular-nums border-r border-slate-200/70 dark:border-slate-700"
                        >
                          {weekSum}
                        </td>
                      );
                    })}

                  <td className="py-3 px-3 print:hidden" />
                </tr>
              </tfoot>
            )}
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="px-4 sm:px-5 py-3.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 print:hidden">
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <span>عدد الصفوف:</span>
              <select
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
                aria-label="عدد الصفوف في الصفحة"
                className="px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white tabular-nums focus:outline-none focus:border-[#0EA5E9]"
              >
                <option value={10}>10</option>
                <option value={15}>15</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>

            <span className="tabular-nums">
              {totalItems === 0
                ? 'لا توجد سجلات للعرض'
                : `عرض ${startIdx + 1} إلى ${endIdx} من أصل ${totalItems} طالب`}
            </span>
          </div>

          <div className="flex items-center gap-1" dir="ltr">
            <button
              type="button"
              onClick={() => setCurrentPage(1)}
              disabled={safePage <= 1}
              className="p-1.5 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              aria-label="الصفحة الأولى"
              title="الصفحة الأولى"
            >
              <ChevronsLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={safePage <= 1}
              className="p-1.5 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              aria-label="الصفحة السابقة"
              title="السابق"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {pageNumbers.map((item, idx) =>
              item === 'ellipsis' ? (
                <span key={`e-${idx}`} className="px-2 text-xs text-slate-400">
                  ...
                </span>
              ) : (
                <button
                  key={item}
                  type="button"
                  onClick={() => setCurrentPage(item)}
                  className={`min-w-[32px] h-8 px-2 rounded-md text-xs font-semibold tabular-nums transition-colors ${
                    item === safePage
                      ? 'bg-[#0EA5E9] text-white border border-[#0EA5E9]'
                      : 'border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  {item}
                </button>
              )
            )}

            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage >= totalPages}
              className="p-1.5 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              aria-label="الصفحة التالية"
              title="التالي"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage(totalPages)}
              disabled={safePage >= totalPages}
              className="p-1.5 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              aria-label="الصفحة الأخيرة"
              title="الصفحة الأخيرة"
            >
              <ChevronsRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Attached Source Files Reference Footer Strip (All 6 files) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-3 text-xs text-slate-600 dark:text-slate-400 print:hidden">
        <div className="flex flex-wrap items-center gap-2">
          <FileSpreadsheet className="w-4 h-4 text-[#0EA5E9] shrink-0" />
          <span className="font-semibold text-slate-800 dark:text-slate-200">الملفات المرفقة المصدرية (6 شيتات):</span>
          {ATTACHED_SHEET_FILES.map((sheet, idx) => (
            <React.Fragment key={sheet.grade}>
              {idx > 0 && <span aria-hidden="true">·</span>}
              <a
                href={sheet.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#0EA5E9] underline decoration-slate-300 dark:decoration-slate-700 underline-offset-4 transition-colors tabular-nums"
              >
                {sheet.shortLabelAr} ({sheet.fileName})
              </a>
            </React.Fragment>
          ))}
        </div>
        <span className="text-[11px] text-slate-400">
          الحفظ تلقائي محلياً مع دعم التصدير والاستيراد بصيغ HTML / CSV / JSON.
        </span>
      </div>

      {/* Create / Edit Modal */}
      <StudentRecordFormModal
        isOpen={formOpen}
        mode={formMode}
        initialRecord={editingRecord}
        defaultGrade={gradeFilter === 'all' ? '4prim' : gradeFilter}
        nextCodeByGrade={nextCodeByGrade}
        onClose={() => setFormOpen(false)}
        onSave={handleSaveRecord}
      />

      {/* Detail Viewer Modal */}
      <StudentRecordDetailModal
        record={viewingRecord}
        onClose={() => setViewingRecordId(null)}
        onEdit={handleOpenEdit}
        onRequestDelete={(rec) => setDeleteTarget({ type: 'single', record: rec })}
        onToggleAttendance={handleToggleAttendance}
        onToggleDeliveryStatus={handleCycleDeliveryStatus}
      />

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-confirm-title"
        >
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 id="delete-confirm-title" className="text-base font-bold text-slate-900 dark:text-white">
                  تأكيد حذف السجل
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {deleteTarget.type === 'single'
                    ? `هل أنت متأكد من حذف سجل الطالب "${deleteTarget.record.name}" نهائياً من الجدول؟`
                    : `هل أنت متأكد من حذف ${deleteTarget.ids.length} سجل محدد نهائياً من الجدول؟`}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors"
              >
                نعم، حذف الآن
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
