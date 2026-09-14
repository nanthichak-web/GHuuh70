import React, { useState } from 'react';
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
  BarChart3,
  KeyRound,
  Lock,
  Eye,
  EyeOff,
  UserCheck,
  Shield
} from 'lucide-react';
import {
  Project,
  Category,
  Meeting,
  UserRole,
  StatusType,
  UserSession,
  AuthorizedUser,
  AccessLevel,
  LEVEL_PASSWORDS
} from '../types';
import { getStatusConfig, getWorkflowLevelInfo, getAccessLevelConfig } from '../utils/helpers';
import { recordAccessLog } from '../lib/firebase';

interface DashboardViewProps {
  projects: Project[];
  categories: Category[];
  meetings: Meeting[];
  activeRole: UserRole;
  currentSession: UserSession | null;
  authorizedUsers: AuthorizedUser[];
  onLoginSuccess: (session: UserSession) => void;
  onOpenLoginModal?: () => void;
  onSelectProject: (p: Project) => void;
  onSelectCategory: (catId: string) => void;
  onNavigateToTab: (tab: string, filterStatus?: StatusType) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  projects,
  categories,
  meetings,
  activeRole,
  currentSession,
  authorizedUsers,
  onLoginSuccess,
  onOpenLoginModal,
  onSelectProject,
  onSelectCategory,
  onNavigateToTab
}) => {
  // Executive Quick Login Form State (on-dashboard)
  const [execLevel, setExecLevel] = useState<AccessLevel>('4');
  const [execUserId, setExecUserId] = useState<string>('');
  const [execCustomName, setExecCustomName] = useState<string>('');
  const [execPassword, setExecPassword] = useState<string>('');
  const [showExecPassword, setShowExecPassword] = useState<boolean>(false);
  const [execLoginError, setExecLoginError] = useState<string>('');
  const [isSubmittingExecLogin, setIsSubmittingExecLogin] = useState<boolean>(false);

  const isExecutiveUser = currentSession && ['3', '4', '5', 'admin'].includes(currentSession.level);

  // Handle Executive Sign-in from dashboard
  const handleExecLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setExecLoginError('');

    let nameToUse = execCustomName.trim();
    if (execUserId) {
      const found = authorizedUsers.find(u => u.id === execUserId);
      if (found) nameToUse = found.name;
    }

    if (!nameToUse) {
      setExecLoginError('กรุณาเลือกรายชื่อผู้บริหาร หรือระบุชื่อ-นามสกุล');
      return;
    }

    const expectedPwd = LEVEL_PASSWORDS[execLevel];
    if (execPassword !== expectedPwd) {
      setExecLoginError(`รหัสผ่านไม่ถูกต้อง สำหรับ${getAccessLevelConfig(execLevel).shortTitle} กรุณาตรวจสอบรหัสผ่านอีกครั้ง`);
      return;
    }

    setIsSubmittingExecLogin(true);
    try {
      const now = new Date();
      const thaiDateStr = `${now.toLocaleDateString('th-TH', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      })} เวลา ${now.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })} น.`;

      const levelConfig = getAccessLevelConfig(execLevel);
      const session: UserSession = {
        userName: nameToUse,
        level: execLevel,
        levelLabel: levelConfig.title,
        loginTime: thaiDateStr,
        role: levelConfig.role
      };

      // Record access log
      const logEntry = {
        id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        userName: nameToUse,
        level: execLevel,
        levelLabel: levelConfig.title,
        loginTime: thaiDateStr,
        timestampMs: Date.now(),
        deviceInfo: typeof navigator !== 'undefined' ? navigator.userAgent.split(')')[0] + ')' : 'Web Client',
        status: 'success' as const
      };
      await recordAccessLog(logEntry);

      onLoginSuccess(session);
      setExecPassword('');
    } catch (err) {
      setExecLoginError('เกิดข้อผิดพลาดในการเข้าสู่ระบบ กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsSubmittingExecLogin(false);
    }
  };

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

  // 3. Projects waiting for Executive approval
  const pendingExecutiveApprovals = projects.filter(
    p => p.status === 'pending_exec' || p.workflowLevel === 3 || p.workflowLevel === 4
  );

  // 4. Certification Level Evaluation
  const getHospitalCertificationTier = () => {
    if (overallProgress >= 90 && completedCount >= totalProjects * 0.8) {
      return {
        tier: 'ระดับดีเยี่ยม (Excellence Level)',
        badge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        desc: 'ผ่านเกณฑ์มาตรฐานครบ 9 หมวด และมีการขับเคลื่อนเชิงนวัตกรรมสิ่งแวดล้อม'
      };
    } else if (overallProgress >= 75) {
      return {
        tier: 'ระดับดีมาก (Advanced Level)',
        badge: 'bg-teal-100 text-teal-800 border-teal-300',
        desc: 'ผ่านเกณฑ์มาตรฐานพื้นฐานครบถ้วน มีหลักฐานเชิงประจักษ์ชัดเจน'
      };
    } else if (overallProgress >= 60) {
      return {
        tier: 'ระดับดี (Standard Level)',
        badge: 'bg-amber-100 text-amber-800 border-amber-300',
        desc: 'ผ่านเกณฑ์มาตรฐานจำเป็น กำลังพัฒนาสู่เกณฑ์ขั้นสูง'
      };
    }
    return {
      tier: 'ระดับพัฒนาสู่มาตรฐาน (Developing Level)',
      badge: 'bg-slate-100 text-slate-700 border-slate-300',
      desc: 'กำลังขับเคลื่อนกิจกรรมตามแผนงานและรวบรวมหลักฐานเชิงประจักษ์'
    };
  };

  const certTier = getHospitalCertificationTier();

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

            {/* Certification Tier Indicator */}
            <div className="pt-1 flex items-center gap-2 flex-wrap">
              <span className="text-xs text-emerald-200">เกณฑ์ประเมิน รพ. ปัจจุบัน:</span>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border ${certTier.badge}`}>
                <Award className="w-3.5 h-3.5" />
                <span>{certTier.tier}</span>
              </span>
            </div>
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

      {/* EXECUTIVE SIGN-IN / COMMAND BANNER */}
      {isExecutiveUser ? (
        <div className="bg-emerald-900/90 text-white rounded-2xl p-4 sm:p-5 border border-emerald-700/50 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-700/80 border border-emerald-500 text-white flex items-center justify-center text-lg shadow-xs shrink-0">
              🏛️
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
                  ยืนยันสิทธิ์ผู้บริหารแล้ว (Executive Verified)
                </span>
                <span className="px-2 py-0.2 rounded-full text-[10px] font-extrabold bg-emerald-500/30 border border-emerald-400/40 text-emerald-200">
                  {currentSession.level === 'admin' ? 'Super Admin' : `ระดับ ${currentSession.level}`}
                </span>
              </div>
              <div className="text-sm sm:text-base font-bold text-white">
                {currentSession.userName} — {currentSession.levelLabel}
              </div>
              <div className="text-xs text-emerald-200/80 mt-0.5">
                ท่านได้รับสิทธิ์ลงนามอนุมัติคำสั่งการระดับ รพ. และรับรองผลการตรวจประเมิน GCH
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
            {pendingExecutiveApprovals.length > 0 && (
              <span className="px-3 py-1 rounded-lg bg-amber-500 text-amber-950 text-xs font-bold flex items-center gap-1.5 shadow-xs">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>รอผู้บริหารอนุมัติ {pendingExecutiveApprovals.length} รายการ</span>
              </span>
            )}
            {onOpenLoginModal && (
              <button
                onClick={onOpenLoginModal}
                className="px-3 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-emerald-100 text-xs font-medium border border-emerald-600 transition-colors"
              >
                สลับผู้ใช้งาน
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-r from-amber-50 via-emerald-50/70 to-teal-50/70 rounded-2xl p-5 border border-amber-200/80 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-base shadow-2xs shrink-0">
                🏛️
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                  <span>ศูนย์ลงชื่อเข้าใช้งานสำหรับผู้บริหาร (Executive Access Portal)</span>
                  <span className="text-[11px] font-normal text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded-full border border-amber-300">
                    ยืนยันตัวตนด้วยรหัสผ่าน
                  </span>
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  สำหรับผู้อำนวยการ รพ., รอง ผอ., หัวหน้ากลุ่มงาน และกรรมการตรวจประเมิน GCH เพื่อปลดล็อกสิทธิ์ลงนามอนุมัติ
                </p>
              </div>
            </div>

            {onOpenLoginModal && (
              <button
                onClick={onOpenLoginModal}
                className="text-xs text-emerald-800 hover:text-emerald-950 font-semibold underline underline-offset-2 shrink-0"
              >
                เปิดหน้าต่างเข้าสู่ระบบเต็มรูปแบบ
              </button>
            )}
          </div>

          {/* Quick Inline Executive Login Form */}
          <form onSubmit={handleExecLogin} className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-2xs space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
              
              {/* Level Selector */}
              <div className="sm:col-span-4 space-y-1">
                <label className="block text-xs font-bold text-slate-700">
                  เลือกระดับผู้บริหาร:
                </label>
                <select
                  value={execLevel}
                  onChange={(e) => {
                    setExecLevel(e.target.value as AccessLevel);
                    setExecPassword('');
                    setExecLoginError('');
                  }}
                  className="w-full text-xs rounded-lg border border-slate-300 p-2 bg-slate-50/50 focus:ring-2 focus:ring-emerald-500 focus:outline-none font-medium"
                >
                  <option value="3">ระดับ 3: ผู้บริหารขั้นต้น (หน.กลุ่มงาน/ฝ่าย)</option>
                  <option value="4">ระดับ 4: ผู้บริหารขั้นสูง (ผอ./รอง ผอ. รพ.)</option>
                  <option value="5">ระดับ 5: ผู้ประเมินภายนอก (กรรมการ GCH)</option>
                </select>
              </div>

              {/* User Selection or Name */}
              <div className="sm:col-span-4 space-y-1">
                <label className="block text-xs font-bold text-slate-700">
                  ชื่อผู้บริหาร:
                </label>
                <div className="flex gap-1.5">
                  <select
                    value={execUserId}
                    onChange={(e) => {
                      setExecUserId(e.target.value);
                      if (e.target.value) setExecCustomName('');
                    }}
                    className="w-full text-xs rounded-lg border border-slate-300 p-2 bg-slate-50/50 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="">-- เลือกจากรายชื่อ --</option>
                    {authorizedUsers
                      .filter(u => u.allowedLevels.includes(execLevel) || u.allowedLevels.some(l => ['3', '4', '5'].includes(l)))
                      .map(u => (
                        <option key={u.id} value={u.id}>
                          {u.name} ({u.position})
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              {/* Password Input */}
              <div className="sm:col-span-4 space-y-1">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-700">
                    รหัสผ่าน:
                  </label>
                  <span className="text-[10px] text-slate-400">
                    🔒 รหัสความปลอดภัย
                  </span>
                </div>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type={showExecPassword ? 'text' : 'password'}
                      value={execPassword}
                      onChange={(e) => {
                        setExecPassword(e.target.value);
                        setExecLoginError('');
                      }}
                      placeholder="กรอกรหัสผ่าน"
                      className="w-full text-xs font-mono rounded-lg border border-slate-300 p-2 pl-7 pr-8 bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                    <KeyRound className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-2.5" />
                    <button
                      type="button"
                      onClick={() => setShowExecPassword(!showExecPassword)}
                      className="absolute right-2 top-2 text-slate-400 hover:text-slate-600"
                    >
                      {showExecPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmittingExecLogin}
                    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white text-xs font-bold rounded-lg shadow-xs hover:shadow transition-all whitespace-nowrap flex items-center gap-1.5 shrink-0"
                  >
                    <span>ยืนยันตัวตน</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>

            {/* Custom Name fallback if not in dropdown */}
            {!execUserId && (
              <div className="text-[11px] text-slate-500 flex items-center gap-2 pt-1 border-t border-slate-100">
                <span>หากไม่มีชื่อในรายการ:</span>
                <input
                  type="text"
                  value={execCustomName}
                  onChange={(e) => setExecCustomName(e.target.value)}
                  placeholder="พิมพ์ชื่อ-สกุลผู้บริหาร เช่น นพ.สมศักดิ์ วงศ์สวัสดิ์"
                  className="text-xs rounded-md border border-slate-200 px-2 py-1 max-w-xs focus:outline-none focus:border-emerald-500"
                />
              </div>
            )}

            {execLoginError && (
              <div className="p-2 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                <span>{execLoginError}</span>
              </div>
            )}
          </form>
        </div>
      )}

      {/* PENDING EXECUTIVE APPROVAL QUEUE (If any projects waiting) */}
      {pendingExecutiveApprovals.length > 0 && (
        <div className="bg-amber-50/80 rounded-2xl border border-amber-200 p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-500 text-white flex items-center justify-center font-bold text-xs shadow-2xs">
                !
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  คิวงานรอการลงนาม/รับรองจากผู้บริหาร ({pendingExecutiveApprovals.length} รายการ)
                </h3>
                <p className="text-xs text-amber-800">
                  โครงการที่ผ่านการตรวจรับรองเบื้องต้นแล้ว และรอหัวหน้าฝ่าย/ผอ. ลงนามรับรองผล
                </p>
              </div>
            </div>
            <button
              onClick={() => onNavigateToTab('projects', 'pending_exec')}
              className="text-xs font-semibold text-amber-900 hover:text-amber-950 flex items-center gap-1"
            >
              <span>ดูคิวงานทั้งหมด</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
            {pendingExecutiveApprovals.slice(0, 3).map((p) => {
              const workflow = getWorkflowLevelInfo(p.workflowLevel);
              return (
                <div
                  key={p.id}
                  onClick={() => onSelectProject(p)}
                  className="bg-white rounded-xl p-3.5 border border-amber-200 hover:border-amber-400 hover:shadow-sm cursor-pointer transition-all space-y-2 group"
                >
                  <div className="flex items-center justify-between gap-1 text-[11px]">
                    <span className="font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                      {workflow.shortTitle}
                    </span>
                    <span className="text-slate-500">{p.department}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-2">
                    {p.name}
                  </h4>
                  <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1 border-t border-slate-100">
                    <span>ผู้รับผิดชอบ: {p.responsiblePerson}</span>
                    <span className="font-bold text-emerald-700">ก้าวหน้า {p.progressPercent}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

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
