import React, { useState } from 'react';
import {
  ShieldAlert,
  Users,
  History,
  FolderKanban,
  Calendar,
  Plus,
  Trash2,
  Edit,
  Search,
  Filter,
  Download,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  KeyRound,
  Shield,
  Layers,
  ChevronRight,
  UserCheck,
  RefreshCw
} from 'lucide-react';
import {
  AccessLogEntry,
  AuthorizedUser,
  Project,
  Meeting,
  Category,
  AccessLevel,
  UserRole
} from '../types';
import { getAccessLevelConfig, exportToExcel } from '../utils/helpers';

interface AdminConsoleViewProps {
  accessLogs: AccessLogEntry[];
  authorizedUsers: AuthorizedUser[];
  projects: Project[];
  meetings: Meeting[];
  categories: Category[];
  isAdmin: boolean;
  onSaveAuthorizedUser: (user: AuthorizedUser) => void;
  onDeleteAuthorizedUser: (userId: string) => void;
  onDeleteAccessLog: (logId: string) => void;
  onClearAccessLogs: () => void;
  onEditProject: (project: Project) => void;
  onDeleteProject: (projectId: string) => void;
  onDeleteMeeting: (meetingId: string) => void;
  onOpenLoginModal: () => void;
}

export const AdminConsoleView: React.FC<AdminConsoleViewProps> = ({
  accessLogs,
  authorizedUsers,
  projects,
  meetings,
  categories,
  isAdmin,
  onSaveAuthorizedUser,
  onDeleteAuthorizedUser,
  onDeleteAccessLog,
  onClearAccessLogs,
  onEditProject,
  onDeleteProject,
  onDeleteMeeting,
  onOpenLoginModal
}) => {
  const [activeTab, setActiveTab] = useState<'logs' | 'users' | 'projects' | 'meetings'>('logs');
  
  // Search & Filter States for Logs
  const [logSearchQuery, setLogSearchQuery] = useState('');
  const [logLevelFilter, setLogLevelFilter] = useState<string>('all');

  // New/Edit User Modal State
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<AuthorizedUser | null>(null);
  const [userName, setUserName] = useState('');
  const [position, setPosition] = useState('');
  const [department, setDepartment] = useState('');
  const [allowedLevels, setAllowedLevels] = useState<AccessLevel[]>(['1']);
  const [userNote, setUserNote] = useState('');

  // Confirmation Modals
  const [deleteConfirmUser, setDeleteConfirmUser] = useState<AuthorizedUser | null>(null);
  const [deleteConfirmProject, setDeleteConfirmProject] = useState<Project | null>(null);
  const [deleteConfirmMeeting, setDeleteConfirmMeeting] = useState<Meeting | null>(null);
  const [showClearLogsConfirm, setShowClearLogsConfirm] = useState(false);

  // Filtered Logs
  const filteredLogs = accessLogs.filter((log) => {
    const matchesSearch =
      log.userName.toLowerCase().includes(logSearchQuery.toLowerCase()) ||
      log.levelLabel.toLowerCase().includes(logSearchQuery.toLowerCase()) ||
      (log.deviceInfo && log.deviceInfo.toLowerCase().includes(logSearchQuery.toLowerCase()));
    const matchesLevel = logLevelFilter === 'all' || log.level === logLevelFilter;
    return matchesSearch && matchesLevel;
  });

  const handleOpenNewUserModal = () => {
    setEditingUser(null);
    setUserName('');
    setPosition('');
    setDepartment('กลุ่มงานบริหารสิ่งแวดล้อมและอาชีวอนามัย');
    setAllowedLevels(['1']);
    setUserNote('');
    setShowUserModal(true);
  };

  const handleOpenEditUserModal = (user: AuthorizedUser) => {
    setEditingUser(user);
    setUserName(user.name);
    setPosition(user.position);
    setDepartment(user.department);
    setAllowedLevels(user.allowedLevels || ['1']);
    setUserNote(user.note || '');
    setShowUserModal(true);
  };

  const handleSaveUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: AuthorizedUser = {
      id: editingUser ? editingUser.id : `user-${Date.now()}`,
      name: userName.trim(),
      position: position.trim(),
      department: department.trim(),
      allowedLevels,
      createdAt: editingUser ? editingUser.createdAt : new Date().toLocaleDateString('th-TH'),
      status: 'active',
      note: userNote.trim() || undefined
    };
    onSaveAuthorizedUser(newUser);
    setShowUserModal(false);
  };

  const handleExportLogs = () => {
    const rows = filteredLogs.map((l, index) => ({
      ลำดับ: index + 1,
      วันเวลาที่เข้าใช้: l.loginTime,
      ชื่อผู้เข้าใช้งาน: l.userName,
      ระดับการเข้าถึง: l.levelLabel,
      รหัสระดับ: l.level,
      อุปกรณ์: l.deviceInfo || '-',
      สถานะ: l.status === 'success' ? 'สำเร็จ' : 'ไม่สำเร็จ'
    }));
    exportToExcel(`GCH_Access_Registry_${new Date().toISOString().slice(0, 10)}`, rows);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-full bg-radial from-emerald-500/10 to-transparent pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-emerald-500/30">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {isAdmin ? '👑 Super Admin Mode' : 'Security & Access Center'}
                </span>
                <span className="text-xs text-slate-400">Green & Clean Hospital Audit</span>
              </div>
              <h1 className="text-xl font-bold tracking-tight mt-0.5 text-white">
                ศูนย์ควบคุม Admin และทะเบียนผู้เข้าใช้งาน (Access Registry)
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isAdmin ? (
              <button
                onClick={onOpenLoginModal}
                className="py-2 px-4 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 transition-colors shadow-md flex items-center gap-1.5"
              >
                <KeyRound className="w-4 h-4" />
                <span>เข้าสู่ระบบด้วยสิทธิ์ Admin</span>
              </button>
            ) : (
              <span className="py-1.5 px-3 rounded-xl text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>ยืนยันสิทธิ์ Admin เรียบร้อยแล้ว (จัดการได้ทุกระบบ)</span>
              </span>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-800 text-xs">
          <div className="bg-white/5 rounded-xl p-3 border border-white/5">
            <span className="text-slate-400 block text-[11px]">การเข้าใช้งานทั้งหมด</span>
            <span className="text-lg font-bold text-white mt-0.5 block">{accessLogs.length} ครั้ง</span>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/5">
            <span className="text-slate-400 block text-[11px]">รายชื่อผู้มีสิทธิในระบบ</span>
            <span className="text-lg font-bold text-emerald-400 mt-0.5 block">{authorizedUsers.length} ท่าน</span>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/5">
            <span className="text-slate-400 block text-[11px]">โครงการทั้งหมด</span>
            <span className="text-lg font-bold text-teal-400 mt-0.5 block">{projects.length} โครงการ</span>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/5">
            <span className="text-slate-400 block text-[11px]">การประชุม & มติ</span>
            <span className="text-lg font-bold text-sky-400 mt-0.5 block">{meetings.length} ครั้ง</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab('logs')}
          className={`py-2 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'logs'
              ? 'bg-emerald-700 text-white shadow-sm shadow-emerald-200'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <History className="w-4 h-4" />
          <span>ทะเบียนผู้เข้าใช้งาน (Audit Trail)</span>
          <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
            activeTab === 'logs' ? 'bg-emerald-800 text-emerald-100' : 'bg-slate-100 text-slate-600'
          }`}>
            {accessLogs.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`py-2 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'users'
              ? 'bg-emerald-700 text-white shadow-sm shadow-emerald-200'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>ทะเบียนรายชื่อผู้มีสิทธิเข้าถึง (Authorized Directory)</span>
          <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
            activeTab === 'users' ? 'bg-emerald-800 text-emerald-100' : 'bg-slate-100 text-slate-600'
          }`}>
            {authorizedUsers.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('projects')}
          className={`py-2 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'projects'
              ? 'bg-emerald-700 text-white shadow-sm shadow-emerald-200'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <FolderKanban className="w-4 h-4" />
          <span>จัดการข้อมูลโครงการ (Admin Projects)</span>
          <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
            activeTab === 'projects' ? 'bg-emerald-800 text-emerald-100' : 'bg-slate-100 text-slate-600'
          }`}>
            {projects.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('meetings')}
          className={`py-2 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'meetings'
              ? 'bg-emerald-700 text-white shadow-sm shadow-emerald-200'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>จัดการการประชุม & มติ (Admin Meetings)</span>
          <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
            activeTab === 'meetings' ? 'bg-emerald-800 text-emerald-100' : 'bg-slate-100 text-slate-600'
          }`}>
            {meetings.length}
          </span>
        </button>
      </div>

      {/* TAB 1: ACCESS LOGS AUDIT TRAIL */}
      {activeTab === 'logs' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          
          {/* Controls Bar */}
          <div className="p-4 border-b border-slate-100 bg-slate-50/60 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <input
                  type="text"
                  value={logSearchQuery}
                  onChange={(e) => setLogSearchQuery(e.target.value)}
                  placeholder="ค้นหาชื่อผู้เข้าใช้ หรือระดับ..."
                  className="w-full text-xs py-2 px-3 pl-8 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-emerald-500"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              </div>

              <select
                value={logLevelFilter}
                onChange={(e) => setLogLevelFilter(e.target.value)}
                className="text-xs py-2 px-3 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-emerald-500"
              >
                <option value="all">ทุกระดับ</option>
                <option value="1">ระดับ 1: ผู้รับผิดชอบ</option>
                <option value="2">ระดับ 2: ผู้รับรอง</option>
                <option value="3">ระดับ 3: ผู้บริหารขั้นต้น</option>
                <option value="4">ระดับ 4: ผู้บริหารขั้นสูง</option>
                <option value="5">ระดับ 5: รับรองสมบูรณ์</option>
                <option value="admin">Admin: ผู้ดูแลระบบ</option>
              </select>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                onClick={handleExportLogs}
                className="py-2 px-3 rounded-lg text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors flex items-center gap-1.5 shadow-2xs"
              >
                <Download className="w-3.5 h-3.5 text-slate-600" />
                <span>ส่งออก Excel/CSV</span>
              </button>

              {isAdmin && accessLogs.length > 0 && (
                <button
                  onClick={() => setShowClearLogsConfirm(true)}
                  className="py-2 px-3 rounded-lg text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>ล้างประวัติ</span>
                </button>
              )}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 w-12 text-center">#</th>
                  <th className="py-3 px-4">วันและเวลาเข้าใช้</th>
                  <th className="py-3 px-4">ชื่อผู้เข้าใช้งาน</th>
                  <th className="py-3 px-4">ระดับสิทธิการเข้าถึง</th>
                  <th className="py-3 px-4">อุปกรณ์ / เบราว์เซอร์</th>
                  <th className="py-3 px-4 text-center">สถานะ</th>
                  {isAdmin && <th className="py-3 px-4 text-right">การจัดการ</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan={isAdmin ? 7 : 6} className="py-8 text-center text-slate-400">
                      ไม่พบประวัติการเข้าใช้งานตามเงื่อนไขที่เลือก
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((log, index) => {
                    const cfg = getAccessLevelConfig(log.level);
                    return (
                      <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-4 text-center text-slate-400 font-mono text-[11px]">
                          {index + 1}
                        </td>
                        <td className="py-3 px-4 font-medium text-slate-900 whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            <span>{log.loginTime}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-semibold text-slate-800">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-[10px]">
                              {log.userName.charAt(0)}
                            </div>
                            <span>{log.userName}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${cfg.badgeClass}`}>
                            <span>{cfg.iconEmoji}</span>
                            <span>{log.level === 'admin' ? 'Super Admin' : `ระดับ ${log.level}`}</span>
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-500 text-[11px]">
                          {log.deviceInfo || 'เว็บเบราว์เซอร์'}
                        </td>
                        <td className="py-3 px-4 text-center whitespace-nowrap">
                          <span className="inline-flex items-center gap-1 text-emerald-700 text-[11px] font-medium bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            สำเร็จ
                          </span>
                        </td>
                        {isAdmin && (
                          <td className="py-3 px-4 text-right whitespace-nowrap">
                            <button
                              onClick={() => onDeleteAccessLog(log.id)}
                              className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                              title="ลบรายการนี้"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        )}
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="p-3 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>แสดง {filteredLogs.length} จากทั้งหมด {accessLogs.length} รายการ</span>
            <span className="text-[11px] text-slate-400">ข้อมูลจัดเก็บอัตโนมัติบน Cloud Firestore</span>
          </div>

        </div>
      )}

      {/* TAB 2: AUTHORIZED USERS DIRECTORY */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                ทะเบียนรายชื่อกรรมการและผู้มีสิทธิเข้าถึงระบบ
              </h2>
              <p className="text-xs text-slate-500">
                Admin สามารถเพิ่มรายชื่อและกำหนดระดับสิทธิที่อนุญาต เพื่อให้ผู้ใช้งานเลือกลงชื่อเข้าใช้ได้อย่างสะดวก
              </p>
            </div>

            {isAdmin && (
              <button
                onClick={handleOpenNewUserModal}
                className="py-2 px-4 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-200 transition-all flex items-center gap-1.5 self-start"
              >
                <Plus className="w-4 h-4" />
                <span>เพิ่มรายชื่อผู้มีสิทธิใหม่</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {authorizedUsers.map((user) => (
              <div
                key={user.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md transition-shadow relative flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-100 to-teal-100 text-emerald-800 font-bold flex items-center justify-center text-xs">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-xs font-bold text-slate-900 leading-snug">
                          {user.name}
                        </h3>
                        <span className="text-[11px] text-emerald-700 font-medium block">
                          {user.position}
                        </span>
                      </div>
                    </div>

                    {isAdmin && (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleOpenEditUserModal(user)}
                          className="p-1 rounded-md text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                          title="แก้ไขข้อมูล"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmUser(user)}
                          className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="ลบรายชื่อ"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-100 mt-2 mb-3">
                    <span className="block font-semibold text-slate-600">กลุ่มงาน/สังกัด:</span>
                    <span>{user.department || '-'}</span>
                    {user.note && (
                      <span className="block mt-1 text-[10px] text-slate-400 italic">
                        หมายเหตุ: {user.note}
                      </span>
                    )}
                  </div>

                  <div>
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                      ระดับสิทธิที่อนุญาต:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {user.allowedLevels && user.allowedLevels.length > 0 ? (
                        user.allowedLevels.map((lvl) => {
                          const cfg = getAccessLevelConfig(lvl);
                          return (
                            <span
                              key={lvl}
                              className={`text-[10px] px-2 py-0.5 rounded-md font-semibold border ${cfg.badgeClass}`}
                            >
                              {cfg.iconEmoji} {lvl === 'admin' ? 'Admin' : `ระดับ ${lvl}`}
                            </span>
                          );
                        })
                      ) : (
                        <span className="text-[10px] text-slate-400">ทุกระดับ</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-3 mt-4 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                  <span>บันทึกเมื่อ: {user.createdAt || '-'}</span>
                  <span className="text-emerald-600 font-semibold flex items-center gap-1">
                    <UserCheck className="w-3 h-3" />
                    พร้อมใช้งาน
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* TAB 3: PROJECTS GOVERNANCE */}
      {activeTab === 'projects' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50/60 flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-slate-800">
                รายการโครงการทั้งหมดในระบบ (สิทธิ์จัดการ Admin)
              </h3>
              <p className="text-[11px] text-slate-500">
                Admin สามารถแก้ไขข้อมูล เปลี่ยนระดับ Workflow หรือลบโครงการได้ทุกรายการ
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200">
              {projects.length} โครงการ
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">รหัส & ชื่อโครงการ</th>
                  <th className="py-3 px-4">หมวดหมู่</th>
                  <th className="py-3 px-4">ผู้รับผิดชอบ</th>
                  <th className="py-3 px-4">ความก้าวหน้า</th>
                  <th className="py-3 px-4">ระดับ Workflow</th>
                  <th className="py-3 px-4 text-right">การจัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {projects.map((proj) => {
                  const cat = categories.find((c) => c.id === proj.categoryId);
                  return (
                    <tr key={proj.id} className="hover:bg-slate-50/70">
                      <td className="py-3 px-4 font-semibold text-slate-900">
                        <span className="text-[10px] font-mono text-slate-400 block">{proj.code}</span>
                        <span>{proj.name}</span>
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {cat?.name || proj.categoryId}
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        <span>{proj.responsiblePerson}</span>
                        <span className="text-[10px] text-slate-400 block">{proj.department}</span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 rounded-full bg-slate-100 overflow-hidden">
                            <div
                              className="h-full bg-emerald-500 rounded-full"
                              style={{ width: `${proj.progressPercent}%` }}
                            />
                          </div>
                          <span className="text-[11px] font-bold text-slate-700">{proj.progressPercent}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-sky-50 text-sky-700 border border-sky-200">
                          ระดับ {proj.workflowLevel}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onEditProject(proj)}
                            className="py-1 px-2.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center gap-1"
                          >
                            <Edit className="w-3 h-3" />
                            <span>แก้ไข</span>
                          </button>
                          {isAdmin && (
                            <button
                              onClick={() => setDeleteConfirmProject(proj)}
                              className="p-1 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors"
                              title="ลบโครงการ"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: MEETINGS GOVERNANCE */}
      {activeTab === 'meetings' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50/60 flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-slate-800">
                รายการบันทึกการประชุมและมติ (Admin Meetings)
              </h3>
              <p className="text-[11px] text-slate-500">
                Admin สามารถตรวจสอบ ลบ หรือบริหารจัดการมติและการรับรองทั้งหมด
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200">
              {meetings.length} การประชุม
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">รหัส & ชื่อการประชุม</th>
                  <th className="py-3 px-4">วันที่ประชุม</th>
                  <th className="py-3 px-4">ประธานที่ประชุม</th>
                  <th className="py-3 px-4">มติที่ประชุม</th>
                  <th className="py-3 px-4">การลงนามรับรอง</th>
                  {isAdmin && <th className="py-3 px-4 text-right">การจัดการ</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {meetings.map((m) => {
                  const endorsedCount = (m.endorsements || []).filter(e => e.decision === 'endorsed').length;
                  const rejectedCount = (m.endorsements || []).filter(e => e.decision === 'rejected').length;

                  return (
                    <tr key={m.id} className="hover:bg-slate-50/70">
                      <td className="py-3 px-4 font-semibold text-slate-900">
                        <span className="text-[10px] font-mono text-slate-400 block">{m.code}</span>
                        <span>{m.title}</span>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-slate-600">
                        {m.date}
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {m.chairman}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-slate-800">{m.resolutions.length} มติ</span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5 text-[11px]">
                          <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            รับรอง {endorsedCount}
                          </span>
                          {rejectedCount > 0 && (
                            <span className="text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                              ไม่รับรอง {rejectedCount}
                            </span>
                          )}
                        </div>
                      </td>
                      {isAdmin && (
                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          <button
                            onClick={() => setDeleteConfirmMeeting(m)}
                            className="p-1 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors"
                            title="ลบการประชุม"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT AUTHORIZED USER */}
      {showUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto animate-in fade-in">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6">
            
            <div className="bg-slate-900 text-white p-5">
              <h3 className="text-base font-bold">
                {editingUser ? 'แก้ไขรายชื่อผู้มีสิทธิเข้าถึง' : 'เพิ่มรายชื่อกรรมการ / ผู้มีสิทธิใหม่'}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                กำหนดชื่อ ตำแหน่ง และระดับสิทธิที่บุคคลนี้สามารถเลือกลงชื่อเข้าใช้งานได้
              </p>
            </div>

            <form onSubmit={handleSaveUserSubmit} className="p-6 space-y-4">
              
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  ชื่อ-นามสกุล <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="เช่น นพ.เกรียงศักดิ์ ธรรมรัตน์"
                  required
                  className="w-full text-xs py-2 px-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-slate-800"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    ตำแหน่ง <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    placeholder="เช่น รองผู้อำนวยการฝ่ายการแพทย์"
                    required
                    className="w-full text-xs py-2 px-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-slate-800"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    กลุ่มงาน / สังกัด
                  </label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="เช่น กลุ่มงานบริหารสิ่งแวดล้อม"
                    className="w-full text-xs py-2 px-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                  ระดับสิทธิที่อนุญาตให้บุคคลนี้เข้าถึง (เลือกได้หลายระดับ) <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['1', '2', '3', '4', '5', 'admin'] as AccessLevel[]).map((lvl) => {
                    const cfg = getAccessLevelConfig(lvl);
                    const isChecked = allowedLevels.includes(lvl);

                    return (
                      <label
                        key={lvl}
                        className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer text-xs transition-colors ${
                          isChecked
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-semibold'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setAllowedLevels(prev => [...prev, lvl]);
                            } else {
                              setAllowedLevels(prev => prev.filter(x => x !== lvl));
                            }
                          }}
                          className="rounded text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5"
                        />
                        <span>{cfg.iconEmoji} {lvl === 'admin' ? 'Admin' : `ระดับ ${lvl}`}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  หมายเหตุเพิ่มเติม (ถ้ามี)
                </label>
                <input
                  type="text"
                  value={userNote}
                  onChange={(e) => setUserNote(e.target.value)}
                  placeholder="เช่น กรรมการและเลขานุการคณะทำงาน GCH"
                  className="w-full text-xs py-2 px-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-slate-800"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowUserModal(false)}
                  className="py-2 px-4 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="py-2 px-5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-md shadow-emerald-200"
                >
                  {editingUser ? 'บันทึกการแก้ไข' : 'เพิ่มรายชื่อ'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* CONFIRM DELETE USER */}
      {deleteConfirmUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">ยืนยันลบรายชื่อผู้มีสิทธิ</h3>
                <span className="text-xs text-slate-500">การลบนี้จะมีผลกับระบบทันที</span>
              </div>
            </div>

            <p className="text-xs text-slate-700">
              คุณต้องการลบรายชื่อ &quot;<strong>{deleteConfirmUser.name}</strong>&quot; ออกจากทะเบียนผู้มีสิทธิเข้าถึงระบบใช่หรือไม่?
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmUser(null)}
                className="py-2 px-4 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                ยกเลิก
              </button>
              <button
                onClick={() => {
                  onDeleteAuthorizedUser(deleteConfirmUser.id);
                  setDeleteConfirmUser(null);
                }}
                className="py-2 px-4 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 transition-colors shadow-sm"
              >
                ยืนยันลบ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE PROJECT */}
      {deleteConfirmProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">ยืนยันลบโครงการ (สิทธิ์ Admin)</h3>
                <span className="text-xs text-slate-500">{deleteConfirmProject.code}</span>
              </div>
            </div>

            <p className="text-xs text-slate-700">
              คุณแน่ใจหรือไม่ว่าต้องการลบโครงการ &quot;<strong>{deleteConfirmProject.name}</strong>&quot; ออกจากระบบคลาวด์อย่างถาวร?
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmProject(null)}
                className="py-2 px-4 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                ยกเลิก
              </button>
              <button
                onClick={() => {
                  onDeleteProject(deleteConfirmProject.id);
                  setDeleteConfirmProject(null);
                }}
                className="py-2 px-4 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 transition-colors shadow-sm"
              >
                ยืนยันลบโครงการ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MEETING */}
      {deleteConfirmMeeting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">ยืนยันลบการประชุม</h3>
                <span className="text-xs text-slate-500">{deleteConfirmMeeting.code}</span>
              </div>
            </div>

            <p className="text-xs text-slate-700">
              คุณแน่ใจหรือไม่ว่าต้องการลบ &quot;<strong>{deleteConfirmMeeting.title}</strong>&quot; และมติทั้งหมดในการประชุมนี้?
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmMeeting(null)}
                className="py-2 px-4 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                ยกเลิก
              </button>
              <button
                onClick={() => {
                  onDeleteMeeting(deleteConfirmMeeting.id);
                  setDeleteConfirmMeeting(null);
                }}
                className="py-2 px-4 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 transition-colors shadow-sm"
              >
                ยืนยันลบการประชุม
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM CLEAR ALL LOGS */}
      {showClearLogsConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">ยืนยันล้างประวัติการเข้าใช้งาน</h3>
                <span className="text-xs text-slate-500">การดำเนินการนี้สำหรับ Admin เท่านั้น</span>
              </div>
            </div>

            <p className="text-xs text-slate-700">
              ระบบจะลบประวัติการเข้าใช้งานทั้งหมด ({accessLogs.length} รายการ) ออกจาก Cloud Firestore ข้อมูลนี้ไม่สามารถกู้คืนได้
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowClearLogsConfirm(false)}
                className="py-2 px-4 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                ยกเลิก
              </button>
              <button
                onClick={() => {
                  onClearAccessLogs();
                  setShowClearLogsConfirm(false);
                }}
                className="py-2 px-4 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 transition-colors shadow-sm"
              >
                ยืนยันล้างประวัติทั้งหมด
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
