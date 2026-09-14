import React, { useState } from 'react';
import {
  Layers,
  CheckCircle2,
  AlertCircle,
  Clock,
  ChevronRight,
  ArrowUpRight,
  Plus,
  ShieldCheck,
  Zap,
  Recycle,
  Droplets,
  Trees,
  Building2,
  Sparkles,
  Users,
  BarChart3,
  Award,
  Filter
} from 'lucide-react';
import { Category, Project, StatusType } from '../types';
import { getStatusConfig, getWorkflowLevelInfo } from '../utils/helpers';

interface CategoryListViewProps {
  categories: Category[];
  projects: Project[];
  selectedCategoryId: string | null;
  onSelectCategory: (catId: string | null) => void;
  onSelectProject: (p: Project) => void;
  onOpenNewProjectModal: (preselectedCategoryId?: string) => void;
}

export const CategoryListView: React.FC<CategoryListViewProps> = ({
  categories,
  projects,
  selectedCategoryId,
  onSelectCategory,
  onSelectProject,
  onOpenNewProjectModal
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Helper for category icons
  const getCategoryIcon = (iconName: string, className = "w-5 h-5") => {
    switch (iconName) {
      case 'Zap': return <Zap className={`${className} text-amber-500`} />;
      case 'Recycle': return <Recycle className={`${className} text-teal-500`} />;
      case 'Droplets': return <Droplets className={`${className} text-sky-500`} />;
      case 'Trees': return <Trees className={`${className} text-emerald-500`} />;
      case 'Building2': return <Building2 className={`${className} text-indigo-500`} />;
      case 'Sparkles': return <Sparkles className={`${className} text-cyan-500`} />;
      case 'Users': return <Users className={`${className} text-violet-500`} />;
      case 'BarChart3': return <BarChart3 className={`${className} text-rose-500`} />;
      default: return <Award className={`${className} text-emerald-500`} />;
    }
  };

  const activeCategory = categories.find(c => c.id === selectedCategoryId);
  const categoryProjects = selectedCategoryId
    ? projects.filter(p => p.categoryId === selectedCategoryId)
    : projects;

  const filteredProjects = categoryProjects.filter(p => {
    if (filterStatus === 'all') return true;
    return p.status === filterStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-600" />
            <span>หมวดมาตรฐาน Green & Clean Hospital (9 ด้าน)</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            เกณฑ์การประเมินโรงพยาบาลที่เป็นมิตรกับสิ่งแวดล้อมและเอื้อต่อการมีสุขภาพดี (กรมอนามัย กระทรวงสาธารณสุข)
          </p>
        </div>

        {selectedCategoryId && (
          <button
            onClick={() => onSelectCategory(null)}
            className="text-xs font-medium text-slate-600 hover:text-emerald-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors self-start sm:self-auto"
          >
            ← ดูภาพรวมทั้ง 9 หมวด
          </button>
        )}
      </div>

      {/* Grid of 9 Categories (if no specific category is selected) */}
      {!selectedCategoryId ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => {
            const catProjects = projects.filter(p => p.categoryId === cat.id);
            const count = catProjects.length;
            const avgProgress = count > 0
              ? Math.round(catProjects.reduce((acc, p) => acc + p.progressPercent, 0) / count)
              : 0;
            const completedCount = catProjects.filter(p => p.status === 'completed').length;
            const delayedCount = catProjects.filter(p => p.status === 'delayed').length;

            return (
              <div
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className="bg-white rounded-2xl border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all p-5 flex flex-col justify-between cursor-pointer group"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      {getCategoryIcon(cat.icon, "w-5 h-5")}
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold text-slate-900">{avgProgress}%</span>
                      <div className="text-[10px] text-slate-400">ความก้าวหน้า</div>
                    </div>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                    {cat.name}
                  </h3>
                  <div className="text-xs text-slate-400 font-medium">{cat.nameEn}</div>

                  <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                    {cat.description}
                  </p>

                  {/* Standard KPIs preview */}
                  <div className="mt-3 pt-3 border-t border-slate-100 space-y-1">
                    <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                      เกณฑ์มาตรฐานสำคัญ:
                    </div>
                    {cat.standardKpis.slice(0, 2).map((kpi, idx) => (
                      <div key={idx} className="text-xs text-slate-600 flex items-center gap-1.5 truncate">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                        <span className="truncate">{kpi}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100">
                  {/* Progress bar */}
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-2">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                      style={{ width: `${avgProgress}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <div className="flex items-center gap-2">
                      <span>{count} งาน/โครงการ</span>
                      {delayedCount > 0 && (
                        <span className="text-rose-600 font-medium">({delayedCount} ล่าช้า)</span>
                      )}
                    </div>
                    <span className="text-emerald-600 font-medium flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                      รายละเอียด
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Detailed View of Selected Category */
        activeCategory && (
          <div className="space-y-6">
            
            {/* Category Banner Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
                    {getCategoryIcon(activeCategory.icon, "w-7 h-7")}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-bold text-slate-900">{activeCategory.name}</h3>
                      <span className="text-xs text-slate-400 font-normal">({activeCategory.nameEn})</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
                      {activeCategory.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => onOpenNewProjectModal(activeCategory.id)}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>เพิ่มโครงการในหมวดนี้</span>
                  </button>
                </div>
              </div>

              {/* Standard KPIs block */}
              <div className="mt-5 p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-xs font-bold text-slate-800 mb-2 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>เกณฑ์มาตรฐานและตัวชี้วัด (KPIs) ของหมวด {activeCategory.name}:</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {activeCategory.standardKpis.map((kpi, idx) => (
                    <div key={idx} className="text-xs bg-white p-2 rounded-lg border border-slate-200/80 text-slate-700 flex items-start gap-2">
                      <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{kpi}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Filter Bar for Projects in this category */}
            <div className="flex items-center justify-between flex-wrap gap-3">
              <h4 className="text-sm font-bold text-slate-800">
                รายการโครงการและกิจกรรมในหมวดนี้ ({filteredProjects.length} รายการ)
              </h4>

              <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200 text-xs">
                <button
                  onClick={() => setFilterStatus('all')}
                  className={`px-2.5 py-1 rounded-lg transition-colors ${
                    filterStatus === 'all' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  ทั้งหมด
                </button>
                <button
                  onClick={() => setFilterStatus('completed')}
                  className={`px-2.5 py-1 rounded-lg transition-colors ${
                    filterStatus === 'completed' ? 'bg-emerald-600 text-white font-semibold' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  🟢 สำเร็จ
                </button>
                <button
                  onClick={() => setFilterStatus('in_progress')}
                  className={`px-2.5 py-1 rounded-lg transition-colors ${
                    filterStatus === 'in_progress' ? 'bg-amber-500 text-white font-semibold' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  🟡 กำลังทำ
                </button>
                <button
                  onClick={() => setFilterStatus('delayed')}
                  className={`px-2.5 py-1 rounded-lg transition-colors ${
                    filterStatus === 'delayed' ? 'bg-rose-600 text-white font-semibold' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  🔴 ล่าช้า
                </button>
              </div>
            </div>

            {/* Projects List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredProjects.length === 0 ? (
                <div className="col-span-2 text-center py-12 bg-white rounded-2xl border border-dashed border-slate-200 text-slate-400 text-xs">
                  ยังไม่มีโครงการในหมวดนี้หรือตรงกับตัวกรองที่เลือก
                </div>
              ) : (
                filteredProjects.map((p) => {
                  const statusCfg = getStatusConfig(p.status);
                  const workflow = getWorkflowLevelInfo(p.workflowLevel);
                  return (
                    <div
                      key={p.id}
                      onClick={() => onSelectProject(p)}
                      className="bg-white rounded-2xl border border-slate-200 hover:border-emerald-300 hover:shadow-sm p-5 transition-all cursor-pointer group flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <span className="text-[11px] font-mono text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                            {p.code}
                          </span>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${statusCfg.badgeClass}`}>
                            {statusCfg.iconEmoji} {statusCfg.label}
                          </span>
                        </div>

                        <h4 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-2">
                          {p.name}
                        </h4>
                        
                        <p className="text-xs text-slate-500 mt-2 line-clamp-2">
                          🎯 เป้าหมาย: {p.target}
                        </p>

                        <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-600 space-y-1">
                          <div className="flex justify-between">
                            <span className="text-slate-400">หน่วยงาน:</span>
                            <span className="font-medium">{p.department}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">ผู้รับผิดชอบ:</span>
                            <span className="font-medium">{p.responsiblePerson}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">ระยะเวลา:</span>
                            <span>{p.startDate} - {p.endDate}</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100">
                        <div className="flex items-center justify-between text-xs mb-1.5">
                          <span className="text-slate-500">ความคืบหน้า</span>
                          <span className="font-bold text-slate-800">{p.progressPercent}%</span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${statusCfg.bgProgress}`}
                            style={{ width: `${p.progressPercent}%` }}
                          />
                        </div>

                        <div className="flex items-center justify-between mt-3 text-xs">
                          <span className={`px-2 py-0.5 rounded text-[11px] font-medium border ${workflow.badgeClass}`}>
                            {workflow.iconEmoji} {workflow.shortTitle}
                          </span>
                          <span className="text-slate-400 flex items-center gap-1">
                            📎 {p.evidenceList.length} หลักฐาน
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

          </div>
        )
      )}

    </div>
  );
};
