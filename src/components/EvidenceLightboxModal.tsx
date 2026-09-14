import React from 'react';
import { X, Download, FileText, Camera, Calendar, User, ShieldCheck, ExternalLink } from 'lucide-react';
import { EvidenceItem } from '../types';

interface EvidenceLightboxModalProps {
  evidence: EvidenceItem;
  projectName: string;
  onClose: () => void;
}

export const EvidenceLightboxModal: React.FC<EvidenceLightboxModalProps> = ({
  evidence,
  projectName,
  onClose
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-3xl w-full my-auto shadow-2xl border border-slate-700 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5 truncate">
            {evidence.type === 'photo' ? (
              <Camera className="w-4 h-4 text-sky-400 shrink-0" />
            ) : (
              <FileText className="w-4 h-4 text-emerald-400 shrink-0" />
            )}
            <span className="font-bold text-sm truncate">
              {evidence.title}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-5 overflow-y-auto space-y-4">
          
          {evidence.type === 'photo' && evidence.fileUrl ? (
            <div className="rounded-xl overflow-hidden bg-slate-900 border border-slate-200 flex items-center justify-center max-h-[50vh]">
              <img
                src={evidence.fileUrl}
                alt={evidence.title}
                className="max-h-[50vh] w-auto object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
          ) : (
            <div className="p-8 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-3">
              <FileText className="w-12 h-12 text-emerald-600 mx-auto" />
              <div className="font-bold text-slate-800 text-sm">{evidence.fileName}</div>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                เอกสารดิจิทัลสำหรับประกอบการประเมินมาตรฐาน Green & Clean Hospital (PDF / Spreadsheet Document)
              </p>
              <div className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 text-xs rounded-full font-semibold">
                ขนาดไฟล์: {evidence.fileSize || '1.8 MB'}
              </div>
            </div>
          )}

          {/* Description and Metadata */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
            <div className="font-semibold text-slate-800 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>คำอธิบายหลักฐานเชิงประจักษ์:</span>
            </div>
            <p className="text-slate-700 leading-relaxed">
              {evidence.description || 'ไม่มีคำอธิบายเพิ่มเติม'}
            </p>

            <div className="pt-2 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-500">
              <div>
                <strong>โครงการที่สังกัด:</strong> {projectName}
              </div>
              <div>
                <strong>ผู้อัปโหลด:</strong> {evidence.uploadedBy}
              </div>
              <div>
                <strong>วันที่บันทึก:</strong> {evidence.uploadedAt}
              </div>
              {evidence.phase && (
                <div>
                  <strong>ช่วงการดำเนินงาน:</strong> {evidence.phase === 'before' ? 'ก่อนดำเนินการ (Before)' : evidence.phase === 'during' ? 'ระหว่างดำเนินการ (During)' : evidence.phase === 'after' ? 'หลังดำเนินการ (After)' : 'ทั่วไป'}
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs">
          <span className="text-slate-400 font-mono">
            ID: {evidence.id}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 text-white rounded-lg hover:bg-slate-900 font-medium"
          >
            ปิดหน้าต่าง
          </button>
        </div>

      </div>
    </div>
  );
};
