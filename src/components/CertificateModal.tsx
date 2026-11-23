import React from 'react';
import { X, Award, Download, CheckCircle2 } from 'lucide-react';
import { Certificate } from '../types';

interface CertificateModalProps {
  certificate: Certificate | null;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({ certificate, onClose }) => {
  if (!certificate) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-3xl w-full p-8 shadow-2xl border-4 border-[#0EA5E9]/30 relative overflow-hidden space-y-8 animate-in zoom-in-95 duration-200">
        
        <button
          onClick={onClose}
          className="absolute top-6 left-6 p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Certificate Card Content */}
        <div className="border-8 border-double border-[#37476C]/30 p-8 rounded-2xl text-center space-y-6 bg-gradient-to-b from-white to-[#E6ECF3]/30 dark:from-slate-900 dark:to-slate-800/50">
          <div className="w-16 h-16 rounded-2xl bg-[#0EA5E9] text-white flex items-center justify-center mx-auto shadow-lg shadow-[#0EA5E9]/30">
            <Award className="w-8 h-8" />
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#0EA5E9]">شهادة إتمام معتمدة</span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0F172A] dark:text-white mt-1">منصة نون التعليمية</h2>
          </div>

          <p className="text-xs text-slate-500">تمنح هذه الشهادة بكل فخر واعتزاز إلى:</p>

          <h3 className="text-3xl font-extrabold text-[#0EA5E9] border-b-2 border-slate-200 dark:border-slate-700 pb-2 inline-block px-6">
            {certificate.studentName}
          </h3>

          <p className="text-xs text-slate-600 dark:text-slate-300 max-ل-lg mx-auto leading-relaxed">
            لاجتيازه بنجاح كافة متطلبات واختبارات الدورة التدريبية الاحترافية بعنوان:
          </p>

          <h4 className="text-lg font-bold text-[#0F172A] dark:text-white">
            {certificate.courseTitle}
          </h4>

          <div className="flex items-center justify-between pt-8 border-t border-slate-200 dark:border-slate-700 text-xs text-slate-500">
            <div>
              <span className="block font-bold text-slate-700 dark:text-slate-300">{certificate.instructorName}</span>
              <span>مدرب الدورة</span>
            </div>
            <div>
              <span className="block font-bold text-slate-700 dark:text-slate-300 font-mono">{certificate.credentialId}</span>
              <span>رقم التحقق الرسمي</span>
            </div>
            <div>
              <span className="block font-bold text-slate-700 dark:text-slate-300">{certificate.issueDate}</span>
              <span>تاريخ الاصدار</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => alert('تم البدء بتحميل الشهادة بصيغة PDF بنجاح!')}
            className="px-8 py-3 bg-[#0EA5E9] text-white font-bold text-xs rounded-xl hover:bg-[#0284C7] shadow-lg shadow-[#0EA5E9]/30 transition-all flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>تحميل الشهادة PDF</span>
          </button>
        </div>

      </div>
    </div>
  );
};
