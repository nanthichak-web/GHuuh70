import React, { useState } from 'react';
import {
  Search,
  Filter,
  Plus,
  FileSpreadsheet,
  Calendar,
  Layers,
  Building,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Camera,
  ChevronRight,
  SlidersHorizontal,
  LayoutGrid,
  List
} from 'lucide-react';
import { Project, Category, StatusType, WorkflowLevel } from '../types';
import { getStatusConfig, getWorkflowLevelInfo, exportToExcel } from '../utils/helpers';

interface ProjectsViewProps {
  projects: Project[];
  categories: Category[];
  initialFilterStatus?: StatusType;
  onSelectProject: (p: Project) => void;
  onOpenNewProjectModal: () => void;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({
  projects,
  categories,
  initialFilterStatus,
  onSelectProject,
  onOpenNewProjectModal
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>(initialFilterStatus || 'all');
  const [selectedWorkflow, setSelectedWorkflow] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Extract unique departments for filter
  const departments = Array.from(new Set(projects.map(p => p.department)));

  // Filter logic
  const filteredProjects = projects.filter(p => {
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchCode = p.code.toLowerCase().includes(q);
      const matchResp = p.responsiblePerson.toLowerCase().includes(q);
      const matchTarget = p.target.toLowerCase().includes(q);
      const matchDept = p.department.toLowerCase().includes(q);
      if (!matchName && !matchCode && !matchResp && !matchTarget && !matchDept) return false;
    }

    // Category
    if (selectedCategory !== 'all' && p.categoryId !== selectedCategory) return false;

    // Status
    if (selectedStatus !== 'all' && p.status !== selectedStatus) return false;

    // Workflow
    if (selectedWorkflow !== 'all' && p.workflowLevel.toString() !== selectedWorkflow) return false;

    // Year
    if (selectedYear !== 'all' && p.fiscalYear.toString() !== selectedYear) return false;

    return true;
  });

  const handleExport = () => {
    const rows = filteredProjects.map(p => {
      const cat = categories.find(c => c.id === p.categoryId)?.name || p.categoryId;
      const statusCfg = getStatusConfig(p.status);
      const wf = getWorkflowLevelInfo(p.workflowLevel);
      return {
        'รหัสโครงการ': p.code,
        'ชื่อโครงการ/กิจกรรม': p.name,
        'หมวดมาตรฐาน GCH': cat,
        'หน่วยงาน': p.department,
        'ผู้รับผิดชอบ': p.responsiblePerson,
        'ตำแหน่ง': p.responsiblePosition,
        'วันที่เริ่ม': p.startDate,
        'กำหนดเสร็จ': p.endDate,
        'เป้าหมาย': p.target,
        'ความคืบหน้า (%)': `${p.progressPercent}%`,
        'สถานะ': statusCfg.label,
        'ระดับ Workflow': wf.title,
        'จำนวนหลักฐานแนบ': p.evidenceList.length,
        'ปีงบประมาณ': p.fiscalYear
      };
    });
    exportToExcel('Green_Care_Track_Projects', rows);
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      
      {/* Top Action & Filter Bar */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <span>📋 รายการงานและโครงการ Green & Clean Hospital</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              แสดงโครงการทั้งหมด {filteredProjects.length} จาก {projects.length} รายการ
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExport}
              className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 text-xs font-semibold rounded-xl transition-colors"
              title="ส่งออกไฟล์ Excel (.csv)"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>Export Excel</span>
            </button>

            <button
              onClick={onOpenNewProjectModal}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>สร้างงาน/โครงการใหม่</span>
            </button>

            {/* View Mode Toggle */}
            <div className="hidden sm:flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'grid' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
                title="มุมมองแบบการ์ด (Grid)"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'table' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
                title="มุมมองแบบตาราง (Table)"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-3 border-t border-slate-100 text-xs">
          
          {/* Search Box */}
          <div className="relative lg:col-span-2">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ค้นหาชื่อโครงการ, ผู้รับผิดชอบ, เป้าหมาย..."
              className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-xs"
            />
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs text-slate-700"
            >
              <option value="all">📂 ทุกหมวดมาตรฐาน (9 ด้าน)</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* 4-Color Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs text-slate-700"
            >
              <option value="all">🔘 ทุกสถานะ</option>
              <option value="completed">🟢 ดำเนินการแล้ว/ผ่าน</option>
              <option value="pending_verify">🟠 รอตรวจสอบ/รับรอง</option>
              <option value="pending_exec">🔵 รอผู้บริหารพิจารณา</option>
              <option value="in_progress">🟡 อยู่ระหว่างดำเนินการ</option>
              <option value="delayed">🔴 ล่าช้ากว่ากำหนด</option>
              <option value="not_started">⚪ ยังไม่เริ่มดำเนินการ</option>
            </select>
          </div>

          {/* Workflow Level Filter */}
          <div>
            <select
              value={selectedWorkflow}
              onChange={(e) => setSelectedWorkflow(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs text-slate-700"
            >
              <option value="all">👥 ทุกระดับ Workflow (1-5)</option>
              <option value="1">👤 ระดับ 1: ผู้รับผิดชอบ</option>
              <option value="2">👨‍💼 ระดับ 2: ผู้รับรอง</option>
              <option value="3">👔 ระดับ 3: ผู้บริหารขั้นต้น</option>
              <option value="4">🏥 ระดับ 4: ผู้บริหารขั้นสูง</option>
              <option value="5">✅ ระดับ 5: รับรองสมบูรณ์</option>
            </select>
          </div>

        </div>

      </div>

      {/* Content Rendering: Grid Mode or Table Mode */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-200 text-slate-400">
          <Layers className="w-10 h-10 mx-auto text-slate-300 mb-2" />
          <div className="text-sm font-semibold text-slate-600">ไม่พบโครงการที่ตรงกับเงื่อนไขการค้นหา</div>
          <p className="text-xs text-slate-400 mt-1">ลองเปลี่ยนคำค้นหาหรือล้างตัวกรอง</p>
        </div>
      ) : viewMode === 'grid' ? (
        /* Grid Mode */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProjects.map((p) => {
            const statusCfg = getStatusConfig(p.status);
            const workflow = getWorkflowLevelInfo(p.workflowLevel);
            const category = categories.find(c => c.id === p.categoryId);
            const photoCount = p.evidenceList.filter(e => e.type === 'photo').length;
            const docCount = p.evidenceList.filter(e => e.type === 'document' || e.type === 'data').length;

            return (
              <div
                key={p.id}
                onClick={() => onSelectProject(p)}
                className="bg-white rounded-2xl border border-slate-200 hover:border-emerald-400 hover:shadow-md transition-all p-5 flex flex-col justify-between cursor-pointer group"
              >
                <div>
                  {/* Card Header: Code & 4-Color Status Badge */}
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      {p.code}
                    </span>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${statusCfg.badgeClass}`}>
                      <span>{statusCfg.iconEmoji}</span>
                      <span>{statusCfg.label}</span>
                    </span>
                  </div>

                  {/* Category Pill */}
                  <div className="mb-2">
                    <span className="text-[10px] font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      {category?.name || p.categoryId}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-2 mb-2">
                    {p.name}
                  </h3>

                  {/* Target */}
                  <p className="text-xs text-slate-600 line-clamp-2 mb-3 leading-relaxed">
                    <span className="font-semibold text-slate-700">เป้าหมาย:</span> {p.target}
                  </p>

                  {/* Details */}
                  <div className="text-xs text-slate-500 space-y-1.5 pt-2.5 border-t border-slate-100">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">หน่วยงาน:</span>
                      <span className="font-medium text-slate-700 truncate max-w-[160px]">{p.department}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">ผู้รับผิดชอบ:</span>
                      <span className="font-medium text-slate-700">{p.responsiblePerson}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">กำหนดเสร็จ:</span>
                      <span className="font-medium text-slate-700">{p.endDate}</span>
                    </div>
                  </div>
                </div>

                {/* Card Footer: Progress & Workflow & Evidence */}
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-slate-500">ความก้าวหน้า</span>
                    <span className="font-bold text-slate-800">{p.progressPercent}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-3">
                    <div
                      className={`h-full ${statusCfg.bgProgress} rounded-full transition-all duration-500`}
                      style={{ width: `${p.progressPercent}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${workflow.badgeClass}`}>
                      {workflow.iconEmoji} {workflow.shortTitle}
                    </span>
                    <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                      {photoCount > 0 && <span>📷 {photoCount}</span>}
                      {docCount > 0 && <span>📄 {docCount}</span>}
                      {photoCount === 0 && docCount === 0 && <span>📎 0</span>}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table Mode */
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3">รหัส</th>
                  <th className="px-4 py-3">ชื่อโครงการ / กิจกรรม</th>
                  <th className="px-4 py-3">หมวด</th>
                  <th className="px-4 py-3">หน่วยงาน</th>
                  <th className="px-4 py-3">ผู้รับผิดชอบ</th>
                  <th className="px-4 py-3 text-center">ความคืบหน้า</th>
                  <th className="px-4 py-3">สถานะ</th>
                  <th className="px-4 py-3">Workflow</th>
                  <th className="px-4 py-3 text-center">หลักฐาน</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredProjects.map((p) => {
                  const statusCfg = getStatusConfig(p.status);
                  const workflow = getWorkflowLevelInfo(p.workflowLevel);
                  const category = categories.find(c => c.id === p.categoryId);
                  return (
                    <tr
                      key={p.id}
                      onClick={() => onSelectProject(p)}
                      className="hover:bg-emerald-50/40 cursor-pointer transition-colors"
                    >
                      <td className="px-4 py-3 font-mono text-slate-500 whitespace-nowrap">
                        {p.code}
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-900 max-w-xs">
                        <div className="font-semibold line-clamp-1">{p.name}</div>
                        <div className="text-[11px] text-slate-400 line-clamp-1">{p.target}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-medium">
                          {category?.name || p.categoryId}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{p.department}</td>
                      <td className="px-4 py-3 whitespace-nowrap">{p.responsiblePerson}</td>
                      <td className="px-4 py-3 text-center whitespace-nowrap">
                        <span className="font-bold text-slate-800">{p.progressPercent}%</span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${statusCfg.badgeClass}`}>
                          <span>{statusCfg.iconEmoji}</span>
                          <span>{statusCfg.shortLabel}</span>
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-medium border ${workflow.badgeClass}`}>
                          {workflow.iconEmoji} {workflow.shortTitle}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center whitespace-nowrap font-medium text-slate-500">
                        📎 {p.evidenceList.length}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
