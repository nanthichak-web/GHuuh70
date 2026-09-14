import React, { useState } from 'react';
import {
  FileCheck,
  ShieldCheck,
  Camera,
  FileText,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  Clock,
  ExternalLink,
  ChevronRight,
  Printer,
  Download,
  Eye,
  X,
  Award,
  Zap,
  Recycle,
  Droplets,
  Trees,
  Building2,
  Sparkles,
  Users,
  BarChart3
} from 'lucide-react';
import { Category, Project, EvidenceItem } from '../types';
import { getStatusConfig } from '../utils/helpers';

interface EvidenceMatrixViewProps {
  categories: Category[];
  projects: Project[];
  onSelectProject: (p: Project) => void;
  onPreviewEvidence: (ev: EvidenceItem, projectName: string) => void;
  onPrint: () => void;
}

export const EvidenceMatrixView: React.FC<EvidenceMatrixViewProps> = ({
  categories,
  projects,
  onSelectProject,
  onPreviewEvidence,
  onPrint
}) => {
  const [activeCategoryModal, setActiveCategoryModal] = useState<Category | null>(null);

  // Helper for category icons
  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Zap': return <Zap className="w-5 h-5 text-amber-500" />;
      case 'Recycle': return <Recycle className="w-5 h-5 text-teal-500" />;
      case 'Droplets': return <Droplets className="w-5 h-5 text-sky-500" />;
      case 'Trees': return <Trees className="w-5 h-5 text-emerald-500" />;
      case 'Building2': return <Building2 className="w-5 h-5 text-indigo-500" />;
      case 'Sparkles': return <Sparkles className="w-5 h-5 text-cyan-500" />;
      case 'Users': return <Users className="w-5 h-5 text-violet-500" />;
      case 'BarChart3': return <BarChart3 className="w-5 h-5 text-rose-500" />;
      default: return <Award className="w-5 h-5 text-emerald-500" />;
    }
  };

  // Matrix calculation data
  const matrixRows = categories.map(cat => {
    const catProjects = projects.filter(p => p.categoryId === cat.id);
    const count = catProjects.length;
    const avgProgress = count > 0
      ? Math.round(catProjects.reduce((acc, p) => acc + p.progressPercent, 0) / count)
      : 0;

    // Collect all evidence across all projects in this category
    const allEvidence = catProjects.flatMap(p => 
      p.evidenceList.map(ev => ({ ...ev, projectName: p.name, projectId: p.id }))
    );

    const photos = allEvidence.filter(e => e.type === 'photo');
    const docs = allEvidence.filter(e => e.type === 'document');
    const dataSheets = allEvidence.filter(e => e.type === 'data');

    // Overall status assessment
    let matrixStatus: 'passed' | 'in_progress' | 'needs_improvement' = 'in_progress';
    if (avgProgress >= 80 && allEvidence.length >= 2) {
      matrixStatus = 'passed';
    } else if (avgProgress < 50 || catProjects.some(p => p.status === 'delayed')) {
      matrixStatus = 'needs_improvement';
    }

    return {
      category: cat,
      projects: catProjects,
      count,
      avgProgress,
      allEvidence,
      photoCount: photos.length,
      docCount: docs.length,
      dataCount: dataSheets.length,
      matrixStatus
    };
  });

  const totalEvidenceCount = matrixRows.reduce((acc, r) => acc + r.allEvidence.length, 0);
  const passedCategoriesCount = matrixRows.filter(r => r.matrixStatus === 'passed').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200 mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Audit & Accreditation Matrix</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <span>Evidence Matrix สำหรับคณะกรรมการตรวจประเมิน</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
            ตารางสรุปเกณฑ์มาตรฐาน 9 ด้าน พร้อมหลักฐานเชิงประจักษ์ (ภาพถ่าย, เอกสารราชการ, ข้อมูลสถิติ) 
            สามารถกดเปิดดูหลักฐานได้ทันทีเพื่อความโปร่งใสและรวดเร็ว
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <div className="text-xs text-slate-500">พร้อมรับการตรวจ</div>
            <div className="text-lg font-bold text-emerald-600">{passedCategoriesCount} / 9 หมวด</div>
          </div>
          <button
            onClick={onPrint}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>พิมพ์ Matrix</span>
          </button>
        </div>
      </div>

      {/* Main Evidence Matrix Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3.5 w-64">เกณฑ์มาตรฐาน GCH</th>
                <th className="px-4 py-3.5">ตัวชี้วัดสำคัญ (Key KPIs)</th>
                <th className="px-4 py-3.5 text-center">โครงการ</th>
                <th className="px-4 py-3.5 w-48">ผลดำเนินงาน (%)</th>
                <th className="px-4 py-3.5">คลังหลักฐานเชิงประจักษ์</th>
                <th className="px-4 py-3.5 text-center">สถานะประเมิน</th>
                <th className="px-4 py-3.5 text-center">เรียกดู</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {matrixRows.map((row) => (
                <tr key={row.category.id} className="hover:bg-slate-50 transition-colors">
                  
                  {/* Category Name */}
                  <td className="px-4 py-3.5 font-medium">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                        {getCategoryIcon(row.category.icon)}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-xs">{row.category.name}</div>
                        <div className="text-[10px] text-slate-400 font-normal">{row.category.nameEn}</div>
                      </div>
                    </div>
                  </td>

                  {/* KPIs */}
                  <td className="px-4 py-3.5 max-w-xs">
                    <ul className="list-disc list-inside text-[11px] text-slate-600 space-y-0.5">
                      {row.category.standardKpis.slice(0, 2).map((kpi, idx) => (
                        <li key={idx} className="truncate">{kpi}</li>
                      ))}
                    </ul>
                  </td>

                  {/* Project Count */}
                  <td className="px-4 py-3.5 text-center font-semibold text-slate-800">
                    {row.count} งาน
                  </td>

                  {/* Progress Bar & % */}
                  <td className="px-4 py-3.5">
                    <div className="flex items-center justify-between text-xs mb-1 font-bold">
                      <span className="text-slate-800">{row.avgProgress}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          row.avgProgress >= 80
                            ? 'bg-emerald-500'
                            : row.avgProgress >= 50
                            ? 'bg-amber-500'
                            : 'bg-rose-500'
                        }`}
                        style={{ width: `${row.avgProgress}%` }}
                      />
                    </div>
                  </td>

                  {/* Evidence Pills */}
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {row.photoCount > 0 && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-sky-50 text-sky-800 border border-sky-200 text-[11px] font-medium">
                          📷 {row.photoCount} รูป
                        </span>
                      )}
                      {row.docCount > 0 && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-800 border border-indigo-200 text-[11px] font-medium">
                          📄 {row.docCount} เอกสาร
                        </span>
                      )}
                      {row.dataCount > 0 && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-medium">
                          📊 {row.dataCount} ข้อมูล/Excel
                        </span>
                      )}
                      {row.allEvidence.length === 0 && (
                        <span className="text-slate-400 text-[11px] italic">
                          ยังไม่มีหลักฐาน
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Evaluation Status */}
                  <td className="px-4 py-3.5 text-center whitespace-nowrap">
                    {row.matrixStatus === 'passed' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-bold">
                        🟢 ผ่านเกณฑ์
                      </span>
                    ) : row.matrixStatus === 'in_progress' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[11px] font-bold">
                        🟡 อยู่ระหว่างดำเนินงาน
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-50 text-rose-800 border border-rose-200 text-[11px] font-bold">
                        🔴 ต้องเร่งรัด/แก้ไข
                      </span>
                    )}
                  </td>

                  {/* 1-Click Action Button */}
                  <td className="px-4 py-3.5 text-center">
                    <button
                      onClick={() => setActiveCategoryModal(row.category)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-600 hover:text-white text-slate-700 text-xs font-medium transition-colors"
                      title="เปิดดูหลักฐานทั้งหมดในหมวดนี้"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>เปิดหลักฐาน</span>
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Category Evidence Modal / Inspector */}
      {activeCategoryModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                  {getCategoryIcon(activeCategoryModal.icon)}
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">
                    หลักฐานเชิงประจักษ์: หมวด {activeCategoryModal.name}
                  </h3>
                  <div className="text-xs text-slate-400">
                    {activeCategoryModal.nameEn}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setActiveCategoryModal(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6">
              {(() => {
                const catProjects = projects.filter(p => p.categoryId === activeCategoryModal.id);
                const allEv = catProjects.flatMap(p =>
                  p.evidenceList.map(ev => ({ ...ev, project: p }))
                );

                if (allEv.length === 0) {
                  return (
                    <div className="text-center py-12 text-slate-400 text-xs">
                      ยังไม่มีหลักฐานแนบในหมวดนี้
                    </div>
                  );
                }

                return (
                  <div className="space-y-4">
                    <div className="text-xs font-bold text-slate-700">
                      รายการหลักฐานทั้งหมด ({allEv.length} รายการ):
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {allEv.map((item) => (
                        <div
                          key={item.id}
                          className="p-3 rounded-xl border border-slate-200 hover:border-emerald-300 bg-slate-50/50 hover:bg-white transition-all text-xs flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex items-start justify-between gap-2 mb-1.5">
                              <span className="font-semibold text-slate-900 line-clamp-1">
                                {item.type === 'photo' ? '📷 รูปภาพ' : item.type === 'data' ? '📊 ตาราง/Excel' : '📄 เอกสาร'}
                              </span>
                              <span className="text-[10px] text-slate-400">
                                {item.uploadedAt}
                              </span>
                            </div>

                            {item.type === 'photo' && item.fileUrl && (
                              <div className="w-full h-28 rounded-lg overflow-hidden mb-2 bg-slate-200">
                                <img
                                  src={item.fileUrl}
                                  alt={item.title}
                                  className="w-full h-full object-cover"
                                  referrerPolicy="no-referrer"
                                />
                              </div>
                            )}

                            <div className="font-bold text-slate-800 line-clamp-1">
                              {item.title}
                            </div>
                            <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                              {item.description}
                            </p>
                            <div className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded mt-2 truncate font-medium">
                              โครงการ: {item.project.name}
                            </div>
                          </div>

                          <div className="mt-3 pt-2 border-t border-slate-200 flex items-center justify-between">
                            <span className="text-[10px] text-slate-400">
                              โดย: {item.uploadedBy}
                            </span>
                            <button
                              onClick={() => {
                                onPreviewEvidence(item, item.project.name);
                              }}
                              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              <span>ดูหลักฐาน</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-end">
              <button
                onClick={() => setActiveCategoryModal(null)}
                className="px-4 py-1.5 rounded-xl bg-slate-800 text-white text-xs font-medium hover:bg-slate-900"
              >
                ปิดหน้าต่าง
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
