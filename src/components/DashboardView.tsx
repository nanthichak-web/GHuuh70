import React from 'react';
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  Hourglass,
  Calendar,
  Layers,
  Sparkles,
  ArrowRight,
  TrendingUp,
  FileText,
  Camera,
  Award,
  ChevronRight,
  ShieldCheck,
  Zap,
  Droplets,
  Recycle,
  Trees,
  Building2,
  Users,
  BarChart3
} from 'lucide-react';
import { Project, Category, Meeting, UserRole, StatusType } from '../types';
import { getStatusConfig, getWorkflowLevelInfo } from '../utils/helpers';

interface DashboardViewProps {
  projects: Project[];
  categories: Category[];
  meetings: Meeting[];
  activeRole: UserRole;
  onSelectProject: (p: Project) => void;
  onSelectCategory: (catId: string) => void;
  onNavigateToTab: (tab: string, filterStatus?: StatusType) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  projects,
  categories,
  meetings,
  activeRole,
  onSelectProject,
  onSelectCategory,
  onNavigateToTab
}) => {
  // 1. Calculate Status Counts
  const completedCount = projects.filter(p => p.status === 'completed').length;
  const inProgressCount = projects.filter(p => p.status === 'in_progress').length;
  const pendingVerifyCount = projects.filter(p => p.status === 'pending_verify').length;
  const pendingExecCount = projects.filter(p => p.status === 'pending_exec').length;
  const delayedCount = projects.filter(p => p.status === 'delayed').length;
  const notStartedCount = projects.filter(p => p.status === 'not_started').length;
  const totalProjects = projects.length || 1;

  // 2. Overall Progress calculation (%)
  const totalProgressSum = projects.reduce((acc, p) => acc + p.progressPercent, 0);
  const overallProgress = Math.round(totalProgressSum / totalProjects);

  // 3. Category Progress breakdown
  const categoryStats = categories.map(cat => {
    const catProjects = projects.filter(p => p.categoryId === cat.id);
    const count = catProjects.length;
    const avgProgress = count > 0
      ? Math.round(catProjects.reduce((acc, p) => acc + p.progressPercent, 0) / count)
      : 0;
    const completed = catProjects.filter(p => p.status === 'completed').length;
    return {
      category: cat,
      projectCount: count,
      avgProgress,
      completedCount: completed
    };
  });

  // 4. Meeting Resolutions statistics
  const allResolutions = meetings.flatMap(m => m.resolutions);
  const totalResolutions = allResolutions.length || 1;
  const completedResolutions = allResolutions.filter(r => r.status === 'completed').length;
  const completedResolutionPercent = Math.round((completedResolutions / totalResolutions) * 100);
  const pendingResolutionPercent = 100 - completedResolutionPercent;

  // 5. Urgent / Watchlist Projects (Delayed + Pending Approval + In Progress approaching)
  const urgentProjects = [
    ...projects.filter(p => p.status === 'delayed'),
    ...projects.filter(p => p.status === 'pending_verify' || p.status === 'pending_exec'),
    ...projects.filter(p => p.status === 'in_progress')
  ].slice(0, 5);

  // Category Icon helper
  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Zap': return <Zap className="w-4 h-4 text-amber-600" />;
      case 'Recycle': return <Recycle className="w-4 h-4 text-teal-600" />;
      case 'Droplets': return <Droplets className="w-4 h-4 text-sky-600" />;
      case 'Trees': return <Trees className="w-4 h-4 text-emerald-600" />;
      case 'Building2': return <Building2 className="w-4 h-4 text-indigo-600" />;
      case 'Sparkles': return <Sparkles className="w-4 h-4 text-cyan-600" />;
      case 'Users': return <Users className="w-4 h-4 text-violet-600" />;
      case 'BarChart3': return <BarChart3 className="w-4 h-4 text-rose-600" />;
      default: return <Award className="w-4 h-4 text-emerald-600" />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Banner & Executive Overview Summary */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-400/30">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>GCH Evaluation Ready • เกณฑ์ประเมินระดับพัฒนาสู่ความยั่งยืน</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              ระบบติดตามผลการดำเนินงาน Green & Clean Hospital
            </h1>
            <p className="text-sm text-emerald-100/80 leading-relaxed">
              ภาพรวมความก้าวหน้าตามเกณฑ์ 9 หมวดมาตรฐาน ยึดหลักฐานเชิงประจักษ์ (Evidence-Based) 
              และระบบลำดับขั้นการรับรอง Workflow 5 ระดับ
            </p>
          </div>

          {/* Overall Progress Gauge Widget */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 sm:p-5 border border-white/15 flex items-center gap-5 shrink-0 self-stretch sm:self-auto justify-between sm:justify-start">
            <div className="relative flex items-center justify-center w-20 h-20">
              <svg className="w-20 h-20 -rotate-90 transform" viewBox="0 0 36 36">
                <path
                  className="text-white/20"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-emerald-400 transition-all duration-1000 ease-out"
                  strokeDasharray={`${overallProgress}, 100`}
                  strokeLinecap="round"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-xl font-extrabold text-white leading-none">
                  {overallProgress}%
                </span>
                <span className="text-[10px] text-emerald-200 mt-0.5">ภาพรวม</span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-xs text-emerald-200 font-medium">ความก้าวหน้ารวม</div>
              <div className="text-base font-bold text-white">Green Care Track</div>
              <div className="text-xs text-emerald-300/90 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>สำเร็จแล้ว {completedCount} จาก {totalProjects} โครงการ</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 1. Status Cards Grid (6 Status Types per requirement) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <span>สถานะโครงการและกิจกรรมทั้งหมด</span>
            <span className="text-xs font-normal text-slate-500">(คลิกเพื่อกรองรายการ)</span>
          </h2>
          <button
            onClick={() => onNavigateToTab('projects')}
            className="text-xs font-medium text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
          >
            <span>ดูรายการทั้งหมด</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* Completed 🟢 */}
          <button
            onClick={() => onNavigateToTab('projects', 'completed')}
            className="p-3.5 rounded-xl bg-white border border-emerald-200 hover:border-emerald-400 hover:shadow-sm text-left transition-all group"
          >
            <div className="flex items-center justify-between text-xs font-medium text-emerald-700">
              <span>🟢 ดำเนินการแล้ว</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-500 group-hover:scale-110 transition-transform" />
            </div>
            <div className="mt-2 text-2xl font-bold text-slate-900">{completedCount}</div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              {Math.round((completedCount / totalProjects) * 100)}% ของงานทั้งหมด
            </div>
          </button>

          {/* In Progress 🟡 */}
          <button
            onClick={() => onNavigateToTab('projects', 'in_progress')}
            className="p-3.5 rounded-xl bg-white border border-amber-200 hover:border-amber-400 hover:shadow-sm text-left transition-all group"
          >
            <div className="flex items-center justify-between text-xs font-medium text-amber-700">
              <span>🟡 กำลังดำเนินการ</span>
              <Clock className="w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform" />
            </div>
            <div className="mt-2 text-2xl font-bold text-slate-900">{inProgressCount}</div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              {Math.round((inProgressCount / totalProjects) * 100)}% ของงานทั้งหมด
            </div>
          </button>

          {/* Pending Verify 🟠 */}
          <button
            onClick={() => onNavigateToTab('projects', 'pending_verify')}
            className="p-3.5 rounded-xl bg-white border border-orange-200 hover:border-orange-400 hover:shadow-sm text-left transition-all group"
          >
            <div className="flex items-center justify-between text-xs font-medium text-orange-700">
              <span>🟠 รอตรวจสอบ</span>
              <Hourglass className="w-4 h-4 text-orange-500 group-hover:scale-110 transition-transform" />
            </div>
            <div className="mt-2 text-2xl font-bold text-slate-900">{pendingVerifyCount}</div>
            <div className="text-[11px] text-slate-500 mt-0.5">รอหัวหน้างานรับรอง</div>
          </button>

          {/* Pending Executive 🔵 */}
          <button
            onClick={() => onNavigateToTab('projects', 'pending_exec')}
            className="p-3.5 rounded-xl bg-white border border-blue-200 hover:border-blue-400 hover:shadow-sm text-left transition-all group"
          >
            <div className="flex items-center justify-between text-xs font-medium text-blue-700">
              <span>🔵 รอผู้บริหาร</span>
              <Award className="w-4 h-4 text-blue-500 group-hover:scale-110 transition-transform" />
            </div>
            <div className="mt-2 text-2xl font-bold text-slate-900">{pendingExecCount}</div>
            <div className="text-[11px] text-slate-500 mt-0.5">รอผู้บริหารพิจารณา</div>
          </button>

          {/* Delayed 🔴 */}
          <button
            onClick={() => onNavigateToTab('projects', 'delayed')}
            className="p-3.5 rounded-xl bg-white border border-rose-200 hover:border-rose-400 hover:shadow-sm text-left transition-all group"
          >
            <div className="flex items-center justify-between text-xs font-medium text-rose-700">
              <span>🔴 ล่าช้ากว่ากำหนด</span>
              <AlertCircle className="w-4 h-4 text-rose-500 group-hover:scale-110 transition-transform" />
            </div>
            <div className="mt-2 text-2xl font-bold text-rose-600">{delayedCount}</div>
            <div className="text-[11px] text-rose-500 mt-0.5">ต้องเร่งรัด/แก้ไข</div>
          </button>

          {/* Not Started ⚪ */}
          <button
            onClick={() => onNavigateToTab('projects', 'not_started')}
            className="p-3.5 rounded-xl bg-white border border-slate-200 hover:border-slate-400 hover:shadow-sm text-left transition-all group"
          >
            <div className="flex items-center justify-between text-xs font-medium text-slate-600">
              <span>⚪ ยังไม่เริ่ม</span>
              <span className="text-slate-400 font-bold">•</span>
            </div>
            <div className="mt-2 text-2xl font-bold text-slate-900">{notStartedCount}</div>
            <div className="text-[11px] text-slate-500 mt-0.5">เตรียมการ/ตามแผน</div>
          </button>
        </div>
      </div>

      {/* Main Content 2-Column: Category Breakdown (Left) vs Urgent + Meetings (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Col: ผลการดำเนินงานรายหมวด (9 Categories) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-emerald-600" />
                  <span>ผลการดำเนินงานรายหมวด (9 หมวดมาตรฐาน GCH)</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  ความก้าวหน้าเฉลี่ยของกิจกรรมและโครงการในแต่ละด้าน
                </p>
              </div>
              <button
                onClick={() => onNavigateToTab('categories')}
                className="text-xs font-medium text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
              >
                <span>ดูทั้งหมด</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3.5">
              {categoryStats.map((item) => (
                <div
                  key={item.category.id}
                  onClick={() => onSelectCategory(item.category.id)}
                  className="p-2.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between gap-3 text-xs mb-1.5">
                    <div className="flex items-center gap-2 font-medium text-slate-800">
                      <div className="w-6 h-6 rounded-md bg-slate-100 flex items-center justify-center shrink-0">
                        {getCategoryIcon(item.category.icon)}
                      </div>
                      <span className="font-semibold text-slate-900">{item.category.name}</span>
                      <span className="text-[11px] text-slate-400">({item.projectCount} โครงการ)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-800">{item.avgProgress}%</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden flex">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        item.avgProgress >= 80
                          ? 'bg-emerald-500'
                          : item.avgProgress >= 50
                          ? 'bg-amber-500'
                          : item.avgProgress > 0
                          ? 'bg-sky-500'
                          : 'bg-slate-300'
                      }`}
                      style={{ width: `${item.avgProgress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Urgent Tasks & Meeting Summary */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* ⚠️ งานที่ต้องติดตาม (Urgent / Approvals Needed) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-rose-500" />
                <span>⚠️ งานที่ต้องติดตาม / รอการพิจารณา</span>
              </h3>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                {urgentProjects.length} รายการ
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-3">
              งานที่ล่าช้าเกินกำหนด หรือกำลังรอการรับรองจากหัวหน้างาน/ผู้บริหาร
            </p>

            <div className="divide-y divide-slate-100">
              {urgentProjects.map((p) => {
                const statusCfg = getStatusConfig(p.status);
                const workflow = getWorkflowLevelInfo(p.workflowLevel);
                return (
                  <div
                    key={p.id}
                    onClick={() => onSelectProject(p)}
                    className="py-3 first:pt-0 last:pb-0 hover:bg-slate-50 rounded-lg p-2 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold border ${statusCfg.badgeClass}`}>
                            {statusCfg.iconEmoji} {statusCfg.shortLabel}
                          </span>
                          <span className="text-[10px] text-slate-500 font-medium bg-slate-100 px-1.5 py-0.5 rounded">
                            {p.department}
                          </span>
                        </div>
                        <h4 className="text-xs font-semibold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-1">
                          {p.name}
                        </h4>
                        <div className="text-[11px] text-slate-500 flex items-center gap-2">
                          <span>👤 {p.responsiblePerson}</span>
                          <span>•</span>
                          <span>{workflow.shortTitle}</span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-xs font-bold text-slate-800">{p.progressPercent}%</span>
                        <div className="w-12 h-1.5 bg-slate-100 rounded-full mt-1 overflow-hidden">
                          <div
                            className={`h-full ${statusCfg.bgProgress}`}
                            style={{ width: `${p.progressPercent}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 📅 การประชุม (Meeting Tracking Overview) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-teal-600" />
                <span>📅 การประชุมและการติดตามมติ</span>
              </h3>
              <button
                onClick={() => onNavigateToTab('meetings')}
                className="text-xs font-medium text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
              >
                <span>ดูการประชุม</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center py-3 bg-slate-50 rounded-xl border border-slate-200/80 mb-3">
              <div>
                <div className="text-xl font-bold text-slate-900">{meetings.length} ครั้ง</div>
                <div className="text-[11px] text-slate-500 mt-0.5">ประชุมทั้งหมด</div>
              </div>
              <div className="border-x border-slate-200">
                <div className="text-xl font-bold text-emerald-600">{completedResolutionPercent}%</div>
                <div className="text-[11px] text-slate-500 mt-0.5">มติที่สำเร็จแล้ว</div>
              </div>
              <div>
                <div className="text-xl font-bold text-amber-600">{pendingResolutionPercent}%</div>
                <div className="text-[11px] text-slate-500 mt-0.5">มติที่ยังติดตาม</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-700">การประชุมล่าสุด:</div>
              {meetings.slice(0, 2).map((m) => (
                <div
                  key={m.id}
                  onClick={() => onNavigateToTab('meetings')}
                  className="p-2.5 rounded-lg border border-slate-100 hover:border-teal-200 hover:bg-teal-50/40 transition-colors cursor-pointer text-xs"
                >
                  <div className="font-semibold text-slate-800">{m.title}</div>
                  <div className="text-[11px] text-slate-500 flex items-center justify-between mt-1">
                    <span>📅 {m.date} ({m.time})</span>
                    <span className="text-teal-700 font-medium">{m.resolutions.length} มติที่ประชุม</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
