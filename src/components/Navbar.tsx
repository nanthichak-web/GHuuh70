import React, { useState } from 'react';
import {
  Leaf,
  Bell,
  CheckCircle2,
  Printer,
  ChevronDown,
  Plus,
  Search,
  Check,
  Building,
  Calendar,
  Layers,
  FileCheck,
  FolderKanban,
  ShieldAlert,
  KeyRound,
  LogOut,
  User,
  Shield
} from 'lucide-react';
import { UserRole, NotificationItem, UserSession } from '../types';
import { getUserRoleLabel, getAccessLevelConfig } from '../utils/helpers';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  activeRole: UserRole;
  setActiveRole: (role: UserRole) => void;
  notifications: NotificationItem[];
  onMarkNotificationAsRead: (id: string) => void;
  onOpenNewProjectModal: () => void;
  onPrint: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  cloudConnected?: boolean;
  isSyncing?: boolean;
  currentSession: UserSession | null;
  onOpenLoginModal: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  activeRole,
  setActiveRole,
  notifications,
  onMarkNotificationAsRead,
  onOpenNewProjectModal,
  onPrint,
  searchQuery,
  setSearchQuery,
  cloudConnected = true,
  isSyncing = false,
  currentSession,
  onOpenLoginModal,
  onLogout
}) => {
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const roles: { role: UserRole; title: string; desc: string }[] = [
    {
      role: 'officer',
      title: '👤 ระดับ 1: ผู้รับผิดชอบงาน',
      desc: 'สร้างงาน รายงานความก้าวหน้า อัปโหลดหลักฐาน'
    },
    {
      role: 'supervisor',
      title: '👨‍💼 ระดับ 2: ผู้รับรอง / หัวหน้างาน',
      desc: 'ตรวจความถูกต้อง รับรอง / ส่งกลับแก้ไข'
    },
    {
      role: 'middle_exec',
      title: '👔 ระดับ 3: ผู้บริหารขั้นต้น',
      desc: 'หัวหน้ากลุ่มงาน/ฝ่าย ตรวจสอบและอนุมัติ'
    },
    {
      role: 'senior_exec',
      title: '🏥 ระดับ 4: ผู้บริหารขั้นสูง (ผอ./รอง ผอ.)',
      desc: 'Executive Dashboard ภาพรวม และรับรองระดับ รพ.'
    },
    {
      role: 'evaluator',
      title: '📋 ระดับ 5: ผู้ประเมินภายนอก (กรรมการ GCH)',
      desc: 'ตรวจ Evidence Matrix และรับรองมาตรฐาน'
    },
    {
      role: 'admin',
      title: '👑 ผู้ดูแลระบบสูงสุด (Super Admin)',
      desc: 'จัดการข้อมูลทุกอย่าง ทะเบียนผู้ใช้งาน และสิทธิ์'
    }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentTab('dashboard')}
              className="flex items-center gap-2.5 text-left focus:outline-none group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-sm shadow-emerald-200 group-hover:scale-105 transition-transform">
                <Leaf className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-lg tracking-tight text-slate-900 flex items-center gap-1.5">
                    GREEN CARE TRACK
                  </span>
                  <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
                    GCH System
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-normal truncate max-w-[210px] sm:max-w-none">
                  ระบบติดตามผลการดำเนินงาน Green & Clean Hospital
                </p>
              </div>
            </button>
          </div>

          {/* Center: Search Bar */}
          <div className="hidden md:flex flex-1 max-w-xs lg:max-w-sm mx-2">
            <div className="relative w-full">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ค้นหาโครงการ, KPI, หมวด, หรือผู้รับผิดชอบ..."
                className="w-full pl-9 pr-3 py-1.5 text-sm bg-slate-100/80 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all text-slate-800 placeholder:text-slate-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Right Controls: Cloud Status, Role Switcher, Notifications, New Project */}
          <div className="flex items-center gap-2">
            {/* Real-time Cloud Firestore Indicator */}
            <div
              className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
                cloudConnected
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-amber-50 text-amber-800 border-amber-200'
              }`}
              title={
                cloudConnected
                  ? 'เชื่อมต่อ Cloud Firestore & Storage สำเร็จ (Real-time Sync Active)'
                  : 'กำลังเชื่อมต่อฐานข้อมูลคลาวด์...'
              }
            >
              <span className="relative flex h-2 w-2">
                {cloudConnected && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                )}
                <span
                  className={`relative inline-flex rounded-full h-2 w-2 ${
                    cloudConnected ? 'bg-emerald-500' : 'bg-amber-500'
                  }`}
                ></span>
              </span>
              <span className="hidden md:inline">
                {isSyncing ? 'กำลังซิงค์...' : cloudConnected ? 'Cloud Realtime' : 'กำลังเชื่อมต่อ'}
              </span>
            </div>

            {/* User Session / Login Button */}
            <div className="relative">
              {currentSession ? (
                <div>
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-emerald-200 bg-emerald-50/90 text-xs font-semibold text-emerald-900 hover:bg-emerald-100 transition-colors shadow-2xs"
                    title={`เข้าสู่ระบบในชื่อ: ${currentSession.userName} (${currentSession.levelLabel})`}
                  >
                    <div className="w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center text-[10px] font-bold">
                      {currentSession.level === 'admin' ? '👑' : currentSession.level}
                    </div>
                    <span className="max-w-[100px] sm:max-w-[140px] truncate text-slate-800">
                      {currentSession.userName}
                    </span>
                    <span className="hidden md:inline-block px-1.5 py-0.2 rounded text-[10px] bg-white border border-emerald-300 text-emerald-800 font-bold">
                      {currentSession.level === 'admin' ? 'Admin' : `ระดับ ${currentSession.level}`}
                    </span>
                    <ChevronDown className="w-3 h-3 text-emerald-700" />
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 py-2.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                      <div className="px-3.5 py-2 border-b border-slate-100">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                            {currentSession.userName.charAt(0)}
                          </div>
                          <div className="overflow-hidden">
                            <p className="text-xs font-bold text-slate-900 truncate">
                              {currentSession.userName}
                            </p>
                            <p className="text-[11px] text-emerald-700 truncate font-medium">
                              {currentSession.levelLabel}
                            </p>
                          </div>
                        </div>
                        <div className="mt-2 text-[10px] text-slate-400">
                          เข้าใช้งานเมื่อ: {currentSession.loginTime}
                        </div>
                      </div>

                      <div className="py-1">
                        <button
                          onClick={() => {
                            setShowUserMenu(false);
                            setCurrentTab('admin');
                          }}
                          className="w-full px-3.5 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors"
                        >
                          <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                          <span>ศูนย์ควบคุม Admin & ทะเบียนผู้ใช้งาน</span>
                        </button>

                        <button
                          onClick={() => {
                            setShowUserMenu(false);
                            onOpenLoginModal();
                          }}
                          className="w-full px-3.5 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors"
                        >
                          <KeyRound className="w-3.5 h-3.5 text-amber-600" />
                          <span>สลับระดับสิทธิ / เข้าสู่ระบบด้วยชื่ออื่น</span>
                        </button>

                        <button
                          onClick={() => {
                            setShowUserMenu(false);
                            onLogout();
                          }}
                          className="w-full px-3.5 py-2 text-left text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition-colors"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>ออกจากระบบ</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={onOpenLoginModal}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold transition-all shadow-2xs"
                  title="ลงชื่อเข้าใช้งานตามระดับ 1-5 หรือ Admin"
                >
                  <KeyRound className="w-3.5 h-3.5 text-amber-700" />
                  <span className="hidden sm:inline">ลงชื่อเข้าใช้งาน</span>
                  <span className="sm:hidden">เข้าสู่ระบบ</span>
                </button>
              )}
            </div>

            {/* Role Switcher */}
            <div className="relative">
              <button
                onClick={() => setShowRoleMenu(!showRoleMenu)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-emerald-300 bg-slate-50/80 text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors"
                title="สลับมุมมองบทบาท (Role Switcher)"
              >
                <span className="max-w-[110px] sm:max-w-none truncate">
                  {getUserRoleLabel(activeRole)}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </button>

              {showRoleMenu && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-3 py-1.5 border-b border-slate-100 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    สลับบทบาทการทำงานในระบบ
                  </div>
                  {roles.map((item) => (
                    <button
                      key={item.role}
                      onClick={() => {
                        setActiveRole(item.role);
                        setShowRoleMenu(false);
                      }}
                      className={`w-full px-3 py-2 text-left text-xs flex items-start justify-between hover:bg-emerald-50/60 transition-colors ${
                        activeRole === item.role ? 'bg-emerald-50 text-emerald-900 font-semibold' : 'text-slate-700'
                      }`}
                    >
                      <div>
                        <div className="font-medium text-slate-800">{item.title}</div>
                        <div className="text-[11px] text-slate-500 font-normal mt-0.5">{item.desc}</div>
                      </div>
                      {activeRole === item.role && (
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Notifications Menu */}
            <div className="relative">
              <button
                onClick={() => setShowNotifMenu(!showNotifMenu)}
                className="relative p-2 rounded-lg text-slate-600 hover:text-emerald-700 hover:bg-slate-100 transition-colors focus:outline-none"
                title="การแจ้งเตือน"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white animate-pulse" />
                )}
              </button>

              {showNotifMenu && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800">
                      <Bell className="w-3.5 h-3.5 text-emerald-600" />
                      <span>การแจ้งเตือน ({unreadCount} รายการใหม่)</span>
                    </div>
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-xs text-slate-400">
                        ไม่มีการแจ้งเตือน
                      </div>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => onMarkNotificationAsRead(n.id)}
                          className={`p-3 text-left hover:bg-slate-50 cursor-pointer transition-colors ${
                            !n.isRead ? 'bg-emerald-50/40' : ''
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="text-xs font-semibold text-slate-800">
                              {n.title}
                            </span>
                            <span className="text-[10px] text-slate-400 whitespace-nowrap">
                              {n.date}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                            {n.message}
                          </p>
                          {!n.isRead && (
                            <span className="inline-block mt-1.5 text-[10px] font-medium text-emerald-700 bg-emerald-100/70 px-1.5 py-0.2 rounded">
                              ยังไม่ได้อ่าน
                            </span>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Print button */}
            <button
              onClick={onPrint}
              className="p-2 rounded-lg text-slate-600 hover:text-emerald-700 hover:bg-slate-100 transition-colors hidden sm:flex items-center"
              title="พิมพ์รายงานสรุปผล (Print / Export PDF)"
            >
              <Printer className="w-4 h-4" />
            </button>

            {/* New Project Button */}
            <button
              onClick={onOpenNewProjectModal}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded-lg shadow-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">บันทึกงานใหม่</span>
              <span className="sm:hidden">เพิ่ม</span>
            </button>
          </div>

        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto py-2 scrollbar-none border-t border-slate-100 text-xs font-medium">
          <button
            onClick={() => setCurrentTab('dashboard')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
              currentTab === 'dashboard'
                ? 'bg-emerald-600 text-white font-semibold shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Building className="w-3.5 h-3.5" />
            <span>🏠 Dashboard ผู้บริหาร</span>
          </button>

          <button
            onClick={() => setCurrentTab('projects')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
              currentTab === 'projects'
                ? 'bg-emerald-600 text-white font-semibold shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <FolderKanban className="w-3.5 h-3.5" />
            <span>📋 งานและโครงการ</span>
          </button>

          <button
            onClick={() => setCurrentTab('categories')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
              currentTab === 'categories'
                ? 'bg-emerald-600 text-white font-semibold shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>หมวดมาตรฐาน 9 ด้าน</span>
          </button>

          <button
            onClick={() => setCurrentTab('evidence-matrix')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
              currentTab === 'evidence-matrix'
                ? 'bg-emerald-600 text-white font-semibold shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <FileCheck className="w-3.5 h-3.5" />
            <span>📎 Evidence Matrix ตรวจประเมิน</span>
          </button>

          <button
            onClick={() => setCurrentTab('meetings')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
              currentTab === 'meetings'
                ? 'bg-emerald-600 text-white font-semibold shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>📅 ติดตามการประชุม (Resolutions)</span>
          </button>

          <button
            onClick={() => setCurrentTab('admin')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
              currentTab === 'admin'
                ? 'bg-rose-700 text-white font-bold shadow-xs ring-2 ring-rose-300'
                : 'text-rose-700 bg-rose-50/80 hover:bg-rose-100 border border-rose-200/80 font-semibold'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>👑 ศูนย์ควบคุม Admin & ทะเบียน</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
