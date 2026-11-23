import React from 'react';
import { Users, BookOpen, Shield, BarChart3, Settings, AlertCircle, CheckCircle2 } from 'lucide-react';
import { mockUsers } from '../data/mockData';

interface AdminDashboardProps {
  onOpenRecords?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onOpenRecords }) => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-10">
      
      {/* Header */}
      <div className="bg-[#0F172A] text-white p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <span className="px-3 py-1 bg-[#0EA5E9]/20 text-[#0EA5E9] rounded-full text-xs font-bold border border-[#0EA5E9]/30">
            لوحة تحكم مدير النظام المركزي
          </span>
          <h1 className="text-2xl sm:text-3xl font-black mt-2">إدارة المنصة والمستخدمين والصلاحيات</h1>
          <p className="text-slate-400 text-xs mt-1">إشراف شامل على حسابات المعلمين والطلاب، مراجعة المحتوى، وإعدادات النظام.</p>
        </div>
        {onOpenRecords && (
          <button
            type="button"
            onClick={onOpenRecords}
            className="px-5 py-3 bg-[#0EA5E9] hover:bg-[#0284C7] text-white font-bold text-xs rounded-xl transition-colors whitespace-nowrap shrink-0"
          >
            فتح سجلات الطلاب (CRUD)
          </button>
        )}
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">إجمالي المستخدمين</span>
            <Users className="w-5 h-5 text-[#0EA5E9]" />
          </div>
          <span className="text-2xl font-black text-[#0F172A] dark:text-white">25,840</span>
          <span className="block text-[11px] text-emerald-500 font-semibold">+1,240 هذا الأسبوع</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">المعلمين المعتمدين</span>
            <Shield className="w-5 h-5 text-[#0EA5E9]" />
          </div>
          <span className="text-2xl font-black text-[#0F172A] dark:text-white">142</span>
          <span className="block text-[11px] text-slate-400 font-medium">نشطون بانتظام</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">الدورات المنشورة</span>
            <BookOpen className="w-5 h-5 text-amber-500" />
          </div>
          <span className="text-2xl font-black text-[#0F172A] dark:text-white">128</span>
          <span className="block text-[11px] text-emerald-500 font-semibold">12 دورة جديدة قيد المراجعة</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">حالة الخوادم والأداء</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          </div>
          <span className="text-2xl font-black text-[#0F172A] dark:text-white">99.9%</span>
          <span className="block text-[11px] text-emerald-500 font-semibold">استقرار تام</span>
        </div>
      </div>

      {/* Users Management Table */}
      <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <h3 className="text-lg font-bold text-[#0F172A] dark:text-white">إدارة المستخدمين والصلاحيات</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold">
                <th className="pb-3 pr-4">المستخدم</th>
                <th className="pb-3">البريد الإلكتروني</th>
                <th className="pb-3">الدور</th>
                <th className="pb-3">نقاط XP</th>
                <th className="pb-3">الإجراء</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {mockUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="py-4 pr-4 flex items-center gap-3">
                    <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-[#0F172A] dark:text-white">{user.name}</span>
                      {user.isOwner && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-400/40">
                          👑 صاحب المنصة
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 text-slate-500">{user.email}</td>
                  <td className="py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      user.isOwner ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400 font-black' : user.role === 'admin' ? 'bg-purple-500/10 text-purple-500' : user.role === 'teacher' ? 'bg-[#0EA5E9]/10 text-[#0EA5E9]' : 'bg-emerald-500/10 text-emerald-500'
                    }`}>
                      {user.isOwner ? '👑 مدير المالك' : user.role === 'admin' ? 'مدير' : user.role === 'teacher' ? 'معلم' : 'طالب'}
                    </span>
                  </td>
                  <td className="py-4 font-black text-[#0EA5E9]">{user.xp} XP</td>
                  <td className="py-4">
                    {user.isOwner ? (
                      <span className="text-amber-500 text-[11px] font-bold">صلاحيات كاملة مطلقة</span>
                    ) : (
                      <button className="text-[#0EA5E9] hover:underline font-bold">تعديل الصلاحية</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
